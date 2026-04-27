import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { HomePage } from '../../../shared/pages/HomePage';

test.use({ storageState: AUTH_FILES.freeUser });

const BAKSUNGHO_UUID = '5032cae5-cb6f-4997-80c8-210f9d02edca';

test.describe('시나리오 G: 지역·전문 이력 기반 세무사 검색 (납세자 무료)', () => {
  test('G-1: 광주 지역 세무사 검색 → 박성호 포함', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.searchTaxExpertByRegion('광주');
    await expect(page).toHaveURL(/REGION_29|officeRegion/);
    await expect(page.getByText('박성호')).toBeVisible();
  });

  test('G-2: 상속·증여·승계 필터 → 결과 1명 이상', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.searchTaxExpertByRegion('광주');
    // 필터 클릭 (클라이언트 사이드)
    await page.getByRole('button', { name: /상속.*증여|상속·증여/ }).first().click();
    // 박성호가 상속·증여·승계 이력 보유
    await expect(page.getByText('박성호')).toBeVisible();
  });

  test('G-3: 박성호 세무사 프로필 — 전문 영역 태그 확인', async ({ page }) => {
    await page.goto(`/search/tax-experts/${BAKSUNGHO_UUID}`);
    await expect(page.getByText('박성호')).toBeVisible();
    await expect(page.getByText(/상속.*증여|상속·증여·승계/).first()).toBeVisible();
  });
});
