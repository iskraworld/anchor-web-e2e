import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

test.describe('P2 Forms: 폼 유효성 검사', () => {
  test('FN-FORM-002: 이메일 빈 값으로 로그인 시도 → /login 유지', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('auth-password-input').fill('somepassword');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/login/);
  });

  test('FN-FORM-003: 이메일 형식 오류로 로그인 시도 → /login 유지', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('auth-email-input').fill('notanemail');
    await page.getByTestId('auth-password-input').fill('somepassword');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/login/);
  });

  test.describe('as nonOfficer (한지희)', () => {
    test.use({ storageState: AUTH_FILES.nonOfficer });

    test('FN-FORM-005: 세무이력관리 프로필 노출 토글 요소 확인', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      const modal = page.getByTestId('tax-history-guide-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.getByTestId('tax-history-modal-close-btn').click();
        await expect(modal).not.toBeVisible();
      }
      await expect(page.locator('[role="switch"]')).toBeVisible();
    });
  });
});
