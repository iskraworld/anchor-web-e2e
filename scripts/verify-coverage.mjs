#!/usr/bin/env node
/**
 * verify-coverage.mjs
 * docs/qa 활성 TC-ID vs tests/qa spec TC-ID 1:1 대조
 *
 * 사용: node scripts/verify-coverage.mjs
 *       npm run verify:coverage
 *
 * 종료 코드:
 *   0 — 누락 없음
 *   1 — 누락 있음 (CI/커밋 전 차단용)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root   = resolve(__dir, '..');

// ── 1. docs/qa에서 TC-ID 수집 ─────────────────────────────────────────────────
// 활성 TC: | AUTH-1-01 | ...  (첫 번째 셀이 ID 형식)
// 삭제 TC: | ~~AUTH-1-04~~ | ... (취소선 처리됨)

const TC_ID_RE      = /^[A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*$/;
const ACTIVE_ROW_RE = /^\|\s*([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)\s*\|/;
const DELETED_ROW_RE = /^\|\s*~~([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)~~\s*\|/;

function collectDocsTcIds(docsDir) {
  const active  = new Set();
  const deleted = new Set();

  if (!existsSync(docsDir)) {
    console.error(`❌ docs/qa 디렉토리를 찾을 수 없음: ${docsDir}`);
    process.exit(1);
  }

  for (const entry of readdirSync(docsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const lines = readFileSync(join(docsDir, entry.name), 'utf-8').split('\n');
    for (const line of lines) {
      const del = line.match(DELETED_ROW_RE);
      if (del) { deleted.add(del[1]); continue; }
      const act = line.match(ACTIVE_ROW_RE);
      if (act && TC_ID_RE.test(act[1])) active.add(act[1]);
    }
  }

  return { active, deleted };
}

// ── 2. tests/qa에서 TC-ID 수집 ────────────────────────────────────────────────
// test('[ID]...') 또는 test.skip('[ID]...')

const SPEC_TC_RE = /test(?:\.skip)?\s*\(\s*['"](\[([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)\][^'"]*)['"]/g;
const SPEC_M_RE = /test\.skip\s*\(\s*['"](\[([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)\]\[M\][^'"]*)['"]/g;

function collectSpecTcIds(specDir) {
  const ids = new Set();
  const manualItems = []; // [M] 항목과 그 사유

  function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.spec.ts')) {
        const content = readFileSync(full, 'utf-8');
        const lines = content.split('\n');
        let m;
        while ((m = SPEC_TC_RE.exec(content)) !== null) ids.add(m[2]);
        SPEC_TC_RE.lastIndex = 0;
        // [M] 항목 — 라인 단위로 사유까지 수집
        for (let i = 0; i < lines.length; i++) {
          const mm = lines[i].match(/test\.skip\s*\(\s*['"](\[([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)\]\[M\][^'"]*)['"]/);
          if (!mm) continue;
          let reason = '';
          for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
            const cm = lines[j].match(/\/\/\s*MANUAL:\s*(.+)/i);
            if (cm) { reason = cm[1].trim(); break; }
            if (lines[j].includes('});')) break;
          }
          manualItems.push({ id: mm[2], reason });
        }
      }
    }
  }

  walk(specDir);
  return { ids, manualItems };
}

// [M] 사유 화이트리스트 — phase2-code-generation.md와 동기화
const MANUAL_WHITELIST = [
  /본인.*인증|OAuth|SMS|PASS|KMC|소셜.*로그인/i,
  /PG.*결제|실거래|실결제|카드.*결제|계좌.*차감/i,
  /PDF.*시각|PDF.*렌더|PDF.*잘림|PDF.*그래프|이미지.*시각|픽셀/i,
  /외부.*시스템|환경.*의존|외부.*응답.*변동|관리자.*승인|승인.*필요/i,
  /CAPTCHA|봇.*차단|사람.*입력/i,
];

function isWhitelistedManualReason(reason) {
  if (!reason) return false;
  return MANUAL_WHITELIST.some(re => re.test(reason));
}

// ── 3. 대조 ───────────────────────────────────────────────────────────────────

const auditMode = process.argv.includes('--audit');

const { active: docIds, deleted: deletedIds } = collectDocsTcIds(resolve(root, 'docs/qa'));
const { ids: specIds, manualItems } = collectSpecTcIds(resolve(root, 'tests/qa'));

// docs 활성 TC 중 spec에 없는 것 → 누락
const missing = [...docIds].filter(id => !specIds.has(id)).sort();
// spec에 있는데 docs 활성/삭제 어디에도 없는 것 → 의심 항목
const unknown = [...specIds].filter(id => !docIds.has(id) && !deletedIds.has(id)).sort();

// ── 4. 모듈별 그룹화 헬퍼 ────────────────────────────────────────────────────

function groupByModule(ids) {
  const map = {};
  for (const id of ids) {
    const mod = id.match(/^(HOME-TA|HOME-TP|[A-Z]+)/)?.[1] ?? '?';
    (map[mod] ??= []).push(id);
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

// ── 5. 결과 출력 ──────────────────────────────────────────────────────────────

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  TC 커버리지 검증');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  docs/qa  활성: ${docIds.size}건  삭제됨: ${deletedIds.size}건`);
console.log(`  tests/qa 구현: ${specIds.size}건`);
console.log('');

// audit 모드: [M] 비율과 사유 화이트리스트 검증
let auditWarnings = 0;
if (auditMode) {
  const totalActive = docIds.size;
  const manualCount = manualItems.length;
  const manualPct = totalActive > 0 ? (manualCount / totalActive * 100) : 0;
  const THRESHOLD_PCT = 5;

  console.log('━━ AUDIT 모드 ━━');
  console.log(`  [M] 항목: ${manualCount}건 / docs 활성 ${totalActive}건 = ${manualPct.toFixed(1)}%`);
  console.log(`  임계치: ${THRESHOLD_PCT}%`);

  if (manualPct > THRESHOLD_PCT) {
    console.log(`  ⚠️  [M] 비율이 ${THRESHOLD_PCT}%를 초과 — 분류 재검토 필요\n`);
    auditWarnings++;
  } else {
    console.log(`  ✅ 임계치 이내\n`);
  }

  // 화이트리스트 외 사유 검출
  const suspicious = manualItems.filter(it => !isWhitelistedManualReason(it.reason));
  if (suspicious.length > 0) {
    console.log(`⚠️  화이트리스트 외 [M] 사유 ${suspicious.length}건 — 자동화 가능성 재검토:`);
    console.log('   허용 카테고리: 본인인증 / PG 실거래 / PDF 시각검증 / 외부시스템 / CAPTCHA\n');
    for (const it of suspicious) {
      console.log(`  ${it.id.padEnd(15)} 사유: "${it.reason || '(사유 미기재)'}"`);
    }
    console.log('\n   → docs/anchor-e2e-v2/automation-patterns.md 참고 후 재분류\n');
    auditWarnings += suspicious.length;
  } else {
    console.log('✅ 모든 [M] 사유가 화이트리스트에 부합\n');
  }
}

if (missing.length === 0 && unknown.length === 0 && auditWarnings === 0) {
  console.log('✅ 누락 없음 — 모든 활성 TC가 spec에 존재합니다.\n');
  process.exit(0);
}

if (missing.length === 0 && unknown.length === 0 && auditWarnings > 0) {
  console.log(`⚠️  AUDIT 경고 ${auditWarnings}건 — 누락은 없지만 [M] 분류 재검토 필요\n`);
  process.exit(auditMode ? 1 : 0);
}

if (missing.length > 0) {
  console.log(`❌ 누락 ${missing.length}건 — docs에 있지만 spec에 없음`);
  console.log('   (자동화 불가 → [M], 구현 예정 → test(), 기타 사유 → [S])\n');
  for (const [mod, ids] of groupByModule(missing)) {
    console.log(`  ${mod.padEnd(10)} (${String(ids.length).padStart(2)}건)  ${ids.join(', ')}`);
  }
  console.log('');
}

if (unknown.length > 0) {
  console.log(`⚠️  미확인 ${unknown.length}건 — spec에 있지만 docs에 없음`);
  console.log('   (TC-ID 오타이거나 docs에 추가 필요)\n');
  for (const [mod, ids] of groupByModule(unknown)) {
    console.log(`  ${mod.padEnd(10)} (${String(ids.length).padStart(2)}건)  ${ids.join(', ')}`);
  }
  console.log('');
}

console.log('처리 방법:');
console.log('  자동화 불가  →  test.skip(\'[ID][M] 제목\', async () => { /* MANUAL: 사유 */ })');
console.log('  구현 예정    →  test(\'[ID] 제목\', async ({ page }) => { ... })');
console.log('  스킵         →  test.skip(\'[ID][S] 제목\', async () => { /* SKIP: 사유 */ })');
console.log('');

process.exit(missing.length > 0 ? 1 : 0);
