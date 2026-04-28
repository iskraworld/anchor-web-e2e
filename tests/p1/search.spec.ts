import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

test.describe('P1 Search: 검색 기능 확인', () => {

  test.describe('공무원 검색 (as taxOfficer)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('FN-SEARCH-001: 공무원명 검색 결과 1건 이상', async ({ page }) => {
      await page.goto('/search/active-officials?name=김');
      await expect(page.getByRole('heading', { name: /현직 공무원 검색 결과/ })).toBeVisible();
      // 검색 결과 테이블에 데이터 행 존재
      await expect(page.getByRole('row').nth(1)).toBeVisible();
    });

    test('FN-SEARCH-002: 공무원명 검색 빈 결과 처리', async ({ page }) => {
      await page.goto('/search/active-officials?name=zzzznotexist12345');
      // 결과 없음 상태 처리 — 에러가 아닌 빈 상태 UI 노출
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
      await expect(page.getByText(/404|찾을 수 없/i)).not.toBeVisible();
    });
  });

  test.describe('세무사 검색 (공개 접근)', () => {

    test('FN-SEARCH-004: 세무사 법인명 검색', async ({ page }) => {
      await page.goto('/search/tax-experts?firmName=가온세무법인');
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
      // 박성호는 가온세무법인 소속 확인된 세무사
      await expect(page.getByText('박성호').first()).toBeVisible();
    });

    test('FN-SEARCH-005: 세무사 지역 검색 — 광주', async ({ page }) => {
      await page.goto('/search/tax-experts?officeRegion=REGION_29');
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
      await expect(page.getByText('박성호').first()).toBeVisible();
    });

    test('FN-SEARCH-006: 세무사 전문 영역 필터 — 상속·증여·승계', async ({ page }) => {
      await page.goto('/search/tax-experts?officeRegion=REGION_29');
      await expect(page.getByText('박성호').first()).toBeVisible();
      // 전문 영역 필터 버튼 클릭
      await page.getByRole('button', { name: /상속.*증여|상속·증여/ }).first().click();
      // 박성호는 상속·증여 전문 → 필터 후에도 노출
      await expect(page.getByText('박성호').first()).toBeVisible();
    });

  });

});
