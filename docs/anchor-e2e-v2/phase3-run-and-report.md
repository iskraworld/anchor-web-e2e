# Phase 3 — 전체 실행 + QA 결과 리포트 생성

> 목표: 전체 tests/qa/ 를 실행하고, QA 문서와 TC-ID별로 매핑된 결과 리포트를 생성한다.
> 산출물: `playwright-report/qa-report.html`
> 예상 소요: 1시간 (실행 40분 + 리포트 생성 20분)

---

## ⚠️ 핵심 원칙

리포트에 나타나는 TC-ID 총 수 == 872개 (삭제된 TC 제외)
이 숫자가 맞지 않으면 리포트가 완성된 것이 아니다.

---

## 0. 환경 헬스체크 (필수 선행)

전체 실행 전 5분 헬스체크. **이걸 건너뛰면 staging 다운/storageState 만료/페이지 500 같은 환경 이슈를 수백 건 timeout 형태로 뒤늦게 발견한다.**

### 0-1. storageState 신선도 체크
```bash
ls -la tests/.auth/
# mtime이 12시간 이상 오래됐으면 즉시 재실행
find tests/.auth -name "*.json" -mmin +720 | head -1 && \
  npx playwright test tests/auth.setup.ts --project=setup
```

### 0-2. 페이지 진입 진단 spec

`tests/_diag/page-availability.spec.ts` 같은 파일에 각 모듈의 entry page 진입만 검증하는 1줄 spec을 둔다:

```typescript
import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'MY',      path: '/my-info',                 auth: 'paid-user' },
  { name: 'GO',      path: '/search/active-officials', auth: 'paid-user' },
  { name: 'EO',      path: '/search/former-officials', auth: 'tax-officer' },
  { name: 'ER',      path: '/tax-history-report/me',   auth: 'tax-officer' },
  // ... 11개 모듈 entry
];

for (const p of PAGES) {
  test(`[DIAG-${p.name}] ${p.path} 진입 가능`, async ({ page }) => {
    test.use({ storageState: `tests/.auth/${p.auth}.json` });
    await page.goto(p.path);
    await expect(page.locator('body')).toBeVisible();
    // 500 오류 페이지가 아닌지 명시적 확인
    await expect(page.getByText(/500|서버 오류|Internal Server Error/i)).not.toBeVisible({ timeout: 3000 }).catch(() => {});
  });
}
```

```bash
SKIP_AUTH_SETUP=1 npx playwright test tests/_diag/page-availability.spec.ts --project=chromium
```

진단 결과:
- ✅ 모두 PASS → Phase 3 §1 본 실행 진행
- ❌ 일부 PASS / 일부 FAIL → 실패 모듈은 staging 이슈일 가능성. spec의 해당 항목을 `[B]`로 임시 마킹 후 본 실행 (실패 일괄 발생 방지)
- ❌ 모두 FAIL → storageState 만료 또는 staging 다운. 본 실행 금지, 환경 복구 후 재시도

> 💡 진단 spec은 `.gitignore`에 `tests/_diag/` 추가하거나 별도 폴더로 분리해 본 실행에 섞이지 않게 한다.

---

## 1. 전체 실행

```bash
npx playwright test tests/qa/ --project=chromium --reporter=list,json 2>&1 | tee /tmp/qa-run.log
```

- `results.json`이 `playwright-report/results.json`에 생성된다.
- 진행 로그는 `/tmp/qa-run.log`에 실시간으로 기록되어 `tail -f /tmp/qa-run.log`로 어디까지 진행됐는지 확인 가능하다.

### ⚠️ Reporter 선택 원칙

818개 TC 전체 실행은 1~2시간 걸린다. **JSON reporter 단독으로 실행하면 모든 테스트가 끝날 때까지 stdout이 비어 있어** 어디까지 진행됐는지 알 수 없다. 백그라운드 실행 시 반드시 아래 중 하나를 사용한다.

| 실행 형태 | reporter | 용도 |
|---|---|---|
| 결과 파싱 + 진행 추적 (권장) | `--reporter=list,json` | 콘솔에 테스트별 PASS/FAIL 실시간 출력 + JSON 결과 동시 생성 |
| 진행만 추적 | `--reporter=list` 또는 `line` | 빠른 검증, 결과 파싱 불필요 시 |
| ❌ 단독 사용 금지 | `--reporter=json` | 완료 시점에만 출력 — 모니터링 불가 |

`tee`로 파일에 기록해 두면 백그라운드 실행 중에도 다른 터미널/세션에서 `tail`로 진행 상황을 볼 수 있다.

---

## 2. QA 결과 리포트 생성

```bash
node scripts/generate-qa-report.mjs
```

---

## 리포트 구조

### 메인 페이지 (`playwright-report/qa-report.html`)

상단에 모듈별 요약 표:

| 모듈 | docs/qa 전체 | ✅ PASS | ❌ FAIL | ⏭️ 수동 | 👤 스킵 | 커버리지 |
|---|---|---|---|---|---|---|
| AUTH | 104 | 72 | 3 | 18 | 5 | 91% |
| TA | 65 | 50 | 2 | 11 | 0 | 97% |
| ... | | | | | | |
| **합계** | **872** | **N** | **N** | **N** | **N** | **N%** |

그 아래 모듈별 TC-ID 결과 테이블:

```
## AUTH — 로그인/회원가입

| TC-ID | 테스트명 | 기대결과 (요약) | 결과 | 비고 |
|---|---|---|---|---|
| AUTH-3-01 | 비로그인 홈 접근 | 로그인 페이지 이동 | ✅ PASS | |
| AUTH-4-4-01 | 이메일 로그인 | 홈으로 이동 | ✅ PASS | |
| AUTH-4-4-05 | 5회 틀린 비밀번호 | 계정 잠금 안내 | ❌ FAIL | 잠금 미동작 |
| AUTH-4-6-01 | 신규 회원가입 | — | 👤 스킵 | 사람이 수행 |
| AUTH-4-6-03 | 카카오 소셜 로그인 | — | ⏭️ 수동 | OAuth 팝업 차단 |
```

### 수동 검증 필요 테이블 (페이지 하단 섹션)

TC-ID, 테스트명, 수동 검증 불가 이유, 검증 방법 제안 포함.

### 스킵 목록 테이블 (페이지 하단 섹션)

TC-ID, 테스트명, 스킵 이유 포함.

---

## `generate-qa-report.mjs` 구현 가이드

### TC-ID 파싱 (HOME-TA/HOME-TP 복합 접두어 포함)

```javascript
// ⚠️ HOME-TA, HOME-TP 같은 복합 접두어를 지원하는 정규식
const TC_RE = /^\[([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d-]+)\](\[M\]|\[S\])?/;

function parseTcId(testTitle) {
  const match = testTitle.match(TC_RE);
  return match ? { id: match[1], tag: match[2] || '' } : null;
}
```

### 수동 vs 스킵 구분

테스트 이름에 `[M]` 또는 `[S]` 태그로 구분:
```typescript
test.skip('[AUTH-4-6-03][M] 카카오 소셜 로그인', ...) // MANUAL → ⏭️ 수동
test.skip('[AUTH-탈퇴-01][S] 계정 완전 탈퇴', ...)     // SKIP   → 👤 스킵
```

### 결과 아이콘 매핑

```javascript
function statusIcon(status, tag) {
  if (status === 'passed') return '✅ PASS';
  if (status === 'failed') return '❌ FAIL';
  if (status === 'skipped') {
    if (tag === '[M]') return '⏭️ 수동';
    if (tag === '[S]') return '👤 스킵';
    return '⏭️ 수동';  // 기본값
  }
  return '⬜ 미실행';
}
```

### spec 파일 파싱 — skip 이유 추출

```javascript
function parseSpecReasons(specDir) {
  const reasons = new Map();
  // test.skip() 바로 다음 줄의 // 주석을 이유로 사용
  // HOME-TA/HOME-TP 복합 접두어 지원
  const RE = /test\.skip\(\s*['"](\[([A-Z][A-Z0-9]*(?:-[A-Z]+)*-[\d][\d-]*)\][^'"]*)['"]/;
  // ...
}
```

---

## package.json 스크립트

```json
"test:qa": "npx playwright test tests/qa/ --project=chromium --reporter=list,json",
"report:qa": "node scripts/generate-qa-report.mjs",
"qa": "npx playwright test tests/qa/ --project=chromium --reporter=list,json && node scripts/generate-qa-report.mjs"
```

---

## ✅ 완료 기준

- [ ] `npx playwright test tests/qa/` 에러 없이 완료
- [ ] `playwright-report/qa-report.html` 생성
- [ ] **리포트의 TC-ID 총 수 == 872개**
- [ ] ❌ FAIL 항목에 에러 메시지 첫 줄 표시
- [ ] 수동 검증 필요 항목 별도 테이블 존재 (이유 포함)
- [ ] 스킵 항목 별도 테이블 존재 (이유 포함)
- [ ] Vercel 배포 완료

---

## 결과 해석 가이드

사람이 리포트를 볼 때 확인할 것:

1. **❌ FAIL 항목** → 버그 후보. 기대결과와 실제 결과 비교해서 버그 여부 판단
2. **⏭️ 수동 항목** → 사람이 직접 검증 필요. 수동 검증 테이블의 방법 참고
3. **👤 스킵 항목** → 사람이 수행 예정. 체크리스트로 활용
4. **✅ PASS 항목** → AI가 자동 검증 완료. 별도 확인 불필요
