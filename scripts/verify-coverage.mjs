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

function collectSpecTcIds(specDir) {
  const ids = new Set();

  function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.spec.ts')) {
        const content = readFileSync(full, 'utf-8');
        let m;
        while ((m = SPEC_TC_RE.exec(content)) !== null) ids.add(m[2]);
        SPEC_TC_RE.lastIndex = 0;
      }
    }
  }

  walk(specDir);
  return ids;
}

// ── 3. 대조 ───────────────────────────────────────────────────────────────────

const { active: docIds, deleted: deletedIds } = collectDocsTcIds(resolve(root, 'docs/qa'));
const specIds = collectSpecTcIds(resolve(root, 'tests/qa'));

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

if (missing.length === 0 && unknown.length === 0) {
  console.log('✅ 누락 없음 — 모든 활성 TC가 spec에 존재합니다.\n');
  process.exit(0);
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
