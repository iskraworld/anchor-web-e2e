import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

const KIMGYEONGGUK_ID = 3313;

test.describe('P2 Permissions: 추가 권한 확인', () => {
  test.describe('as paidUser (납세자 유료)', () => {
    test.use({ storageState: AUTH_FILES.paidUser });

    test('FN-PERM-002: 납세자 유료 구독 — 전직 공무원 탭 미노출', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-retired-official-tab')).not.toBeVisible();
    });
  });
});
