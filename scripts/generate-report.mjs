#!/usr/bin/env node
/**
 * Playwright JSON 결과를 읽어 사람이 읽을 수 있는 Markdown 리포트를 생성한다.
 * 사용: node scripts/generate-report.mjs [결과 파일 경로]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

const jsonPath = process.argv[2] ?? resolve(root, 'playwright-report/results.json');
const outPath = resolve(root, 'playwright-report/summary.md');

if (!existsSync(jsonPath)) {
  console.error(`결과 파일 없음: ${jsonPath}`);
  console.error('먼저 테스트를 실행하세요: npm run test:full');
  process.exit(1);
}

const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));

function getCategory(file) {
  if (file.includes('critical')) return 'P0';
  if (file.includes('/p1/') || file.startsWith('p1/')) return 'P1';
  if (file.includes('/p2/') || file.startsWith('p2/')) return 'P2';
  if (file.includes('visual')) return 'VR';
  return null; // setup 등 제외
}

function statusIcon(status) {
  if (status === 'passed') return '✅';
  if (status === 'failed') return '❌';
  if (status === 'skipped') return '⏭';
  if (status === 'timedOut') return '⏱';
  return '❓';
}

function fmt(ms) {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// 파일 suite 하위 specs를 재귀로 수집 (file은 상위에서 내려받음)
function collectSpecs(suite, file) {
  const results = [];
  for (const spec of suite.specs ?? []) {
    const test = spec.tests?.[0];
    const result = test?.results?.[0] ?? {};
    results.push({
      title: spec.title,
      status: result.status ?? 'unknown',
      duration: result.duration ?? 0,
      error: result.error?.message?.split('\n')[0]?.slice(0, 100) ?? null,
    });
  }
  for (const sub of suite.suites ?? []) {
    results.push(...collectSpecs(sub, file));
  }
  return results;
}

// 카테고리별로 파일 단위 결과 수집
const byCategory = { P0: [], P1: [], P2: [], VR: [] };

for (const fileSuite of data.suites ?? []) {
  const file = fileSuite.file ?? fileSuite.title ?? '';
  const cat = getCategory(file);
  if (!cat) continue;

  const specs = collectSpecs(fileSuite, file);
  if (specs.length === 0) continue;

  const shortName = file.replace(/\.spec\.ts$/, '');
  byCategory[cat].push({ file: shortName, specs });
}

// 전체 통계
const allSpecs = Object.values(byCategory).flat().flatMap(f => f.specs);
const totalPassed = allSpecs.filter(s => s.status === 'passed').length;
const totalFailed = allSpecs.filter(s => s.status === 'failed').length;
const totalSkipped = allSpecs.filter(s => s.status === 'skipped').length;
const totalDuration = allSpecs.reduce((sum, s) => sum + (s.duration ?? 0), 0);

const now = new Date().toLocaleString('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
});

const lines = [];

lines.push(`# Anchor E2E 테스트 결과`);
lines.push(`\n> 실행일시: ${now}  |  총 소요: ${fmt(totalDuration)}\n`);

// 요약 표
lines.push(`## 요약\n`);
lines.push(`| 구분 | 전체 | ✅ passed | ❌ failed | ⏭ skipped |`);
lines.push(`|---|---|---|---|---|`);

const categoryLabels = {
  P0: 'P0 핵심 기능 (매일 CI)',
  P1: 'P1 기능 회귀 방지 (주 1회)',
  P2: 'P2 전수 검증 (수동 트리거)',
  VR: 'VR Visual Regression',
};

for (const cat of ['P0', 'P1', 'P2', 'VR']) {
  const specs = byCategory[cat].flatMap(f => f.specs);
  const p = specs.filter(s => s.status === 'passed').length;
  const f = specs.filter(s => s.status === 'failed').length;
  const sk = specs.filter(s => s.status === 'skipped').length;
  const icon = f > 0 ? '🔴' : sk > 0 ? '🟡' : '🟢';
  lines.push(`| ${icon} **${cat}** | ${specs.length} | ${p} | ${f > 0 ? f : '-'} | ${sk > 0 ? sk : '-'} |`);
}

lines.push(`| | **${allSpecs.length}** | **${totalPassed}** | **${totalFailed > 0 ? totalFailed : '-'}** | **${totalSkipped > 0 ? totalSkipped : '-'}** |`);

if (totalFailed > 0) {
  lines.push(`\n> ⚠️ **${totalFailed}개 실패** — 아래 상세 확인\n`);
}

// 카테고리별 상세
for (const cat of ['P0', 'P1', 'P2', 'VR']) {
  const files = byCategory[cat];
  if (files.length === 0) continue;

  lines.push(`\n---\n`);
  lines.push(`## ${categoryLabels[cat]}\n`);

  for (const { file, specs } of files) {
    const p = specs.filter(s => s.status === 'passed').length;
    const f = specs.filter(s => s.status === 'failed').length;
    const fileIcon = f > 0 ? '❌' : '✅';
    lines.push(`### ${fileIcon} ${file} (${p}/${specs.length})\n`);
    lines.push(`| 상태 | 테스트 | 시간 |`);
    lines.push(`|---|---|---|`);
    for (const s of specs) {
      const icon = statusIcon(s.status);
      const title = s.error
        ? `${s.title}<br><sub>💬 \`${s.error.replace(/\|/g, '\\|')}\`</sub>`
        : s.title;
      lines.push(`| ${icon} | ${title} | ${fmt(s.duration)} |`);
    }
    lines.push('');
  }
}

// 실패 요약
if (totalFailed > 0) {
  lines.push(`\n---\n`);
  lines.push(`## ❌ 실패 목록\n`);
  for (const cat of ['P0', 'P1', 'P2', 'VR']) {
    for (const { file, specs } of byCategory[cat]) {
      for (const s of specs.filter(sp => sp.status === 'failed')) {
        lines.push(`- **[${cat}]** \`${file}\` — ${s.title}`);
        if (s.error) lines.push(`  - \`${s.error}\``);
      }
    }
  }
}

// VR 베이스라인
lines.push(`\n---\n`);
lines.push(`## VR 베이스라인\n`);
lines.push(`VR 통과 시 리포트에 스크린샷 미표시 (실패 시에만 diff 노출). 베이스라인 파일:\n`);
const snapshotDir = resolve(root, 'tests/visual/visual.spec.ts-snapshots');
if (existsSync(snapshotDir)) {
  const pngs = readdirSync(snapshotDir).filter(f => f.endsWith('.png'));
  for (const f of pngs) lines.push(`- \`${f}\``);
}
lines.push(`\n베이스라인 갱신: \`npm run visual:update\``);

writeFileSync(outPath, lines.join('\n'), 'utf-8');
console.log(`✅ 리포트 생성: ${outPath}`);
console.log(`   passed: ${totalPassed} | failed: ${totalFailed} | skipped: ${totalSkipped}`);
