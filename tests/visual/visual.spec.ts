import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

const KIMJEONGHEE_ID = 5707;
const BAKSUNGHO_UUID = '5032cae5-cb6f-4997-80c8-210f9d02edca';

test.describe('Visual Regression', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('VR-001: 홈 비로그인', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('home-logged-out.png', { maxDiffPixelRatio: 0.05 });
  });

  test.describe('as taxOfficer (전관 세무사)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('VR-002: 홈 전관 세무사', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveScreenshot('home-tax-official.png', { maxDiffPixelRatio: 0.05 });
    });

    test('VR-004: 현직 공무원 검색 결과', async ({ page }) => {
      await page.goto('/search/active-officials?name=김정희');
      await expect(page.getByText('김정희').first()).toBeVisible();
      await expect(page).toHaveScreenshot('search-official-result.png', { maxDiffPixelRatio: 0.05 });
    });

    test('VR-005: 현직 공무원 프로필 세무사 뷰', async ({ page }) => {
      await page.goto(`/search/active-officials/${KIMJEONGHEE_ID}`);
      await expect(page.getByText('김정희').first()).toBeVisible();
      await expect(page).toHaveScreenshot('official-profile-tax.png', { maxDiffPixelRatio: 0.05 });
    });
  });

  test.describe('as freeUser (납세자 무료)', () => {
    test.use({ storageState: AUTH_FILES.freeUser });

    test('VR-003: 홈 납세자 무료', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveScreenshot('home-taxpayer-free.png', { maxDiffPixelRatio: 0.05 });
    });
  });

  test.describe('as paidUser (납세자 유료)', () => {
    test.use({ storageState: AUTH_FILES.paidUser });

    test('VR-006: 현직 공무원 프로필 납세자 뷰', async ({ page }) => {
      await page.goto(`/search/active-officials/${KIMJEONGHEE_ID}`);
      await expect(page.getByText('김정희').first()).toBeVisible();
      await expect(page).toHaveScreenshot('official-profile-taxpayer.png', { maxDiffPixelRatio: 0.05 });
    });
  });

  test('VR-007: 세무사 검색 결과 — 가온세무법인', async ({ page }) => {
    await page.goto('/search/tax-experts?firmName=가온세무법인');
    await expect(page.getByText('박성호').first()).toBeVisible();
    await expect(page).toHaveScreenshot('search-tax-expert-gaon.png', { maxDiffPixelRatio: 0.05 });
  });

  test('VR-008: 세무사 프로필 상세 — 박성호', async ({ page }) => {
    await page.goto(`/search/tax-experts/${BAKSUNGHO_UUID}`);
    await expect(page.getByText('박성호').first()).toBeVisible();
    await expect(page).toHaveScreenshot('tax-expert-profile-baksungho.png', { maxDiffPixelRatio: 0.05 });
  });

  test.describe('as nonOfficer (한지희)', () => {
    test.use({ storageState: AUTH_FILES.nonOfficer });

    test('VR-009: 세무이력관리', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      const modal = page.getByTestId('tax-history-guide-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.getByTestId('tax-history-modal-close-btn').click();
        await expect(modal).not.toBeVisible();
      }
      await expect(page).toHaveScreenshot('tax-history-management.png', { maxDiffPixelRatio: 0.05 });
    });
  });

  test.describe('as firmOwner', () => {
    test.use({ storageState: AUTH_FILES.firmOwner });

    test('VR-010: 세무이력 리포트 법인 탭', async ({ page }) => {
      await page.goto('/tax-history-report/me?tab=corporate');
      await expect(page.getByText(/상속|증여|세무조사|조세불복/i).first()).toBeVisible({ timeout: 10000 });
      await expect(page).toHaveScreenshot('tax-history-report-corporate.png', { maxDiffPixelRatio: 0.05 });
    });
  });
});
