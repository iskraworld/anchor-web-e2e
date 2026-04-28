import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

const KIMGYEONGGUK_ID = 3313;

test.describe('P1 Permissions: 역할별 접근 권한 확인', () => {

  test.describe('as freeUser (납세자 무료)', () => {
    test.use({ storageState: AUTH_FILES.freeUser });

    test('FN-PERM-001: 전직 공무원 탭 납세자 미노출', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-retired-official-tab')).not.toBeVisible();
    });

    test('FN-PERM-004: 납세자 세무이력관리 접근 → 403 에러 노출', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      // 앱이 리다이렉트 없이 인라인 403 화면을 보여줌
      await expect(page.getByText('접근 권한이 없습니다')).toBeVisible();
    });

    test('FN-PERM-007: 멤버십 안내 버튼 무료 납세자 노출', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('gnb-membership-btn')).toBeVisible();
    });
  });

  test.describe('as taxOfficer (전관 세무사)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('FN-PERM-003: 전직 공무원 탭 세무사 노출', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('home-retired-official-tab')).toBeVisible();
    });

    test('FN-PERM-006: 추천 세무사 섹션 세무사 미노출', async ({ page }) => {
      await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
      await expect(page.getByText('김경국').first()).toBeVisible();
      // 세무사 계정은 추천 세무사 섹션이 보이지 않음 — 공통 관계망 섹션만 존재
      await expect(page.getByText(/추천 세무사/)).not.toBeVisible();
    });
  });

  test.describe('as paidUser (납세자 유료)', () => {
    test.use({ storageState: AUTH_FILES.paidUser });

    test('FN-PERM-005: 추천 세무사 섹션 납세자 유료 노출', async ({ page }) => {
      await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
      await expect(page.getByText('김경국').first()).toBeVisible();
      await expect(page.getByText(/추천 세무사/)).toBeVisible();
    });

    test('FN-PERM-008: 멤버십 안내 버튼 유료 납세자 미노출', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('gnb-membership-btn')).not.toBeVisible();
    });
  });

});
