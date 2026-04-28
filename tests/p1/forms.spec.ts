import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';
import { TaxHistoryPage } from '../../shared/pages/TaxHistoryPage';

test.describe('P1 Forms & States: 폼 동작 및 상태 확인', () => {

  test.describe('as taxOfficer', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('FN-FORM-001: 공무원 검색 폼 — 소속 미선택 시 버튼 비활성화', async ({ page }) => {
      await page.goto('/');
      // 현직 공무원 탭 선택
      await page.getByTestId('home-active-official-tab').click();
      // 소속(청/서) 선택 전에는 검색 버튼 비활성화
      await expect(page.getByTestId('search-submit-btn')).toBeDisabled();
    });

    test('FN-STATE-001: 검색 결과 없음 UI — 에러 없이 빈 상태 렌더링', async ({ page }) => {
      await page.goto('/search/active-officials?name=zzzznotexist12345');
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
      await expect(page.getByText(/404/i)).not.toBeVisible();
      // 검색 결과 제목은 노출되어야 함
      await expect(page.getByRole('heading', { name: /현직 공무원 검색 결과/ })).toBeVisible();
    });
  });

  test.describe('as nonOfficer', () => {
    test.use({ storageState: AUTH_FILES.nonOfficer });

    test('FN-FORM-004: 세무이력관리 가이드 모달 닫기', async ({ page }) => {
      const taxHistory = new TaxHistoryPage(page);
      await taxHistory.goto();
      await taxHistory.closeGuideModal();
      // 모달 닫힌 후 메인 콘텐츠 노출 확인
      await expect(taxHistory.getToggle()).toBeVisible();
    });
  });

  test('FN-STATE-003: 비로그인 보호 페이지 접근 → /login 리다이렉트', async ({ page }) => {
    // 세무이력관리는 로그인 필수 페이지
    await page.goto('/tax-history-management/basic-info');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('auth-email-input')).toBeVisible();
  });

});
