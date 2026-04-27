import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { TaxHistoryPage } from '../../../shared/pages/TaxHistoryPage';

test.use({ storageState: AUTH_FILES.nonOfficer });

test.describe('시나리오 C: 세무사 프로필 노출 확인', () => {
  // C-1: 한지희 토글 현재 ON 상태 — Anchor 팀 OFF 원복 후 실행
  test.skip('C-1: 가온세무법인 검색 — 한지희 미노출 확인 (CONDITIONAL)', async ({ page }) => {
    await page.goto('/search/tax-experts?firmName=가온세무법인');
    await expect(page.getByText('박성호').first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText('한지희');
  });

  test('C-2: 세무이력관리 접근 — 가이드 모달 닫기 + 토글 노출 확인', async ({ page }) => {
    const taxHistory = new TaxHistoryPage(page);
    await taxHistory.goto();
    await taxHistory.closeGuideModal();
    await expect(taxHistory.getToggle()).toBeVisible();
  });
});
