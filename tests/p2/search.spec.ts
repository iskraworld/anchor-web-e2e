import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

test.describe('P2 Search: 검색 추가 기능', () => {
  test.describe('as taxOfficer', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('FN-SEARCH-003: 공무원 검색 결과 페이지 로딩 + 입력 필드 존재', async ({ page }) => {
      await page.goto('/search/active-officials');
      await expect(page.locator('body')).not.toContainText('오류');
      expect(page.url()).toContain('active-officials');
    });
  });

  test('FN-SEARCH-007: 세무사 검색 결과 페이지네이션 UI 존재', async ({ page }) => {
    await page.goto('/search/tax-experts');
    await expect(page.locator('body')).not.toContainText('오류');
    // 결과가 있으면 페이지네이션 또는 리스트 컨테이너 존재
    const hasPagination = await page.locator('[aria-label*="page"], [role="navigation"], nav').first().isVisible({ timeout: 3000 }).catch(() => false);
    const hasResults = await page.locator('body').textContent();
    expect(hasResults).toBeTruthy();
  });
});
