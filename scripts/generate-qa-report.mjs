#!/usr/bin/env node
/**
 * QA 리포트 생성기
 * Playwright results.json → TC-ID 매핑 QA 결과 HTML 생성
 * 사용: node scripts/generate-qa-report.mjs [결과 파일 경로]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
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

// ── TC-ID 파서 ────────────────────────────────────────────────────────────────

// [TC-ID], [TC-ID][M], [TC-ID][S] 형태에서 TC-ID 추출
const TC_RE = /^\[([A-Z][A-Z0-9]+-[\d-]+)\](\[M\]|\[S\])?/;

function parseTcId(title) {
  const m = title.match(TC_RE);
  if (!m) return null;
  return { id: m[1], tag: m[2] ?? '' };
}

// 모듈명 추출 (AUTH-4-4-01 → AUTH)
function moduleOf(tcId) {
  return tcId.split('-')[0];
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
  // qa 테스트만 처리
  if (!file.includes('qa/') && !file.includes('qa\\')) continue;
  const specs = collectSpecs(fileSuite, file);
  allSpecs.push(...specs);
}

// ── TC-ID 매핑 ────────────────────────────────────────────────────────────────

const tcMap = new Map(); // tcId → { id, tag, title, status, error, file }

for (const spec of allSpecs) {
  const parsed = parseTcId(spec.title);
  if (!parsed) continue;
  const { id, tag } = parsed;
  tcMap.set(id, { id, tag, title: spec.title, status: spec.status, error: spec.error, file: spec.file });
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

// 모듈 내 TC-ID 정렬
for (const [, tcs] of byModule) {
  tcs.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));
}

// ── 결과 분류 ─────────────────────────────────────────────────────────────────

function classifyResult(tc) {
  if (tc.tag === '[M]') return 'manual';
  if (tc.tag === '[S]') return 'skip';
  if (tc.status === 'passed') return 'pass';
  if (tc.status === 'failed') return 'fail';
  if (tc.status === 'skipped') return 'skip';
  return 'unknown';
}

function resultIcon(result) {
  return { pass: '✅', fail: '❌', manual: '⏭️', skip: '👤', unknown: '❓' }[result] ?? '❓';
}

function resultLabel(result) {
  return { pass: 'PASS', fail: 'FAIL', manual: '수동', skip: '스킵', unknown: '?' }[result] ?? '?';
}

// ── 집계 ──────────────────────────────────────────────────────────────────────

const now = new Date().toLocaleString('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
});

const allTcs = [...tcMap.values()];
const totalAll    = allTcs.length;
const totalPass   = allTcs.filter(t => classifyResult(t) === 'pass').length;
const totalFail   = allTcs.filter(t => classifyResult(t) === 'fail').length;
const totalManual = allTcs.filter(t => classifyResult(t) === 'manual').length;
const totalSkip   = allTcs.filter(t => classifyResult(t) === 'skip').length;
const autoTotal   = totalAll - totalManual - totalSkip;
const overallStatus = totalFail > 0 ? 'FAIL' : 'PASS';

// ── HTML 생성 ─────────────────────────────────────────────────────────────────

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shortTitle(title) {
  // TC-ID 및 태그 부분 제거, 설명만 남기기
  return title.replace(/^\[[^\]]+\](\[M\]|\[S\])?\s*/, '');
}

function summaryRows() {
  return moduleOrder.map(mod => {
    const tcs = byModule.get(mod) ?? [];
    if (!tcs.length) return '';
    const p  = tcs.filter(t => classifyResult(t) === 'pass').length;
    const f  = tcs.filter(t => classifyResult(t) === 'fail').length;
    const m  = tcs.filter(t => classifyResult(t) === 'manual').length;
    const sk = tcs.filter(t => classifyResult(t) === 'skip').length;
    const cls = f > 0 ? 'fail' : 'pass';
    return `<tr class="${cls}">
      <td><a href="#module-${mod}">${mod}</a></td>
      <td class="num">${tcs.length}</td>
      <td class="num pass-cell">${p}</td>
      <td class="num ${f > 0 ? 'fail-cell' : ''}">${f > 0 ? f : '—'}</td>
      <td class="num manual-cell">${m > 0 ? m : '—'}</td>
      <td class="num skip-cell">${sk > 0 ? sk : '—'}</td>
    </tr>`;
  }).join('\n');
}

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
    const label = resultLabel(result);
    const rowCls = `result-${result}`;
    const errorHtml = tc.error
      ? `<div class="error-msg">${escHtml(tc.error)}</div>`
      : '';
    return `<tr class="${rowCls}">
      <td class="tc-id-cell"><code>${escHtml(tc.id)}</code></td>
      <td class="result-cell">
        <span class="result-badge result-${result}">${icon} ${label}</span>
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
    <table class="tc-table">
      <thead>
        <tr><th>TC-ID</th><th>결과</th><th>설명</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

function manualTable() {
  const manuals = allTcs.filter(t => classifyResult(t) === 'manual');
  if (!manuals.length) return '';
  const rows = manuals.map(tc => `
    <tr>
      <td><code>${escHtml(tc.id)}</code></td>
      <td>${escHtml(shortTitle(tc.title))}</td>
    </tr>`).join('\n');
  return `<section id="manual-checks">
    <h2>⏭️ 수동 검증 필요 목록 (${manuals.length}건)</h2>
    <p class="manual-note">아래 항목은 OAuth, 이메일 인증, SMS, PG 결제, PDF 내용 등 자동화가 불가능하거나 권장되지 않는 케이스입니다. 사람이 직접 확인해야 합니다.</p>
    <table class="tc-table">
      <thead><tr><th>TC-ID</th><th>설명</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

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
    <table class="tc-table">
      <thead><tr><th>TC-ID</th><th>설명</th><th>오류</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anchor QA 결과 리포트</title>
<style>
  :root {
    --pass: #16a34a; --fail: #dc2626; --manual: #d97706; --skip: #6b7280;
    --pass-bg: #f0fdf4; --fail-bg: #fef2f2; --manual-bg: #fffbeb; --skip-bg: #f9fafb;
    --border: #e5e7eb; --text: #111827; --muted: #6b7280; --code-bg: #f3f4f6;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
         color: var(--text); background: #fff; line-height: 1.6; }
  .container { max-width: 1080px; margin: 0 auto; padding: 32px 24px; }

  /* header */
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

  /* big numbers */
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

  /* nav */
  .module-nav { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 28px; }
  .module-nav a { padding: 4px 12px; border: 1px solid var(--border); border-radius: 20px;
                  text-decoration: none; color: var(--text); font-size: 0.8rem; }
  .module-nav a:hover { background: var(--code-bg); }

  /* summary table */
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

  /* module section */
  section { margin-bottom: 36px; }
  .module-header { display: flex; align-items: center; justify-content: space-between;
                   padding: 12px 16px; border-radius: 8px 8px 0 0;
                   border: 1px solid var(--border); border-bottom: none; }
  .module-header.fail { background: var(--fail-bg); border-color: #fca5a5; }
  .module-header.pass { background: var(--pass-bg); border-color: #86efac; }
  .module-header h2 { font-size: 1rem; font-weight: 700; }
  .module-meta { font-size: 0.8rem; color: var(--muted); }
  section#fail-details { }
  section#manual-checks { }
  section h2 { font-size: 1rem; font-weight: 700; padding: 12px 16px;
               background: var(--code-bg); border: 1px solid var(--border);
               border-bottom: none; border-radius: 8px 8px 0 0; }
  .manual-note { font-size: 0.82rem; color: var(--muted); padding: 10px 16px;
                 background: var(--manual-bg); border: 1px solid #fcd34d;
                 border-bottom: none; }

  /* tc table */
  .tc-table { width: 100%; border-collapse: collapse; font-size: 0.85rem;
              border: 1px solid var(--border); border-radius: 0 0 8px 8px;
              overflow: hidden; }
  .module-header + .tc-table { border-top: 1px solid var(--border); }
  .tc-table th { padding: 8px 12px; text-align: left; background: #fafafa;
                 font-size: 0.75rem; color: var(--muted); text-transform: uppercase;
                 letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
  .tc-table td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .tc-table tr:last-child td { border-bottom: none; }
  .tc-table tr.result-fail td { background: #fff5f5; }
  .tc-table tr.result-skip td, .tc-table tr.result-manual td { color: var(--muted); }
  .tc-id-cell { width: 130px; }
  .result-cell { width: 100px; white-space: nowrap; }
  .title-cell { }
  code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8rem;
         background: var(--code-bg); padding: 1px 5px; border-radius: 3px; }
  .error-msg { font-size: 0.78rem; color: var(--fail); margin-top: 4px;
               font-family: 'SF Mono', monospace; word-break: break-all; }

  /* result badge */
  .result-badge { display: inline-block; padding: 2px 8px; border-radius: 4px;
                  font-size: 0.75rem; font-weight: 600; }
  .result-pass   { background: var(--pass-bg); color: var(--pass); }
  .result-fail   { background: var(--fail-bg); color: var(--fail); }
  .result-manual { background: var(--manual-bg); color: var(--manual); }
  .result-skip   { background: var(--skip-bg); color: var(--skip); }

  /* fail section */
  .fail-section h2 { background: var(--fail-bg); border-color: #fca5a5; }
  .fail-section .tc-table { border-color: #fca5a5; }

  /* divider */
  hr.section-divider { border: none; border-top: 2px solid var(--border); margin: 40px 0; }
</style>
</head>
<body>
<div class="container">

  <header>
    <div>
      <h1>Anchor QA 결과 리포트</h1>
      <div class="meta">실행일시: ${now} &nbsp;|&nbsp; 자동화 ${autoTotal}건 / 수동 ${totalManual}건 / 스킵 ${totalSkip}건</div>
    </div>
    <div class="header-links">
      <span class="badge-status ${overallStatus}">${overallStatus} ${overallStatus === 'PASS' ? '✓' : '✗'}</span>
      <a href="./index.html" class="detail-link">📋 E2E 리포트</a>
      <a href="./detail/index.html" class="detail-link" target="_blank">🔍 Playwright 리포트</a>
    </div>
  </header>

  <!-- 요약 숫자 -->
  <div class="big-numbers">
    <div class="big-num pass"><div class="num">${totalPass}</div><div class="lbl">✅ PASS</div></div>
    <div class="big-num ${totalFail > 0 ? 'fail' : 'skip'}"><div class="num">${totalFail}</div><div class="lbl">❌ FAIL</div></div>
    <div class="big-num manual"><div class="num">${totalManual}</div><div class="lbl">⏭️ 수동 검증 필요</div></div>
    <div class="big-num skip"><div class="num">${totalSkip}</div><div class="lbl">👤 스킵</div></div>
  </div>

  <!-- 모듈 바로가기 -->
  <div class="module-nav">
    ${moduleOrder.map(m => byModule.get(m)?.length ? `<a href="#module-${m}">${m}</a>` : '').join('')}
    ${totalManual > 0 ? '<a href="#manual-checks">⏭️ 수동</a>' : ''}
    ${totalFail > 0 ? '<a href="#fail-details">❌ 실패</a>' : ''}
  </div>

  <!-- 모듈 요약 표 -->
  <div class="summary-wrap">
    <table class="summary-table">
      <thead>
        <tr><th>모듈</th><th class="num">전체</th><th class="num">✅ PASS</th><th class="num">❌ FAIL</th><th class="num">⏭️ 수동</th><th class="num">👤 스킵</th></tr>
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
          <td class="num manual-cell">${totalManual > 0 ? totalManual : '—'}</td>
          <td class="num skip-cell">${totalSkip > 0 ? totalSkip : '—'}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  ${totalFail > 0 ? failDetails() : ''}

  <hr class="section-divider">

  <!-- 모듈별 TC-ID 결과 표 -->
  ${moduleOrder.map(mod => moduleSection(mod)).join('\n')}

  <hr class="section-divider">

  ${manualTable()}

</div>
</body>
</html>`;

writeFileSync(htmlOut, html, 'utf-8');

console.log(`✅ QA 리포트 → ${htmlOut}`);
console.log(`   TC-ID 총 ${totalAll}건: PASS ${totalPass} | FAIL ${totalFail} | 수동 ${totalManual} | 스킵 ${totalSkip}`);
