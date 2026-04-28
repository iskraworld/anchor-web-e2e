# Phase 3 — 전체 실행 + QA 결과 리포트 생성

> 목표: 전체 tests/qa/ 를 실행하고, QA 문서와 TC-ID별로 매핑된 결과 리포트를 생성한다.
> 산출물: `playwright-report/qa-report/index.html`
> 예상 소요: 1시간 (실행 40분 + 리포트 생성 20분)

---

## 1. 전체 실행

```bash
npx playwright test tests/qa/ --project=chromium
```

`results.json`이 `playwright-report/results.json`에 생성된다.

---

## 2. QA 결과 리포트 생성

```bash
node scripts/generate-qa-report.mjs
```

스크립트가 없으면 이 Phase에서 새로 작성한다 (`scripts/generate-qa-report.mjs`).

---

## 리포트 구조

### 메인 페이지 (`qa-report/index.html`)

상단에 모듈별 요약 표:

| 모듈 | 전체 | ✅ PASS | ❌ FAIL | ⏭️ 수동 | 👤 스킵 |
|---|---|---|---|---|---|
| AUTH | 98 | 72 | 3 | 18 | 5 |
| TA | 63 | 50 | 2 | 11 | 0 |
| ... | | | | | |
| **합계** | **810** | **N** | **N** | **N** | **N** |

그 아래 모듈별 TC-ID 결과 테이블:

```
## AUTH — 로그인/회원가입

| TC-ID | 테스트명 | 기대결과 (요약) | 결과 | 비고 |
|---|---|---|---|---|
| AUTH-3-01 | 비로그인 홈 접근 | 로그인 페이지 이동 | ✅ PASS | |
| AUTH-4-4-01 | 이메일 로그인 | 홈으로 이동 | ✅ PASS | |
| AUTH-4-4-05 | 5회 틀린 비밀번호 | 계정 잠금 안내 | ❌ FAIL | 잠금 미동작 |
| AUTH-4-6-01 | 신규 회원가입 | — | 👤 스킵 | 사람이 수행 |
| AUTH-4-6-03 | 카카오 소셜 로그인 | — | ⏭️ 수동 | [M-001] |
```

`[M-001]`은 수동 검증 필요 상세 테이블의 링크.

### 수동 검증 필요 테이블 (페이지 하단 또는 별도 섹션)

| 참조ID | TC-ID | 테스트명 | 수동 검증 불가 이유 | 검증 방법 제안 |
|---|---|---|---|---|
| M-001 | AUTH-4-6-03 | 카카오 소셜 로그인 | OAuth 팝업 — Playwright 차단 | 테스터가 직접 카카오 계정으로 로그인 시도 |
| M-002 | AUTH-4-5-02 | 이메일 인증 링크 확인 | 외부 메일 서버 접근 불가 | 가입 후 받은 메일의 링크 클릭 여부 확인 |

---

## `generate-qa-report.mjs` 구현 가이드

기존 `generate-report.mjs`를 기반으로 확장한다.

### 핵심 로직

```javascript
// TC-ID 파싱: 테스트 이름에서 '[XXXX-X-XX]' 형식 추출
function parseTcId(testTitle) {
  const match = testTitle.match(/^\[([A-Z\-0-9]+)\]/);
  return match ? match[1] : null;
}

// 결과 아이콘 매핑
function statusIcon(status) {
  if (status === 'passed') return '✅ PASS';
  if (status === 'failed') return '❌ FAIL';
  if (status === 'skipped') return '⏭️ 수동/스킵';  // 주석 확인해서 구분
  return '⬜ 미실행';
}
```

### 수동 vs 스킵 구분

`test.skip()`은 모두 `skipped`로 기록된다.
구분 방법: spec 파일의 주석을 읽거나, TC-ID를 `qa-automation-map.md`와 대조한다.
간단한 대안: `[M]` 태그를 테스트 이름에 추가.

```typescript
test.skip('[AUTH-4-6-03][M] 카카오 소셜 로그인', ...) // MANUAL
test.skip('[AUTH-4-6-01][S] 신규 회원가입', ...)       // SKIP
```

리포트 스크립트에서 `[M]`이면 ⏭️ 수동, `[S]`이면 👤 스킵으로 분기.

---

## package.json 스크립트 추가

```json
"test:qa": "npx playwright test tests/qa/ --project=chromium",
"report:qa": "node scripts/generate-qa-report.mjs",
"qa": "npx playwright test tests/qa/ --project=chromium && node scripts/generate-qa-report.mjs"
```

---

## 완료 기준

- [ ] `npx playwright test tests/qa/` 에러 없이 완료
- [ ] `playwright-report/qa-report/index.html` 생성
- [ ] 모든 활성 TC-ID가 결과 테이블에 존재
- [ ] ❌ FAIL 항목에 에러 메시지 첫 줄 표시
- [ ] 수동 검증 필요 항목 별도 테이블 존재 (이유 + 검증방법 포함)
- [ ] Vercel 배포 가능한 형태 (`npm run deploy`로 배포)

---

## 결과 해석 가이드

사람이 리포트를 볼 때 확인할 것:

1. **❌ FAIL 항목** → 버그 후보. 기대결과와 실제 결과 비교해서 버그 여부 판단
2. **⏭️ 수동 항목** → 사람이 직접 검증 필요. 수동 검증 테이블의 방법 참고
3. **👤 스킵 항목** → 사람이 이미 수행했거나 수행 예정. 체크리스트로 활용
4. **✅ PASS 항목** → AI가 자동 검증 완료. 별도 확인 불필요
