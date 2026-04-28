import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// P2: staging 데이터 변경 포함. 실행 후 원복 필수.
test.use({ storageState: AUTH_FILES.nonOfficer });

test.describe('시나리오 C 확장: 프로필 노출 토글 ON/OFF 플로우', () => {
  test('TM-C-3: 토글 ON → 검색 노출 변화 확인 → 토글 OFF 원복', async ({ page }) => {
    await page.goto('/tax-history-management/basic-info');

    const modal = page.getByTestId('tax-history-guide-modal');
    if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.getByTestId('tax-history-modal-close-btn').click();
      await expect(modal).not.toBeVisible();
    }

    const toggle = page.locator('[role="switch"]');
    await expect(toggle).toBeVisible();

    const initialState = await toggle.isChecked();

    try {
      if (!initialState) {
        await toggle.click();
        await page.waitForTimeout(1000);
        expect(await toggle.isChecked()).toBe(true);
      }

      // 토글 ON 상태에서 검색 결과 확인
      await page.goto('/search/tax-experts?firmName=가온세무법인');
      await expect(page.getByText('한지희').first()).toBeVisible();
      // 토글 ON 상태에서 한지희 카드 노출 확인 (세부 정보 포함 여부)
      const bodyText = await page.locator('body').textContent() ?? '';
      expect(bodyText).toContain('한지희');

    } finally {
      // 항상 원복: 초기 상태로 복구
      await page.goto('/tax-history-management/basic-info');
      const modal2 = page.getByTestId('tax-history-guide-modal');
      if (await modal2.isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.getByTestId('tax-history-modal-close-btn').click();
      }
      const toggleAfter = page.locator('[role="switch"]');
      const currentState = await toggleAfter.isChecked();
      if (currentState !== initialState) {
        await toggleAfter.click();
        await page.waitForTimeout(500);
      }
    }
  });
});
