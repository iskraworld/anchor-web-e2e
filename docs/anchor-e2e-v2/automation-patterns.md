# Playwright 자동화 패턴 모음

> [M] 처리 전에 이 문서를 먼저 확인한다.
> "어려워 보임" 사유 대부분은 아래 패턴으로 해결된다.

---

## 1. PDF / 파일 다운로드

`page.waitForEvent('download')`로 다운로드 트리거 자체를 자동화 검증한다.
시각 검증(잘림·그래프·픽셀)은 자동화 불가지만, **다운로드 발생 여부**는 자동화 가능.

```typescript
test('[ER-1-05] PDF 저장 버튼 — 다운로드 발생', async ({ page }) => {
  await page.goto('/tax-history-report/me');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'PDF 저장' }).click(),
  ]);

  // 파일명·확장자 검증
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});
```

**[M] 처리 부분만 분리**: 위와 별도로 PDF 내용 시각 검증은 `[M]`으로 남겨둔다.

---

## 2. 자동완성 드롭다운

"불안정"하다는 이유로 [M] 처리하지 말 것. 적절한 `waitFor` + `getByRole('option')` 패턴으로 안정 자동화 가능.

```typescript
test('[HOME-TA-1-31] 세무법인명 자동완성', async ({ page }) => {
  const input = page.getByPlaceholder('세무법인명');
  await input.fill('한국');

  const option = page.getByRole('option', { name: /한국세무법인/ });
  await option.waitFor({ state: 'visible', timeout: 5000 });
  await option.click();

  await expect(input).toHaveValue(/한국/);
});
```

**드롭다운이 안 뜨는 UI 버그가 있다면**: 이건 `[B]` (UI 버그 수정 후 자동화). `[M]`이 아님.

---

## 3. 결제 페이지 — UI 표시만 검증

PG 실거래는 [M]이지만, **결제 페이지 진입 + 버튼 상태 + 목록 표시**는 자동화 가능.

```typescript
test('[SP-1-23] 결제 수단 추가 버튼 비활성화', async ({ page }) => {
  await page.goto('/membership/payment');
  const addBtn = page.getByRole('button', { name: '결제 수단 추가' });

  // 무료 구독자는 비활성화 상태
  await expect(addBtn).toBeDisabled();
});

test('[SP-1-22] 결제 내역 페이지네이션 10건씩', async ({ page }) => {
  await page.goto('/membership/history');
  const rows = page.getByRole('row');
  await expect(rows).toHaveCount(10 + 1); // 헤더 1줄 포함
});
```

**판단**: "PG 결제 자동화 불가"라는 큰 룰을 모든 SP TC에 적용하지 말 것. 각 TC가 실제로 검증하려는 게 무엇인지 본다.

---

## 4. 본인인증 — 인증 전 단계까지

본인인증 팝업 자체는 [M]이지만, **인증 모달 진입 + 입력 필드 상태**는 자동화 가능.

```typescript
test('[AUTH-6-04-1] 본인 인증 모달 진입', async ({ page }) => {
  await page.goto('/signup');
  await page.getByRole('button', { name: '본인 인증하기' }).click();

  // PASS/KMC 팝업이 떠야 함
  const popup = page.getByRole('dialog', { name: /본인 인증/ });
  await expect(popup).toBeVisible();
  // 팝업 내부 인증 진행은 [M]으로 남김
});
```

---

## 5. 파일 업로드 — 업로드 트리거까지

`setInputFiles()`로 파일 업로드 자동화 가능. 단, **관리자 승인 결과 확인**은 [M].

```typescript
test('[EI-1-08] 자격증 파일 업로드', async ({ page }) => {
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('tests/fixtures/sample-cert.pdf');

  await expect(page.getByText(/업로드 완료/)).toBeVisible();
  // 관리자 승인 결과는 [M]으로 별도 분리
});
```

---

## 6. 외부 새 창 / popup

`context.waitForEvent('page')`로 새 창 자동화 가능.

```typescript
test('[AUTH-2-02] 새 창에서 멤버십 상세 표시', async ({ page, context }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: '세무사/세무법인 멤버십' }).click(),
  ]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/membership.*tax/);
});
```

---

## 7. 네트워크 응답 검증

API 응답을 직접 가로채서 데이터 변경 없이 검증.

```typescript
test('[GO-1-04] 검색 결과 API 응답 검증', async ({ page }) => {
  const response = page.waitForResponse(/\/api\/officials\/search/);
  await page.getByRole('button', { name: '검색' }).click();
  const res = await response;
  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(data.items).toBeInstanceOf(Array);
});
```

---

## 8. 시각 회귀 (스크린샷 비교)

특정 컴포넌트의 렌더링 결과를 픽셀 단위로 비교 — 시각 검증을 자동화하는 한 가지 방법.

```typescript
test('[VR-1] 세무법인 랭킹 카드 시각 검증', async ({ page }) => {
  await page.goto('/');
  const card = page.getByTestId('ranking-card');
  await expect(card).toHaveScreenshot('ranking-card.png');
});
```

PDF처럼 완전 시각 검증이 필요한 경우에도, 베이스라인을 한 번 확정해두면 회귀는 자동 검증 가능.

---

## 9. 권한 / 역할별 진입 차단

다른 storageState로 같은 페이지를 접속해 차단·진입을 검증.

```typescript
test.use({ storageState: 'tests/.auth/free-user.json' });
test('[GO-0-01] 무료 계정 — 접근 차단 화면', async ({ page }) => {
  await page.goto('/search/active-officials');
  await expect(page.getByText(/구독|업그레이드/)).toBeVisible();
});
```

---

## 자동화 불가가 진짜 맞는 케이스 (`[M]` 정당)

아래는 **시도해도 정말 안 되는** 영역. 이런 경우만 `[M]`:

| 영역 | 사유 |
|---|---|
| OAuth 소셜 로그인 (카카오/구글/페이스북) | 외부 OAuth provider 팝업, IP/디바이스 검증 |
| SMS / KMC / PASS 본인인증 | 실제 휴대폰 SMS 또는 PASS 앱 인증 필요 |
| PG 실거래 (카드 결제 완료) | 실제 카드 차감, 테스트 결제 환경 없을 때 |
| PDF 내용 시각 검증 | "잘림", "그래프 모양", 픽셀 단위 정확성 |
| CAPTCHA | reCAPTCHA 등 봇 차단 |
| 안심번호 / 익명 처리 | 외부 서비스의 마스킹 결과 검증 |

---

## 셀프 체크리스트

[M] 처리 전에 아래를 확인:

- [ ] 위 9개 패턴 중 하나로 해결되는가?
- [ ] TC를 더 좁은 검증 범위로 쪼갤 수 있는가?
- [ ] 자동화 시도를 실제로 해봤는가? (코드 작성·실행)
- [ ] [M] 사유가 위 "정당한 [M]" 표 6개 중 하나인가?
- [ ] [B] (UI 미출시)로 분류해야 할 항목은 아닌가?

**모두 No이면 → 자동화 시도. Yes이면 → [M].**
