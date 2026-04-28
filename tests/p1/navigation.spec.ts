import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

const KIMGYEONGGUK_ID = 3313;
const BAKSUNGHO_UUID = '5032cae5-cb6f-4997-80c8-210f9d02edca';

test.describe('P1 Navigation: 페이지 로딩 확인', () => {

  test('FN-NAV-001: 홈 페이지 비로그인 접근 — 로그인 페이지로 리다이렉트', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(login)?/);
    await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
  });

  test.describe('as taxOfficer', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('FN-NAV-003: 현직 공무원 프로필 200 OK', async ({ page }) => {
      await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
      await expect(page.getByText(/404|찾을 수 없/i)).not.toBeVisible();
      await expect(page.getByText('김경국').first()).toBeVisible();
    });

    test('FN-NAV-007: 세무이력관리 페이지 200 OK', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await expect(page).toHaveURL(/\/tax-history-management/);
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
    });

    test('FN-NAV-008: 세무이력 리포트 페이지 200 OK (taxOfficer)', async ({ page }) => {
      await page.goto('/tax-history-report/me');
      await expect(page).toHaveURL(/\/tax-history-report/);
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
    });
  });

  test.describe('as freeUser', () => {
    test.use({ storageState: AUTH_FILES.freeUser });

    test('FN-NAV-004: 세무사 프로필 200 OK', async ({ page }) => {
      await page.goto(`/search/tax-experts/${BAKSUNGHO_UUID}`);
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
      await expect(page.getByText('박성호').first()).toBeVisible();
    });
  });

  test.describe('as nonOfficer', () => {
    test.use({ storageState: AUTH_FILES.nonOfficer });

    test('FN-NAV-005: 세무이력관리 200 OK', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await expect(page).toHaveURL(/\/tax-history-management/);
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
    });
  });

  test.describe('as firmOwner', () => {
    test.use({ storageState: AUTH_FILES.firmOwner });

    test('FN-NAV-006: 세무이력 리포트 200 OK', async ({ page }) => {
      await page.goto('/tax-history-report/me');
      await expect(page).toHaveURL(/\/tax-history-report/);
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
      await expect(page.getByText('가온세무법인 프로필 리포트').first()).toBeVisible();
    });
  });

});
