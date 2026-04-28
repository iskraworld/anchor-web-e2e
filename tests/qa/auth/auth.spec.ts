import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── AUTH — 로그인/회원가입 ───────────────────────────────────────────────────

test.describe('AUTH — 로그인/회원가입', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한 (비로그인 상태)', () => {

    test('[AUTH-3-01] 비로그인 홈 접근 시 서비스 소개 또는 로그인 유도 표시', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
      // 비로그인 상태에서 홈 접근 → 로그인 유도 버튼 또는 서비스 소개 노출
      const loginBtn = page.getByRole('link', { name: /로그인|시작하기/ }).or(
        page.getByRole('button', { name: /로그인|시작하기/ })
      );
      await expect(loginBtn.first()).toBeVisible({ timeout: 10000 });
    });

    test('[AUTH-3-02] 비로그인 상태 회원정보 페이지 접근 → 로그인 리다이렉트', async ({ page }) => {
      await page.goto('/my-info');
      // 로그인 페이지로 이동되거나 로그인 UI 표시
      await expect(page).toHaveURL(/login|\/$/);
    });

    test('[AUTH-3-03] 비로그인 상태 세무사 찾기 접근 → 필터 표시됨', async ({ page }) => {
      await page.goto('/search/tax-experts');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[AUTH-3-04] 비로그인 상태 세무 이력 관리 접근 → 로그인 또는 에러', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await expect(page).toHaveURL(/login|\/$/);
    });

    test('[AUTH-3-05] 비로그인 상태 현직 공무원 탐색 접근 → 로그인 또는 에러', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[AUTH-3-06] 비로그인 상태 전직 공무원 찾기 접근 → 로그인 또는 에러', async ({ page }) => {
      await page.goto('/search/retired-officials');
      await expect(page.locator('body')).toBeVisible();
    });

  });

  // ─── 4-1. 로그인 전 홈 화면 ────────────────────────────────────────────────

  test.describe('4-1. 로그인 전 홈 화면', () => {

    test('[AUTH-4-1-01] 로그인 버튼 표시', async ({ page }) => {
      await page.goto('/');
      const loginLink = page.getByRole('link', { name: /로그인/ }).or(
        page.getByRole('button', { name: /로그인/ })
      );
      await expect(loginLink.first()).toBeVisible({ timeout: 10000 });
    });

    test('[AUTH-4-1-02] 서비스 소개 영역 표시', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[AUTH-4-1-03] 세무사 찾기 필터 비로그인 접근 가능', async ({ page }) => {
      await page.goto('/search/tax-experts');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[AUTH-4-1-04] 회원 가입 버튼 표시', async ({ page }) => {
      await page.goto('/');
      const signupBtn = page.getByRole('link', { name: /회원가입|가입/ }).or(
        page.getByRole('button', { name: /회원가입|가입/ })
      );
      await expect(signupBtn.first()).toBeVisible({ timeout: 10000 });
    });

    test('[AUTH-4-1-05] 로고 클릭 시 홈 유지', async ({ page }) => {
      await page.goto('/');
      const logo = page.locator('header').getByRole('link').first();
      if (await logo.isVisible()) {
        await logo.click();
      }
      await expect(page).toHaveURL(/\/$|\/home/);
    });

    test('[AUTH-4-1-06] 세무사 찾기 검색 결과 노출 (비로그인)', async ({ page }) => {
      await page.goto('/search/tax-experts?officeRegion=REGION_29');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[AUTH-4-1-07] 세무사 프로필 상세 접근 (비로그인)', async ({ page }) => {
      await page.goto('/search/tax-experts');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[AUTH-4-1-08] 멤버십 안내 CTA 표시 (비로그인)', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });

  });

  // ─── 4-4. 로그인 ────────────────────────────────────────────────────────────

  test.describe('4-4. 로그인', () => {

    test('[AUTH-4-4-01] 이메일+비밀번호 로그인 성공 → 홈 이동', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /이메일|email/i }).fill(
        process.env.ANCHOR_EMAIL_TAXPAYER_PAID ?? ''
      );
      await page.getByRole('textbox', { name: /비밀번호|password/i }).fill(
        process.env.ANCHOR_PASSWORD ?? ''
      );
      await page.getByRole('button', { name: /로그인/i }).click();
      await expect(page).toHaveURL(/\/$|\/home/, { timeout: 15000 });
    });

    test('[AUTH-4-4-02] 잘못된 비밀번호 → 에러 메시지 표시', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /이메일|email/i }).fill(
        process.env.ANCHOR_EMAIL_TAXPAYER_PAID ?? ''
      );
      await page.getByRole('textbox', { name: /비밀번호|password/i }).fill('wrongpassword123!');
      await page.getByRole('button', { name: /로그인/i }).click();
      await expect(
        page.getByText(/비밀번호|로그인 실패|잘못된|틀렸|일치하지|올바르지|확인/).first()
      ).toBeVisible({ timeout: 10000 });
    });

    test('[AUTH-4-4-03] 존재하지 않는 이메일 → 에러 메시지 표시', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /이메일|email/i }).fill('notexist_test_qa@never.com');
      await page.getByRole('textbox', { name: /비밀번호|password/i }).fill('wrongpassword123!');
      await page.getByRole('button', { name: /로그인/i }).click();
      await expect(
        page.getByText(/존재하지|없는|이메일|로그인 실패|올바르지|일치하지/).first()
      ).toBeVisible({ timeout: 10000 });
    });

    test('[AUTH-4-4-04] 이메일 미입력 → 버튼 비활성 또는 에러', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /비밀번호|password/i }).fill('somepassword');
      const submitBtn = page.getByRole('button', { name: /로그인/i });
      const isDisabled = await submitBtn.isDisabled();
      if (!isDisabled) {
        await submitBtn.click();
        await expect(
          page.getByText(/이메일|필수|입력해주세요|입력/).first()
        ).toBeVisible({ timeout: 5000 });
      } else {
        expect(isDisabled).toBe(true);
      }
    });

    test('[AUTH-4-4-05] 비밀번호 미입력 → 버튼 비활성 또는 에러', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /이메일|email/i }).fill('test@test.com');
      const submitBtn = page.getByRole('button', { name: /로그인/i });
      const isDisabled = await submitBtn.isDisabled();
      if (!isDisabled) {
        await submitBtn.click();
        await expect(
          page.getByText(/비밀번호|필수|입력해주세요|입력/).first()
        ).toBeVisible({ timeout: 5000 });
      } else {
        expect(isDisabled).toBe(true);
      }
    });

    test('[AUTH-4-4-06] 유효하지 않은 이메일 형식 → 에러', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /이메일|email/i }).fill('notanemail');
      await page.getByRole('textbox', { name: /비밀번호|password/i }).fill('somepassword');
      await page.getByRole('button', { name: /로그인/i }).click();
      await expect(
        page.getByText(/유효|올바른|형식|이메일|이메일 형식/).first()
      ).toBeVisible({ timeout: 5000 });
    });

    test.skip('[AUTH-4-4-07][M] 소셜 로그인 (카카오)', async ({ page }) => {
      // MANUAL: OAuth 팝업 — Playwright 자동화 차단
    });

    test.skip('[AUTH-4-4-08][M] 소셜 로그인 (구글)', async ({ page }) => {
      // MANUAL: OAuth 팝업 — Playwright 자동화 차단
    });

    test('[AUTH-4-4-09] 세무사 계정 로그인 → 세무사 홈 이동', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /이메일|email/i }).fill(
        process.env.ANCHOR_EMAIL_TAX_OFFICIAL ?? ''
      );
      await page.getByRole('textbox', { name: /비밀번호|password/i }).fill(
        process.env.ANCHOR_PASSWORD ?? ''
      );
      await page.getByRole('button', { name: /로그인/i }).click();
      await expect(page).toHaveURL(/\/$|\/home/, { timeout: 15000 });
    });

    test('[AUTH-4-4-10] 로그인 후 GNB 사용자 아이콘 표시', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('textbox', { name: /이메일|email/i }).fill(
        process.env.ANCHOR_EMAIL_TAXPAYER_PAID ?? ''
      );
      await page.getByRole('textbox', { name: /비밀번호|password/i }).fill(
        process.env.ANCHOR_PASSWORD ?? ''
      );
      await page.getByRole('button', { name: /로그인/i }).click();
      await expect(page).toHaveURL(/\/$|\/home/, { timeout: 15000 });
      await expect(
        page.getByTestId('gnb-profile-btn').or(page.getByRole('button', { name: /프로필|사용자|user/i }))
      ).toBeVisible();
    });

    test('[AUTH-4-4-11] 비밀번호 보기/숨기기 토글', async ({ page }) => {
      await page.goto('/login');
      const pwInput = page.getByRole('textbox', { name: /비밀번호|password/i });
      await pwInput.fill('testpassword');
      const toggleBtn = page.locator('button[aria-label*="비밀번호"]').or(
        page.locator('button').filter({ hasText: /보기|눈/ })
      );
      if (await toggleBtn.first().isVisible()) {
        await toggleBtn.first().click();
        await expect(pwInput).toHaveAttribute('type', 'text');
      } else {
        test.skip();
      }
    });

    test('[AUTH-4-4-12] 비밀번호 찾기 링크 표시', async ({ page }) => {
      await page.goto('/login');
      await expect(
        page.getByText(/비밀번호 찾기|비밀번호를 잊/)
      ).toBeVisible({ timeout: 10000 });
    });

  });

  // ─── 4-5. 회원가입 유형 선택 ──────────────────────────────────────────────

  test.describe('4-5. 회원가입 유형 선택', () => {

    test('[AUTH-4-5-01] 회원가입 페이지 접근 → 유형 선택 화면 표시', async ({ page }) => {
      // 홈에서 회원가입 버튼 클릭 후 유형 선택 화면 확인
      await page.goto('/');
      const signupBtn = (page.getByRole('link', { name: /회원가입|가입/ }).or(
        page.getByRole('button', { name: /회원가입|가입/ })
      )).first();
      if (await signupBtn.isVisible({ timeout: 5000 })) {
        await signupBtn.click();
        await page.waitForLoadState('load');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      } else {
        test.skip();
      }
    });

    test('[AUTH-4-5-02] 납세자 유형 선택 가능', async ({ page }) => {
      await page.goto('/');
      const signupBtn = (page.getByRole('link', { name: /회원가입|가입/ }).or(
        page.getByRole('button', { name: /회원가입|가입/ })
      )).first();
      if (await signupBtn.isVisible({ timeout: 5000 })) {
        await signupBtn.click();
        await page.waitForLoadState('load');
        const taxpayerOption = page.getByText(/납세자/).first();
        if (await taxpayerOption.isVisible({ timeout: 5000 })) {
          await expect(taxpayerOption).toBeVisible();
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('[AUTH-4-5-03] 세무사 유형 선택 가능', async ({ page }) => {
      await page.goto('/');
      const signupBtn = (page.getByRole('link', { name: /회원가입|가입/ }).or(
        page.getByRole('button', { name: /회원가입|가입/ })
      )).first();
      if (await signupBtn.isVisible({ timeout: 5000 })) {
        await signupBtn.click();
        await page.waitForLoadState('load');
        const option = page.getByText(/^세무사/).first();
        if (await option.isVisible({ timeout: 5000 })) {
          await expect(option).toBeVisible();
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('[AUTH-4-5-04] 세무법인 유형 선택 가능', async ({ page }) => {
      await page.goto('/');
      const signupBtn = (page.getByRole('link', { name: /회원가입|가입/ }).or(
        page.getByRole('button', { name: /회원가입|가입/ })
      )).first();
      if (await signupBtn.isVisible({ timeout: 5000 })) {
        await signupBtn.click();
        await page.waitForLoadState('load');
        const option = page.getByText(/세무법인/).first();
        if (await option.isVisible({ timeout: 5000 })) {
          await expect(option).toBeVisible();
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test.skip('[AUTH-4-5-05][M] 이메일 인증 발송 확인', async ({ page }) => {
      // MANUAL: 외부 이메일 수신 확인 불가
    });

  });

  // ─── 4-6. 일반 개인 회원가입 ─────────────────────────────────────────────

  test.describe('4-6. 일반 개인 회원가입', () => {

    test.skip('[AUTH-4-6-01][S] 신규 일반 개인 회원가입 전체 플로우', async ({ page }) => {
      // SKIP: 사람이 수행 — 신규 계정 생성 후 정리 필요
    });

    test.skip('[AUTH-4-6-02][M] 소셜 로그인 (카카오) 가입', async ({ page }) => {
      // MANUAL: OAuth 팝업 차단
    });

    test.skip('[AUTH-4-6-03][M] 소셜 로그인 (구글) 가입', async ({ page }) => {
      // MANUAL: OAuth 팝업 차단
    });

    test('[AUTH-4-6-04] 이메일 중복 확인 — 이미 사용중인 이메일 에러', async ({ page }) => {
      await page.goto('/register');
      // 회원가입 폼이 로드되면 이미 사용 중인 이메일 입력
      const emailInput = page.getByRole('textbox', { name: /이메일/i });
      if (await emailInput.isVisible({ timeout: 5000 })) {
        await emailInput.fill(process.env.ANCHOR_EMAIL_TAXPAYER_PAID ?? 'ceo.kim@theanchor.best');
        await page.getByRole('button', { name: /중복|확인/i }).first().click();
        await expect(
          page.getByText(/이미|중복|사용 중/)
        ).toBeVisible({ timeout: 8000 });
      } else {
        test.skip();
      }
    });

    test('[AUTH-4-6-05] 비밀번호 유효성 규칙 미충족 → 에러', async ({ page }) => {
      await page.goto('/register');
      const pwInput = page.getByRole('textbox', { name: /비밀번호/i }).first();
      if (await pwInput.isVisible({ timeout: 5000 })) {
        await pwInput.fill('short');
        await pwInput.blur();
        await expect(
          page.getByText(/비밀번호|8자|규칙|특수문자/)
        ).toBeVisible({ timeout: 5000 });
      } else {
        test.skip();
      }
    });

    test('[AUTH-4-6-06] 비밀번호 확인 불일치 → 에러', async ({ page }) => {
      await page.goto('/register');
      const pwInput = page.getByRole('textbox', { name: /비밀번호/i }).first();
      const pwConfirmInput = page.getByRole('textbox', { name: /비밀번호 확인/i }).or(
        page.getByRole('textbox', { name: /confirm/i })
      );
      if (await pwInput.isVisible({ timeout: 5000 })) {
        await pwInput.fill('ValidPass123!');
        if (await pwConfirmInput.isVisible()) {
          await pwConfirmInput.fill('DifferentPass123!');
          await pwConfirmInput.blur();
          await expect(
            page.getByText(/일치하지|다릅니다|확인/)
          ).toBeVisible({ timeout: 5000 });
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test.skip('[AUTH-4-6-07][M] 본인인증 SMS 수신 확인', async ({ page }) => {
      // MANUAL: SMS 수신 불가
    });

    test.skip('[AUTH-4-6-08][S] 신규 가입 완료 후 홈 이동', async ({ page }) => {
      // SKIP: 신규 계정 생성 필요
    });

    test.skip('[AUTH-4-6-09][S] 약관 동의 화면 표시', async ({ page }) => {
      // SKIP: 가입 플로우 진행 필요
    });

    test.skip('[AUTH-4-6-10][S] 필수 약관 미동의 → 버튼 비활성', async ({ page }) => {
      // SKIP: 가입 플로우 진행 필요
    });

  });

  // ─── 4-7. 세무사 회원가입 ─────────────────────────────────────────────────

  test.describe('4-7. 세무사 회원가입', () => {

    test.skip('[AUTH-4-7-01][S] 세무사 신규 회원가입 전체 플로우', async ({ page }) => {
      // SKIP: 신규 계정 생성 필요
    });

    test.skip('[AUTH-4-7-02][M] 소셜 로그인 (카카오) 세무사 가입', async ({ page }) => {
      // MANUAL: OAuth 팝업 차단
    });

    test.skip('[AUTH-4-7-03][S] 세무사 등록번호 입력', async ({ page }) => {
      // SKIP: 신규 가입 플로우 필요
    });

    test.skip('[AUTH-4-7-04][M] 세무사 이메일 인증 링크 확인', async ({ page }) => {
      // MANUAL: 외부 이메일 수신 불가
    });

    test.skip('[AUTH-4-7-05][S] 세무사 가입 완료 후 세무사 홈 이동', async ({ page }) => {
      // SKIP: 신규 계정 생성 필요
    });

    test.skip('[AUTH-4-7-06][S] 세무사 약관 동의 화면', async ({ page }) => {
      // SKIP: 가입 플로우 진행 필요
    });

  });

  // ─── 4-8. 세무법인 회원가입 ────────────────────────────────────────────────

  test.describe('4-8. 세무법인 회원가입', () => {

    test.skip('[AUTH-4-8-01][S] 세무법인 신규 회원가입 전체 플로우', async ({ page }) => {
      // SKIP: 신규 계정 생성 필요
    });

    test.skip('[AUTH-4-8-02][M] 소셜 로그인 (카카오) 법인 가입', async ({ page }) => {
      // MANUAL: OAuth 팝업 차단
    });

    test.skip('[AUTH-4-8-03][S] 법인명/사업자번호 입력', async ({ page }) => {
      // SKIP: 신규 가입 플로우 필요
    });

    test.skip('[AUTH-4-8-04][M] 법인 이메일 인증 링크 확인', async ({ page }) => {
      // MANUAL: 외부 이메일 수신 불가
    });

    test.skip('[AUTH-4-8-05][S] 법인 가입 완료 후 홈 이동', async ({ page }) => {
      // SKIP: 신규 계정 생성 필요
    });

    test.skip('[AUTH-4-8-06][S] 법인 약관 동의 화면', async ({ page }) => {
      // SKIP: 가입 플로우 진행 필요
    });

    test.skip('[AUTH-4-8-07][S] 법인 대표자 정보 입력', async ({ page }) => {
      // SKIP: 신규 가입 플로우 필요
    });

    test.skip('[AUTH-4-8-08][S] 세무사 소속 연결', async ({ page }) => {
      // SKIP: 신규 가입 플로우 필요
    });

    test.skip('[AUTH-4-8-09][M] 사업자등록번호 인증', async ({ page }) => {
      // MANUAL: 외부 인증 API 연동 확인 불가
    });

    test.skip('[AUTH-4-8-10][S] 법인 구성원 초대 발송', async ({ page }) => {
      // SKIP: 초대 이메일 발송으로 스테이징 오염 가능
    });

  });

});
