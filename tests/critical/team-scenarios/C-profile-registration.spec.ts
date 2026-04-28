import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { TaxHistoryPage } from '../../../shared/pages/TaxHistoryPage';

test.use({ storageState: AUTH_FILES.nonOfficer });

test.describe('시나리오 C: 세무사 프로필 노출 확인', () => {
  test('C-1: 가온세무법인 검색 — 한지희 카드 노출되지만 이력 미등록 확인', async ({ page }) => {
    await page.goto('/search/tax-experts?firmName=가온세무법인');
    // 박성호(전관)는 풀 프로필로 조회됨
    await expect(page.getByText('박성호').first()).toBeVisible();
    // 한지희 카드는 보이지만 세무이력 미등록 → 연락처 미노출
    await expect(page.getByText('한지희').first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText('taxhan@theanchor.best');
  });

  test('C-2: 세무이력관리 접근 — 가이드 모달 닫기 + 토글 노출 확인', async ({ page }) => {
    const taxHistory = new TaxHistoryPage(page);
    await taxHistory.goto();
    await taxHistory.closeGuideModal();
    await expect(taxHistory.getToggle()).toBeVisible();
  });
});
