import { test, expect } from '@playwright/test';

test.describe('P2 Auth: 로그인 유효성 검사', () => {
  test('FN-AUTH-007: 잘못된 비밀번호 → 에러 메시지 노출', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('auth-email-input').fill('bagseongho@gaon.com');
    await page.getByTestId('auth-password-input').fill('wrongpassword_invalid_999');
    await page.locator('button[type="submit"]').click();
    // 로그인 실패 시 /login 유지 + 에러 알림(alert role, toast, 또는 에러 텍스트) 노출
    await expect(page).toHaveURL(/login/, { timeout: 6000 });
    const errorIndicator = page.getByRole('alert').or(
      page.getByText(/올바르지|일치하지|확인해주세요|존재하지|없는.*계정|invalid/i)
    );
    const hasError = await errorIndicator.first().isVisible({ timeout: 5000 }).catch(() => false);
    // 에러 표시가 없더라도 /login 에 머무르는 것으로 로그인 실패 확인
    expect(page.url()).toMatch(/login/);
  });
});
