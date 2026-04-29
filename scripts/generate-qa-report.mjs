#!/usr/bin/env node
/**
 * QA 리포트 생성기
 * Playwright results.json → TC-ID 매핑 QA 결과 HTML 생성
 * 사용: node scripts/generate-qa-report.mjs [결과 파일 경로]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root   = resolve(__dir, '..');

const jsonPath = process.argv[2] ?? resolve(root, 'playwright-report/results.json');
const htmlOut  = resolve(root, 'playwright-report/qa-report.html');

if (!existsSync(jsonPath)) {
  console.error(`결과 파일 없음: ${jsonPath}`);
  console.error('먼저 테스트를 실행하세요: npm run test:qa');
  process.exit(1);
}

const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));

// ── docs/qa 활성 TC-ID 수 — 파일 직접 파싱 (삭제된 TC 제외) ─────────────────
const ACTIVE_ROW_RE2 = /^\|\s*([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)\s*\|/;
const DELETED_ROW_RE2 = /^\|\s*~~([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)~~\s*\|/;
const TC_ID_RE2 = /^[A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*$/;

function buildDocsCounts(docsDir) {
  // 활성 + 삭제된 TC 모두 포함 (전체 docs 기준)
  const seen = new Set();
  const counts = {};
  if (!existsSync(docsDir)) return counts;
  for (const entry of readdirSync(docsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const lines = readFileSync(join(docsDir, entry.name), 'utf-8').split('\n');
    for (const line of lines) {
      const del = line.match(DELETED_ROW_RE2);
      const act = line.match(ACTIVE_ROW_RE2);
      const tcId = del?.[1] ?? (act && TC_ID_RE2.test(act[1]) ? act[1] : null);
      if (!tcId || seen.has(tcId)) continue;
      seen.add(tcId);
      const mod = tcId.match(/^(HOME-TA|HOME-TP|[A-Z]+)/)?.[1] ?? '?';
      counts[mod] = (counts[mod] ?? 0) + 1;
    }
  }
  return counts;
}

const DOCS_COUNTS = buildDocsCounts(resolve(root, 'docs/qa'));
const DOCS_TOTAL = Object.values(DOCS_COUNTS).reduce((a, b) => a + b, 0);

// ── spec 파일 파싱 — test.skip() 이유 추출 ───────────────────────────────────

function parseSpecReasons(specDir) {
  const reasons = new Map(); // tcId → reason string

  function readDir(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) readDir(full);
      else if (entry.name.endsWith('.spec.ts')) parseSpec(full);
    }
  }

  function parseSpec(filePath) {
    const lines = readFileSync(filePath, 'utf-8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match: test.skip('[TC-ID...] title', — handles HOME-TA/HOME-TP compound prefixes
      const m = line.match(/test\.skip\(\s*['"](\[([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)\][^'"]*)['"]/);
      if (!m) continue;
      const tcId = m[2];
      // Look for first // comment in next 6 lines (inside body)
      let reason = '';
      for (let j = i + 1; j < Math.min(i + 7, lines.length); j++) {
        if (lines[j].includes('});') || lines[j].match(/^\s*}\s*\);\s*$/)) break;
        const cm = lines[j].match(/\/\/\s*(.+)/);
        if (cm) { reason = cm[1].trim(); break; }
      }
      // Clean MANUAL:/SKIP:/DEPRECATED: prefixes
      reason = reason.replace(/^MANUAL:\s*/i, '').replace(/^SKIP:\s*/i, '').replace(/^DEPRECATED:\s*/i, '');
      reasons.set(tcId, reason || '사유 미기재');
    }
  }

  readDir(specDir);
  return reasons;
}

const specReasons = parseSpecReasons(resolve(root, 'tests/qa'));

// ── TC-ID 파서 ────────────────────────────────────────────────────────────────
// HOME-TA / HOME-TP 같은 복합 prefix 지원 — (?:-[A-Z]+)* 추가
const TC_RE = /^\[([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d-]+)\](\[M\]|\[S\]|\[D\])?/;

function parseTcId(title) {
  const m = title.match(TC_RE);
  if (!m) return null;
  return { id: m[1], tag: m[2] ?? '' };
}

function moduleOf(tcId) {
  // HOME-TA / HOME-TP 먼저 체크 (단순 split 시 HOME만 남음)
  const m = tcId.match(/^(HOME-TA|HOME-TP|[A-Z]+)/);
  return m ? m[1] : tcId.split('-')[0];
}

// ── 결과 수집 ─────────────────────────────────────────────────────────────────

function collectSpecs(suite, filePath) {
  const results = [];
  for (const spec of suite.specs ?? []) {
    const result = spec.tests?.[0]?.results?.[0] ?? {};
    results.push({
      file: filePath,
      title: spec.title,
      status: result.status ?? 'unknown',
      duration: result.duration ?? 0,
      error: result.error?.message?.split('\n')[0]?.slice(0, 200) ?? null,
    });
  }
  for (const sub of suite.suites ?? []) results.push(...collectSpecs(sub, filePath));
  return results;
}

const allSpecs = [];

for (const fileSuite of data.suites ?? []) {
  const file = fileSuite.file ?? fileSuite.title ?? '';
  if (!file.includes('qa/') && !file.includes('qa\\')) continue;
  allSpecs.push(...collectSpecs(fileSuite, file));
}

// ── TC-ID 매핑 ────────────────────────────────────────────────────────────────

const tcMap = new Map();

// 1) 결과 JSON 기반으로 채움
for (const spec of allSpecs) {
  const parsed = parseTcId(spec.title);
  if (!parsed) continue;
  const { id, tag } = parsed;
  const reason = specReasons.get(id) ?? '';
  tcMap.set(id, { id, tag, title: spec.title, status: spec.status, error: spec.error, file: spec.file, reason });
}

// 2) spec 파일 직접 파싱 — 결과 JSON에 없는 TC도 포함 ([D] 새로 추가된 것 등)
function collectAllSpecTcs(specDir) {
  const out = [];
  const RE = /test(?:\.skip)?\s*\(\s*['"](\[([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)\](\[M\]|\[S\]|\[D\])?[^'"]*)['"]/g;
  function walk(d) {
    if (!existsSync(d)) return;
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.spec.ts')) {
        const content = readFileSync(full, 'utf-8');
        let m;
        while ((m = RE.exec(content)) !== null) {
          out.push({ id: m[2], tag: m[3] ?? '', title: m[1] });
        }
        RE.lastIndex = 0;
      }
    }
  }
  walk(specDir);
  return out;
}

for (const tc of collectAllSpecTcs(resolve(root, 'tests/qa'))) {
  if (tcMap.has(tc.id)) {
    // 결과 JSON에 있으면 tag만 보강 ([D]는 결과 status보다 우선)
    const existing = tcMap.get(tc.id);
    if (tc.tag && !existing.tag) existing.tag = tc.tag;
  } else {
    // 결과 JSON에 없는 TC — 정적 분류 (대부분 [D]/[M]/[S] test.skip)
    tcMap.set(tc.id, {
      id: tc.id, tag: tc.tag, title: tc.title,
      status: 'skipped', error: null, file: '',
      reason: specReasons.get(tc.id) ?? '',
    });
  }
}

// ── 모듈별 그룹화 ─────────────────────────────────────────────────────────────

const moduleOrder = ['AUTH', 'MY', 'HOME-TP', 'HOME-TA', 'TA', 'GO', 'EO', 'EI', 'ER', 'SP', 'TF'];
const moduleLabels = {
  'AUTH':    'AUTH — 로그인/회원가입',
  'MY':      'MY — 내 정보',
  'HOME-TP': 'HOME-TP — 홈·GNB·알림 (납세자)',
  'HOME-TA': 'HOME-TA — 홈·GNB·알림 (세무사)',
  'TA':      'TA — 세무대리인 찾기',
  'GO':      'GO — 현직 공무원 탐색',
  'EO':      'EO — 전직 공무원 찾기',
  'EI':      'EI — 전문 이력 관리',
  'ER':      'ER — 전문 이력 리포트',
  'SP':      'SP — 구독 관리',
  'TF':      'TF — 법인&팀연동관리',
};

const byModule = new Map();
for (const mod of moduleOrder) byModule.set(mod, []);

for (const [, tc] of tcMap) {
  const mod = moduleOf(tc.id);
  if (!byModule.has(mod)) byModule.set(mod, []);
  byModule.get(mod).push(tc);
}

for (const [, tcs] of byModule) {
  tcs.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));
}

// ── 결과 분류 ─────────────────────────────────────────────────────────────────

function classifyResult(tc) {
  if (tc.tag === '[D]') return 'deprecated';
  if (tc.tag === '[M]') return 'manual';
  if (tc.tag === '[S]') return 'skip';
  if (tc.status === 'passed') return 'pass';
  if (tc.status === 'failed' || tc.status === 'timedOut' || tc.status === 'interrupted') return 'fail';
  if (tc.status === 'skipped') return 'skip';
  return 'unknown';
}

function resultIcon(result) {
  return { pass: '✅', fail: '❌', manual: '⏭️', skip: '👤', deprecated: '🗑️', unknown: '❓' }[result] ?? '❓';
}

function resultLabel(result) {
  return { pass: 'PASS', fail: 'FAIL', manual: '수동', skip: '스킵', deprecated: '삭제', unknown: '?' }[result] ?? '?';
}

// 스킵 이유 분류
function skipReasonLabel(tc) {
  if (tc.reason) return tc.reason;
  if (tc.status === 'skipped') return '조건부 스킵 — UI 요소 미노출 또는 기능 미제공 시 자동 스킵';
  return '사유 미기재';
}

// ── 집계 ──────────────────────────────────────────────────────────────────────

const now = new Date().toLocaleString('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
});

const allTcs = [...tcMap.values()];
const totalAll        = allTcs.length;
const totalPass       = allTcs.filter(t => classifyResult(t) === 'pass').length;
const totalFail       = allTcs.filter(t => classifyResult(t) === 'fail').length;
const totalManual     = allTcs.filter(t => classifyResult(t) === 'manual').length;
const totalSkip       = allTcs.filter(t => classifyResult(t) === 'skip').length;
const totalDeprecated = allTcs.filter(t => classifyResult(t) === 'deprecated').length;
const autoTotal       = totalAll - totalManual - totalSkip - totalDeprecated;
const overallStatus = totalFail > 0 ? 'FAIL' : 'PASS';
const coveragePct = Math.min(100, Math.round((totalAll / DOCS_TOTAL) * 100));
const notImpl = Math.max(0, DOCS_TOTAL - totalAll);

// ── HTML 생성 헬퍼 ────────────────────────────────────────────────────────────

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shortTitle(title) {
  return title.replace(/^\[[^\]]+\](\[M\]|\[S\])?\s*/, '');
}

// ── 커버리지 표 ───────────────────────────────────────────────────────────────

function coverageTable() {
  const rows = moduleOrder.map(mod => {
    const tcs = byModule.get(mod) ?? [];
    const docsTotal = DOCS_COUNTS[mod] ?? 0;
    const impl = tcs.length;
    const notImpl = Math.max(0, docsTotal - impl);
    const pct = docsTotal > 0 ? Math.round((impl / docsTotal) * 100) : 0;
    const barColor = pct >= 70 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626';
    return `<tr>
      <td><a href="#module-${mod}">${mod}</a></td>
      <td class="num">${docsTotal}</td>
      <td class="num pass-cell">${impl}</td>
      <td class="num skip-cell">${notImpl > 0 ? notImpl : '—'}</td>
      <td class="num">
        <div style="display:flex;align-items:center;gap:6px;">
          <div style="width:80px;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${barColor};"></div>
          </div>
          <span style="font-size:0.75rem;color:${barColor};font-weight:600;">${pct}%</span>
        </div>
      </td>
    </tr>`;
  }).join('\n');

  const totalNotImpl = notImpl;
  return `<section id="coverage">
    <h2 style="font-size:1rem;font-weight:700;padding:12px 16px;background:#f3f4f6;border:1px solid #e5e7eb;border-bottom:none;border-radius:8px 8px 0 0;">
      📊 자동화 커버리지 — docs/qa 기준 ${DOCS_TOTAL}건 중 ${totalAll}건 구현 (${coveragePct}%)
    </h2>
    <div style="padding:10px 16px;font-size:0.82rem;color:#6b7280;background:#fffbeb;border:1px solid #fcd34d;border-bottom:none;">
      ⚠️ 미구현 ${totalNotImpl}건은 docs/qa에 정의되어 있으나 아직 자동화 스펙 파일에 구현되지 않은 TC입니다. 우선순위에 따라 순차 구현 예정입니다.
    </div>
    <div class="tc-table-wrap">
    <table class="tc-table" style="border-radius:0 0 8px 8px;table-layout:auto;">
      <colgroup><col style="width:120px"><col style="width:90px"><col style="width:70px"><col style="width:70px"><col></colgroup>
      <thead>
        <tr><th>모듈</th><th class="num">docs 총계</th><th class="num">구현</th><th class="num">미구현</th><th>커버리지</th></tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr style="font-weight:700;background:#f9fafb;">
          <td>합계</td>
          <td class="num">${DOCS_TOTAL}</td>
          <td class="num pass-cell">${totalAll}</td>
          <td class="num skip-cell">${totalNotImpl}</td>
          <td><span style="font-size:0.8rem;font-weight:700;color:${coveragePct >= 70 ? '#16a34a' : '#d97706'};">${coveragePct}%</span></td>
        </tr>
      </tfoot>
    </table>
    </div>
  </section>`;
}

// ── 모듈 요약 표 행 ──────────────────────────────────────────────────────────

function summaryRows() {
  return moduleOrder.map(mod => {
    const tcs = byModule.get(mod) ?? [];
    if (!tcs.length) return '';
    const p  = tcs.filter(t => classifyResult(t) === 'pass').length;
    const f  = tcs.filter(t => classifyResult(t) === 'fail').length;
    const m  = tcs.filter(t => classifyResult(t) === 'manual').length;
    const sk = tcs.filter(t => classifyResult(t) === 'skip').length;
    const d  = tcs.filter(t => classifyResult(t) === 'deprecated').length;
    const cls = f > 0 ? 'fail' : 'pass';
    return `<tr class="${cls}">
      <td><a href="#module-${mod}">${mod}</a></td>
      <td class="num">${tcs.length}</td>
      <td class="num pass-cell">${p}</td>
      <td class="num ${f > 0 ? 'fail-cell' : ''}">${f > 0 ? f : '—'}</td>
      <td class="num deprecated-cell">${d > 0 ? d : '—'}</td>
      <td class="num manual-cell">${m > 0 ? m : '—'}</td>
      <td class="num skip-cell">${sk > 0 ? sk : '—'}</td>
    </tr>`;
  }).join('\n');
}

// ── 모듈별 TC 상세 섹션 ───────────────────────────────────────────────────────

function moduleSection(mod) {
  const tcs = byModule.get(mod) ?? [];
  if (!tcs.length) return '';
  const label = moduleLabels[mod] ?? mod;
  const p = tcs.filter(t => classifyResult(t) === 'pass').length;
  const f = tcs.filter(t => classifyResult(t) === 'fail').length;
  const autoRun = tcs.filter(t => !['manual','skip'].includes(classifyResult(t))).length;
  const statusCls = f > 0 ? 'fail' : 'pass';

  const rows = tcs.map(tc => {
    const result = classifyResult(tc);
    const icon = resultIcon(result);
    const lbl = resultLabel(result);
    const rowCls = `result-${result}`;
    const errorHtml = tc.error
      ? `<div class="error-msg">${escHtml(tc.error)}</div>`
      : '';
    return `<tr class="${rowCls}">
      <td class="tc-id-cell"><code>${escHtml(tc.id)}</code></td>
      <td class="result-cell">
        <span class="result-badge result-${result}">${icon} ${lbl}</span>
      </td>
      <td class="title-cell">${escHtml(shortTitle(tc.title))}${errorHtml}</td>
    </tr>`;
  }).join('\n');

  return `<section id="module-${mod}">
    <div class="module-header ${statusCls}">
      <h2>${escHtml(label)}</h2>
      <div class="module-meta">
        자동화 ${autoRun}건 &nbsp;|&nbsp;
        ✅ ${p} &nbsp;
        ${f > 0 ? `❌ ${f} &nbsp;` : ''}
      </div>
    </div>
    <div class="tc-table-wrap">
    <table class="tc-table">
      <colgroup><col style="width:140px"><col style="width:90px"><col></colgroup>
      <thead>
        <tr><th>TC-ID</th><th>결과</th><th>설명</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
  </section>`;
}

// ── 수동 검증 필요 목록 ───────────────────────────────────────────────────────

function manualTable() {
  const manuals = allTcs.filter(t => classifyResult(t) === 'manual');
  if (!manuals.length) return '';
  const rows = manuals.map(tc => `
    <tr>
      <td><code>${escHtml(tc.id)}</code></td>
      <td>${escHtml(shortTitle(tc.title))}</td>
      <td class="reason-cell">${escHtml(tc.reason || '수동 검증 필요 — 자동화 불가 영역')}</td>
    </tr>`).join('\n');
  return `<section id="manual-checks">
    <h2>⏭️ 수동 검증 필요 목록 (${manuals.length}건)</h2>
    <p class="manual-note">아래 항목은 OAuth, 이메일 인증, SMS, PG 결제, PDF 내용 등 자동화가 불가능하거나 권장되지 않는 케이스입니다. 사람이 직접 확인해야 합니다.</p>
    <div class="tc-table-wrap">
    <table class="tc-table">
      <colgroup><col style="width:140px"><col><col style="width:260px"></colgroup>
      <thead><tr><th>TC-ID</th><th>설명</th><th>수동 검증 이유</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
  </section>`;
}

// ── 스킵 목록 ─────────────────────────────────────────────────────────────────

function skipTable() {
  const skips = allTcs.filter(t => classifyResult(t) === 'skip');
  if (!skips.length) return '';

  // 분류: 명시적 스킵 vs 조건부 스킵
  const explicit = skips.filter(t => t.reason);
  const conditional = skips.filter(t => !t.reason);

  function skipRows(tcs, defaultReason) {
    return tcs.map(tc => `
      <tr>
        <td><code>${escHtml(tc.id)}</code></td>
        <td>${escHtml(shortTitle(tc.title))}</td>
        <td class="reason-cell">${escHtml(tc.reason || defaultReason)}</td>
      </tr>`).join('\n');
  }

  let body = '';
  if (explicit.length) {
    body += `<tr class="group-header"><td colspan="3">📌 명시적 스킵 (${explicit.length}건) — 테스트 자체가 비활성화됨</td></tr>`;
    body += skipRows(explicit, '');
  }
  if (conditional.length) {
    body += `<tr class="group-header"><td colspan="3">🔀 조건부 스킵 (${conditional.length}건) — UI 요소 미노출 등 런타임 조건에 따라 스킵됨</td></tr>`;
    body += skipRows(conditional, '조건부 스킵 — UI 요소가 없거나 기능 미제공 시 자동 스킵');
  }

  return `<section id="skip-list">
    <h2>👤 스킵 목록 (${skips.length}건)</h2>
    <p class="manual-note">명시적 스킵은 현재 기능 미구현, 세션 파괴 위험, 환경 불안정 등의 이유로 비활성화된 케이스입니다. 조건부 스킵은 실행 시점에 UI 요소가 없을 경우 자동으로 건너뛰는 케이스입니다.</p>
    <div class="tc-table-wrap">
    <table class="tc-table">
      <colgroup><col style="width:140px"><col><col style="width:260px"></colgroup>
      <thead><tr><th>TC-ID</th><th>설명</th><th>스킵 이유</th></tr></thead>
      <tbody>${body}</tbody>
    </table>
    </div>
  </section>`;
}

// ── 요구기능 삭제 목록 ────────────────────────────────────────────────────────

function deprecatedTable() {
  const deps = allTcs.filter(t => classifyResult(t) === 'deprecated');
  if (!deps.length) return '';
  const rows = deps.map(tc => `
    <tr>
      <td><code>${escHtml(tc.id)}</code></td>
      <td>${escHtml(shortTitle(tc.title))}</td>
      <td class="reason-cell">${escHtml(tc.reason || '요구사항 변경 — 서비스에서 해당 기능 제거됨')}</td>
    </tr>`).join('\n');
  return `<section id="deprecated-list">
    <h2>🗑️ 요구기능 삭제 목록 (${deps.length}건)</h2>
    <p class="manual-note">아래 항목은 docs/qa에 정의되어 있었으나 요구사항 변경으로 서비스에서 해당 기능이 제거된 케이스입니다. 테스트 대상에서 공식적으로 제외됩니다.</p>
    <div class="tc-table-wrap">
    <table class="tc-table">
      <colgroup><col style="width:140px"><col><col style="width:260px"></colgroup>
      <thead><tr><th>TC-ID</th><th>설명</th><th>삭제 사유</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
  </section>`;
}

// ── 실패 상세 ─────────────────────────────────────────────────────────────────

function failDetails() {
  const failed = allTcs.filter(t => classifyResult(t) === 'fail');
  if (!failed.length) return '';
  const rows = failed.map(tc => `
    <tr>
      <td><code>${escHtml(tc.id)}</code></td>
      <td>${escHtml(shortTitle(tc.title))}</td>
      <td class="error-msg">${escHtml(tc.error ?? '')}</td>
    </tr>`).join('\n');
  return `<section id="fail-details" class="fail-section">
    <h2>❌ 실패 상세 (${failed.length}건)</h2>
    <div class="tc-table-wrap">
    <table class="tc-table">
      <colgroup><col style="width:140px"><col style="width:200px"><col></colgroup>
      <thead><tr><th>TC-ID</th><th>설명</th><th>오류</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
  </section>`;
}

// ── HTML 전체 ─────────────────────────────────────────────────────────────────

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anchor QA 결과 리포트</title>
<style>
  :root {
    --pass: #16a34a; --fail: #dc2626; --manual: #d97706; --skip: #6b7280; --deprecated: #7c3aed;
    --pass-bg: #f0fdf4; --fail-bg: #fef2f2; --manual-bg: #fffbeb; --skip-bg: #f9fafb; --deprecated-bg: #f5f3ff;
    --border: #e5e7eb; --text: #111827; --muted: #6b7280; --code-bg: #f3f4f6;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
         color: var(--text); background: #fff; line-height: 1.6; }
  .container { max-width: 1080px; margin: 0 auto; padding: 32px 24px; }

  header { display: flex; align-items: flex-start; justify-content: space-between;
           margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
  header h1 { font-size: 1.7rem; font-weight: 800; }
  .meta { color: var(--muted); font-size: 0.85rem; margin-top: 4px; }
  .badge-status { padding: 6px 16px; border-radius: 9999px; font-size: 0.85rem;
                  font-weight: 700; letter-spacing: 0.05em; }
  .badge-status.PASS { background: var(--pass-bg); color: var(--pass); border: 1px solid var(--pass); }
  .badge-status.FAIL { background: var(--fail-bg); color: var(--fail); border: 1px solid var(--fail); }
  .header-links { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .detail-link { display: inline-flex; align-items: center; gap: 6px;
                 padding: 6px 14px; background: #1e40af; color: #fff;
                 border-radius: 6px; text-decoration: none; font-size: 0.82rem;
                 font-weight: 500; }

  .big-numbers { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
  .big-num { flex: 1; min-width: 120px; padding: 16px 20px; border-radius: 10px;
             border: 1px solid var(--border); text-align: center; }
  .big-num .num { font-size: 2.2rem; font-weight: 800; line-height: 1; }
  .big-num .lbl { font-size: 0.78rem; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
  .big-num.pass { background: var(--pass-bg); border-color: #86efac; }
  .big-num.pass .num { color: var(--pass); }
  .big-num.fail { background: var(--fail-bg); border-color: #fca5a5; }
  .big-num.fail .num { color: var(--fail); }
  .big-num.manual { background: var(--manual-bg); border-color: #fcd34d; }
  .big-num.manual .num { color: var(--manual); }
  .big-num.skip { background: var(--skip-bg); }
  .big-num.skip .num { color: var(--skip); }
  .big-num.deprecated { background: var(--deprecated-bg); border-color: #c4b5fd; }
  .big-num.deprecated .num { color: var(--deprecated); }

  .module-nav { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 28px; }
  .module-nav a { padding: 4px 12px; border: 1px solid var(--border); border-radius: 20px;
                  text-decoration: none; color: var(--text); font-size: 0.8rem; }
  .module-nav a:hover { background: var(--code-bg); }

  .summary-wrap { overflow-x: auto; margin-bottom: 36px; }
  .summary-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .summary-table th { padding: 9px 12px; text-align: left; color: var(--muted);
                      font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em;
                      background: var(--code-bg); border-bottom: 2px solid var(--border); }
  .summary-table td { padding: 9px 12px; border-bottom: 1px solid var(--border); }
  .summary-table td a { color: inherit; text-decoration: none; font-weight: 600; }
  .summary-table td a:hover { text-decoration: underline; }
  .summary-table tr.fail td { background: #fff5f5; }
  .summary-table tr.fail td:first-child { border-left: 3px solid var(--fail); }
  .summary-table tr.pass td:first-child { border-left: 3px solid var(--pass); }
  .summary-table tfoot td { font-weight: 700; background: var(--code-bg); }
  .num { text-align: right; }
  .pass-cell { color: var(--pass); font-weight: 600; }
  .fail-cell { color: var(--fail); font-weight: 600; }
  .manual-cell { color: var(--manual); }
  .skip-cell { color: var(--skip); }
  .deprecated-cell { color: var(--deprecated); }

  section { margin-bottom: 36px; }
  .module-header { display: flex; align-items: center; justify-content: space-between;
                   padding: 12px 16px; border-radius: 8px 8px 0 0;
                   border: 1px solid var(--border); border-bottom: none; }
  .module-header.fail { background: var(--fail-bg); border-color: #fca5a5; }
  .module-header.pass { background: var(--pass-bg); border-color: #86efac; }
  .module-header h2 { font-size: 1rem; font-weight: 700; }
  .module-meta { font-size: 0.8rem; color: var(--muted); }
  section h2 { font-size: 1rem; font-weight: 700; padding: 12px 16px;
               background: var(--code-bg); border: 1px solid var(--border);
               border-bottom: none; border-radius: 8px 8px 0 0; }
  .manual-note { font-size: 0.82rem; color: var(--muted); padding: 10px 16px;
                 background: var(--manual-bg); border: 1px solid #fcd34d;
                 border-bottom: none; }

  .tc-table-wrap { overflow-x: auto; }
  .tc-table { width: 100%; border-collapse: collapse; font-size: 0.85rem;
              border: 1px solid var(--border); border-radius: 0 0 8px 8px;
              table-layout: fixed; }
  .module-header + .tc-table-wrap .tc-table { border-top: 1px solid var(--border); }
  .tc-table th { padding: 8px 12px; text-align: left; background: #fafafa;
                 font-size: 0.75rem; color: var(--muted); text-transform: uppercase;
                 letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
  .tc-table td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: top;
                 word-break: break-word; overflow-wrap: break-word; }
  .tc-table tr:last-child td { border-bottom: none; }
  .tc-table tr.result-fail td { background: #fff5f5; }
  .tc-table tr.result-skip td, .tc-table tr.result-manual td { color: var(--muted); }
  .tc-table tr.group-header td { background: #f3f4f6; font-size: 0.78rem; font-weight: 600;
                                  color: var(--muted); padding: 6px 12px; }
  .tc-id-cell { width: 140px; }
  .result-cell { width: 90px; white-space: nowrap; }
  .reason-cell { font-size: 0.8rem; color: #374151; max-width: 320px; }
  .title-cell { }
  code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8rem;
         background: var(--code-bg); padding: 1px 5px; border-radius: 3px; }
  .error-msg { font-size: 0.78rem; color: var(--fail); margin-top: 4px;
               font-family: 'SF Mono', monospace; word-break: break-all; }

  .result-badge { display: inline-block; padding: 2px 8px; border-radius: 4px;
                  font-size: 0.75rem; font-weight: 600; }
  .result-pass       { background: var(--pass-bg); color: var(--pass); }
  .result-fail       { background: var(--fail-bg); color: var(--fail); }
  .result-manual     { background: var(--manual-bg); color: var(--manual); }
  .result-skip       { background: var(--skip-bg); color: var(--skip); }
  .result-deprecated { background: var(--deprecated-bg); color: var(--deprecated); }

  .fail-section h2 { background: var(--fail-bg); border-color: #fca5a5; }
  .fail-section .tc-table { border-color: #fca5a5; }
  hr.section-divider { border: none; border-top: 2px solid var(--border); margin: 40px 0; }
</style>
</head>
<body>
<div class="container">

  <header>
    <div>
      <h1>Anchor QA 결과 리포트</h1>
      <div class="meta">실행일시: ${now} &nbsp;|&nbsp; 자동화 ${autoTotal}건 / 수동 ${totalManual}건 / 스킵 ${totalSkip}건</div>
      <div class="meta">docs/qa 기준 ${DOCS_TOTAL}건 중 ${totalAll}건 구현 (커버리지 ${coveragePct}%)</div>
    </div>
    <div class="header-links">
      <span class="badge-status ${overallStatus}">${overallStatus} ${overallStatus === 'PASS' ? '✓' : '✗'}</span>
      <a href="./index.html" class="detail-link">📋 E2E 리포트</a>
      <a href="./detail/index.html" class="detail-link" target="_blank">🔍 Playwright 리포트</a>
    </div>
  </header>

  <div class="big-numbers">
    <div class="big-num pass"><div class="num">${totalPass}</div><div class="lbl">✅ PASS</div></div>
    <div class="big-num ${totalFail > 0 ? 'fail' : 'skip'}"><div class="num">${totalFail}</div><div class="lbl">❌ FAIL</div></div>
    <div class="big-num deprecated"><div class="num">${totalDeprecated}</div><div class="lbl">🗑️ 요구기능 삭제</div></div>
    <div class="big-num manual"><div class="num">${totalManual}</div><div class="lbl">⏭️ 수동 검증 필요</div></div>
    <div class="big-num skip"><div class="num">${totalSkip}</div><div class="lbl">👤 스킵</div></div>
  </div>

  <div class="module-nav">
    <a href="#coverage">📊 커버리지</a>
    ${moduleOrder.map(m => byModule.get(m)?.length ? `<a href="#module-${m}">${m}</a>` : '').join('')}
    ${totalManual > 0 ? '<a href="#manual-checks">⏭️ 수동</a>' : ''}
    ${totalDeprecated > 0 ? '<a href="#deprecated-list">🗑️ 삭제</a>' : ''}
    ${totalSkip > 0 ? '<a href="#skip-list">👤 스킵</a>' : ''}
    ${totalFail > 0 ? '<a href="#fail-details">❌ 실패</a>' : ''}
  </div>

  ${coverageTable()}

  <hr class="section-divider">

  <div class="summary-wrap">
    <table class="summary-table">
      <thead>
        <tr><th>모듈</th><th class="num">전체</th><th class="num">✅ PASS</th><th class="num">❌ FAIL</th><th class="num">🗑️ 삭제</th><th class="num">⏭️ 수동</th><th class="num">👤 스킵</th></tr>
      </thead>
      <tbody>
        ${summaryRows()}
      </tbody>
      <tfoot>
        <tr>
          <td>합계</td>
          <td class="num">${totalAll}</td>
          <td class="num pass-cell">${totalPass}</td>
          <td class="num ${totalFail > 0 ? 'fail-cell' : ''}">${totalFail > 0 ? totalFail : '—'}</td>
          <td class="num deprecated-cell">${totalDeprecated > 0 ? totalDeprecated : '—'}</td>
          <td class="num manual-cell">${totalManual > 0 ? totalManual : '—'}</td>
          <td class="num skip-cell">${totalSkip > 0 ? totalSkip : '—'}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  ${totalFail > 0 ? failDetails() : ''}

  ${manualTable()}

  ${deprecatedTable()}

  ${skipTable()}

  <hr class="section-divider">

  ${moduleOrder.map(mod => moduleSection(mod)).join('\n')}

</div>
</body>
</html>`;

writeFileSync(htmlOut, html, 'utf-8');

console.log(`✅ QA 리포트 → ${htmlOut}`);
console.log(`   TC-ID 총 ${totalAll}건 (docs/qa ${DOCS_TOTAL}건 기준 커버리지 ${coveragePct}%)`);
console.log(`   PASS ${totalPass} | FAIL ${totalFail} | 삭제 ${totalDeprecated} | 수동 ${totalManual} | 스킵 ${totalSkip}`);
console.log(`   합계: ${totalPass + totalFail + totalDeprecated + totalManual + totalSkip} / 미구현 ${notImpl}건`);
