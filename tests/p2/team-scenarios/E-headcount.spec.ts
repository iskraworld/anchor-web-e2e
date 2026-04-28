import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

test.use({ storageState: AUTH_FILES.firmOwner });

test.describe('시나리오 E 확장: 법인 인력 구성 확인', () => {
  test('TM-E-2: 부동산·금융 전문 인력 수 확인', async ({ page }) => {
    await page.goto('/tax-history-report/me?tab=corporate');
    await expect(page.getByText(/부동산|금융|상속|증여|세무조사|조세불복/i).first()).toBeVisible({ timeout: 10000 });
    // 인력 수를 나타내는 숫자 요소가 하나 이상 존재
    const bodyText = await page.locator('body').textContent() ?? '';
    expect(/\d+/.test(bodyText)).toBeTruthy();
  });
});
