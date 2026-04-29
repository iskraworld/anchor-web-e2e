# Phase 2 — 모듈별 테스트 코드 생성

> 목표: qa-automation-map.md 기준으로 모듈별 spec 파일을 생성한다. 모든 TC-ID가 코드에 1:1 매핑된다.
> 산출물: `tests/qa/{모듈}/` 아래 spec 파일들
> 예상 소요: 3~4시간

---

## 🚨 Phase 2.0 — PoC 모듈 1개로 패턴 확정 (필수 선행)

**이 단계를 건너뛰면 Phase 3에서 수백 건이 같은 이유로 한꺼번에 실패한다.**

> 과거 사례: 11개 모듈 818건을 일괄 생성 후 처음 실행하자 244건 실패. 원인의 70%가 **SPA navigation 패턴 미적용** + **strict mode violation** + **storageState 만료** 등 *공통 패턴 오류*. 1개 모듈을 먼저 PoC했다면 첫 실행에서 발견되어 나머지 10개 모듈에 패턴이 적용됐을 것.

### 절차

1. **가장 단순한 모듈 1개 선택** (예: MY — 내 정보, ~50건)
2. 해당 모듈 spec만 생성 (다른 모듈은 손대지 않음)
3. **즉시 실행**:
   ```bash
   SKIP_AUTH_SETUP=1 npx playwright test tests/qa/my/ --project=chromium
   ```
4. 실패 패턴 분석 — 아래 체크리스트로 진단

### PoC 진단 체크리스트

| 증상 | 원인 후보 | 패턴 확정 |
|---|---|---|
| 대부분 timeout, selector 못 찾음 | SPA direct URL → 홈 redirect | `automation-patterns.md` §0 GNB 클릭 패턴 |
| `getByText` strict mode violation | 광범위 정규식, 복수 매칭 | `getByRole` / `getByTestId` 우선, `.first()` 강제 |
| `/login` redirect 보임 | storageState 만료 | auth setup 재실행 + describe 블록에 `test.use({ storageState })` |
| 일부 페이지만 500 응답 | staging 서버 오류 | 해당 페이지는 `[B]`로 임시 마킹, BLOCKED 추적 |
| `expect()` 직후 무관한 실패 전파 | 가드 미적용 | `isVisibleSoft` 헬퍼 강제, `.catch(() => false)` 가드 |

### 패턴이 확정될 때까지 다른 모듈 생성 금지

PoC 모듈이 **0 fail (intentional skip만 허용)** 될 때까지 나머지 10개 모듈은 시작하지 않는다. 패턴이 확정되면:
- 헬퍼 함수(navigateTo, isVisibleSoft, safeClick 등)를 모듈간 공유 위치(예: 각 spec 상단 또는 별도 helper)에 정의
- 나머지 모듈은 같은 헬퍼·같은 패턴으로 일괄 생성

**확정된 패턴 = automation-patterns.md 0~9번 항목 + 모듈 공통 헬퍼.** Phase 2.0 완료 후에야 Phase 2 본 작업으로 진입.

---

## ⚠️ 핵심 원칙

**docs/qa 활성 TC-ID == tests/qa spec TC-ID (test + test.skip 합계)**

이 숫자가 맞지 않으면 Phase 2가 완료된 것이 아니다.
모든 활성 TC는 반드시 spec에 `test()` 또는 `test.skip()`으로 등록되어야 한다.
누락된 TC는 `[M]`(자동화 불가) / `[S]`(스킵) 중 하나로 반드시 처리한다.

### 검증 방법

```bash
npm run verify:coverage
```

- 누락 0건 → Phase 3 진행 가능
- 누락 있음 → 처리 방법에 따라 [M]/[S]/test() 추가 후 재실행

> `scripts/verify-coverage.mjs` — docs/qa 파싱 → spec 파싱 → 1:1 TC-ID 대조

---

## 디렉토리 구조

```
tests/qa/
├── auth/
│   └── auth.spec.ts
├── ta/
│   └── ta.spec.ts
├── eo/
│   └── eo.spec.ts
├── tf/
│   └── tf.spec.ts
├── sp/
│   └── sp.spec.ts
├── ei/
│   └── ei.spec.ts
├── er/
│   └── er.spec.ts
├── go/
│   └── go.spec.ts
├── home-ta/
│   └── home-ta.spec.ts
├── home-tp/
│   └── home-tp.spec.ts
└── my/
    └── my.spec.ts
```

---

## 구현 순서

의존성과 계정 사용 빈도를 고려한 순서:

| 순서 | 모듈 | 필요 계정 | 이유 |
|---|---|---|---|
| 1 | AUTH | 전 계정 | 나머지 모든 모듈의 전제 |
| 2 | MY | 전 계정 | 단순, 계정별 다양한 뷰 확인 |
| 3 | HOME-TP | 납세자 유료/무료 | 납세자 진입점 |
| 4 | HOME-TA | 세무사 2종 + 법인 | 세무사 진입점 |
| 5 | TA | 납세자 유료/무료 | 납세자 핵심 기능 |
| 6 | EO | 세무사 2종 | 세무사 핵심 기능 |
| 7 | GO | 전 계정 | 공통 기능 |
| 8 | EI | 세무사 2종 | 세무사 고급 기능 (TC 119개로 가장 많음) |
| 9 | ER | 세무사 2종 + 납세자 | EI 리포트 |
| 10 | TF | 법인 소유자 | 법인 전용 |
| 11 | SP | 전 계정 | 구독 상태별 확인 |

---

## 코드 작성 규칙

### 1. 테스트 이름 형식

TC-ID를 테스트 이름 맨 앞에 넣는다. 리포트에서 바로 QA 문서와 대조 가능하다.

```typescript
test('[AUTH-4-4-01] 이메일+비밀번호로 로그인 성공', async ({ page }) => {
  // ...
});
```

### 2. describe 블록 구조

QA 문서의 섹션 구조를 그대로 따른다.

```typescript
test.describe('AUTH — 로그인/회원가입', () => {

  test.describe('3. 접근 권한', () => {
    test('[AUTH-3-01] 비로그인 상태에서 홈 접근 시 로그인 유도', async ({ page }) => { ... });
  });

  test.describe('4-4. 로그인', () => {
    test('[AUTH-4-4-01] 이메일+비밀번호 로그인 성공', async ({ page }) => { ... });
    test('[AUTH-4-4-02] 잘못된 비밀번호 입력 시 에러 메시지', async ({ page }) => { ... });
  });

});
```

### 3. MANUAL 케이스 처리 (`[M]`)

**원리적으로 자동화 불가**한 케이스 (외부 인증, 결제, PDF 시각 검증 등). `test.skip()`으로 표시하고 이유를 주석으로 명시한다. 건너뛰지만 TC-ID는 결과에 나타난다.

```typescript
test.skip('[AUTH-4-6-03][M] 카카오 소셜 로그인', async ({ page }) => {
  // MANUAL: OAuth 팝업 — Playwright 자동화 차단
});
```

#### ⚠️ [M] 판단 트리 — 보수적 분류 금지

`[M]`은 **남발하기 쉬운 카테고리**다. "어려워 보임" → [M] 처리하면 실제로 자동화 가능한 TC도 묻혀버린다. 반드시 아래 트리를 따른다.

```
이 TC가 막히는 이유는 무엇인가?
├─ 외부 인증 팝업 (OAuth/SMS/PASS/KMC)         → [M] 확정
├─ PG 실거래 발생 자체 (실제 카드/계좌 차감)    → [M] 확정
├─ PDF/이미지 등 시각적 렌더링 결과 검증        → [M] 확정
├─ 외부 시스템 응답에 의존, 환경 불안정          → [M] 확정
├─ CAPTCHA / 사람 입력 필요                     → [M] 확정
├─ UI/기능이 아직 안 나옴                        → [B] 확정
└─ 위 6개 어디에도 해당 안 되면 → [M] 금지.
   자동화 시도 후 진짜 안 되면 그때 [M].
```

#### [M] 사유 카테고리 화이트리스트

`[M]` 처리 가능한 사유는 아래 5종으로 제한:

1. **본인 인증** — OAuth, SMS, PASS/KMC 등 외부 인증
2. **PG 실거래 발생** — 실제 카드 결제·계좌 차감
3. **PDF/이미지 시각 검증** — 렌더링 결과 (잘림, 그래프, 픽셀)
4. **외부 시스템 의존** — 응답 변동성, 관리자 수동 승인 등
5. **CAPTCHA / 사람 입력**

이외 사유로 `[M]` 처리 시 재검토 필수. `verify:coverage --audit` 실행 시 화이트리스트 외 사유는 경고로 출력된다.

#### 부분 자동화 원칙

> 한 TC가 통째로 자동화 어려워 보여도, 그 안의 일부 액션 결과 표시는 자동화 가능한 경우가 많다.

검증 범위를 가장 좁은 단위로 쪼개고, 그 단위가 자동화 가능한지 체크한다.

| TC 본래 검증 | "전체 검증" 시 | "좁은 단위" 시 |
|---|---|---|
| PDF 저장 버튼 → PDF 내용 확인 | [M] (PDF 파싱 어려움) | **자동화 가능**: 다운로드 이벤트 발생 검증 (`page.waitForEvent('download')`) |
| 결제 → 결제 내역 확인 | [M] (PG 실결제 필요) | **자동화 가능**: 결제 페이지 UI 표시 (목록 정렬·페이지네이션·버튼 비활성화) |
| 자동완성 드롭다운 검색 | [M] (불안정) | **자동화 가능**: `getByRole('option')` + `waitFor()` 적절한 timeout |
| 본인인증 후 번호 변경 | [M] (인증 팝업) | **자동화 가능**: 인증 전 단계까지 (이름·새 번호 입력 화면 진입) |

자동화 패턴 모음: `docs/anchor-e2e-v2/automation-patterns.md`

### 4. BLOCKED 케이스 처리 (`[B]`)

**UI 미출시**나 의존 기능 미배포로 일시 비활성화. 출시 후 자동화 가능.
`[M]`과 다른 점: `[B]`는 **시간이 지나면 해결**된다.

```typescript
test.skip('[EI-1-31][B] 소개글 빈 값 저장 유효성 검증', async () => {
  // BLOCKED: 폼 유효성 검증 UI 미구현 — 출시 후 자동화 가능
});
```

판단 기준:
- 자동화 도구의 한계 (OAuth, SMS, 결제 PG, PDF 내용 검증) → `[M]`
- 기능/UI가 아직 안 나옴 → `[B]`
- 헷갈리면 `[B]`. 출시 후 재검토할 때 `[M]`으로 바꿀 수 있다.

### 5. SKIP 케이스 처리 (`[S]`)

위험성 등으로 정책상 제외한 케이스. 이유를 주석으로 명시한다.

```typescript
test.skip('[AUTH-탈퇴-01][S] 계정 완전 탈퇴', async ({ page }) => {
  // SKIP: 테스트 계정 영구 삭제 위험 — 수동 수행
});
```

> ⚠️ SKIP을 남발하지 않는다. MANUAL + SKIP 합계가 30개를 초과하면 반드시 재검토한다.

### 6. DEPRECATED 케이스 처리 (`[D]`)

QA 문서에서 ~~취소선~~ 처리된 TC는 `[D]`로 등록한다 (코드에 안 넣으면 verify 단계에서 누락 처리된다).

```typescript
test.skip('[AUTH-1-04][D] 전직 공무원 찾기 — 진입점 제거됨', async () => {
  // DEPRECATED: 비로그인 홈에서 진입점 제거됨
});
```

### 6. 계정 픽스처 사용

기존 `shared/fixtures/auth.ts`의 storageState를 재사용한다:

```typescript
test.use({ storageState: 'tests/.auth/taxpayer-paid.json' });
```

각 describe 블록에서 필요한 계정으로 설정.

### 7. CRUD 테스트 원상복구

데이터 변경 케이스(프로필 저장, 이력 추가 등)는 afterEach/afterAll에서 원상복구한다.

```typescript
test.afterEach(async ({ page }) => {
  // 변경한 데이터를 원래 상태로 복구
});
```

### 8. UI 미구현 항목

현재 UI에 없는 버튼/기능이 있으면 `test.skip()`으로 표시하되, 이유에 "UI 미구현" 명시.
릴리즈 후 해제 예정임을 주석에 기재.

```typescript
test.skip('[ER-1-05][M] PDF 다운로드', async ({ page }) => {
  // MANUAL: UI 미구현 — PDF 버튼 릴리즈 후 재활성화 필요
});
```

### 9. 불안정한 UI 요소 처리

자동완성, 드롭다운 등 타이밍 이슈가 있는 요소:
- `waitForSelector` + 충분한 timeout 사용
- `dispatchEvent('click')` 사용 (viewport 외부 요소)
- retry 로직 추가

---

## 모듈별 구현 완료 기준

각 모듈 구현 후 단독으로 실행해서 검증:

```bash
npx playwright test tests/qa/auth/ --project=chromium
npx playwright test tests/qa/my/ --project=chromium
# ...
```

기준:
- AUTOMATABLE 케이스: PASS 또는 FAIL (실패가 나와도 정상 — 버그 발견)
- MANUAL / SKIP 케이스: skipped 로 표시되면 정상
- 에러로 중단되는 케이스 없어야 함 (timeout 제외)

---

## ✅ 완료 기준

- [ ] 11개 모듈 spec 파일 생성
- [ ] **spec 파일 전체 TC-ID 수 == 872개 (삭제된 TC 제외)**
- [ ] 모든 활성 TC-ID가 코드에 1:1 매핑됨
- [ ] 삭제된 TC는 코드에 없음
- [ ] 각 모듈 단독 실행 시 에러 없음 (FAIL은 허용)
- [ ] `npx playwright test tests/qa/ --project=chromium` 전체 실행 가능
- [ ] MANUAL + SKIP 합계 검토 완료

완료 → Phase 3로 이동.
