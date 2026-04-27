import { test, expect } from '@playwright/test';
import { LoginPage } from '../../shared/pages/LoginPage';

test.describe('FN-AUTH: 계정 로그인·로그아웃', () => {
  test('FN-AUTH-001: 전관 세무사 로그인 → 3탭 확인', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(
      process.env.ANCHOR_EMAIL_TAX_OFFICIAL!,
      process.env.ANCHOR_PASSWORD!
    );
    await expect(page.getByTestId('home-active-official-tab')).toBeVisible();
    await expect(page.getByTestId('home-retired-official-tab')).toBeVisible();
    await expect(page.getByTestId('home-tax-expert-tab')).toBeVisible();
  });

  test('FN-AUTH-002: 일반 세무사 로그인 → 3탭 확인', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(
      process.env.ANCHOR_EMAIL_TAX_GENERAL!,
      process.env.ANCHOR_PASSWORD!
    );
    await expect(page.getByTestId('home-active-official-tab')).toBeVisible();
    await expect(page.getByTestId('home-retired-official-tab')).toBeVisible();
    await expect(page.getByTestId('home-tax-expert-tab')).toBeVisible();
  });

  test('FN-AUTH-003: 세무법인 소유자 로그인 성공', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(
      process.env.ANCHOR_EMAIL_FIRM_OWNER!,
      process.env.ANCHOR_PASSWORD!
    );
    await expect(page.getByTestId('gnb-profile-btn')).toBeVisible();
  });

  test('FN-AUTH-004: 납세자 유료 로그인 → 2탭 + 멤버십 버튼 없음', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(
      process.env.ANCHOR_EMAIL_TAXPAYER_PAID!,
      process.env.ANCHOR_PASSWORD!
    );
    await expect(page.getByTestId('home-active-official-tab')).toBeVisible();
    await expect(page.getByTestId('home-tax-expert-tab')).toBeVisible();
    await expect(page.getByTestId('home-retired-official-tab')).not.toBeVisible();
    await expect(page.getByTestId('gnb-membership-btn')).not.toBeVisible();
  });

  test('FN-AUTH-005: 납세자 무료 로그인 → 멤버십 안내 버튼 노출', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(
      process.env.ANCHOR_EMAIL_TAXPAYER_FREE!,
      process.env.ANCHOR_PASSWORD!
    );
    await expect(page.getByTestId('home-active-official-tab')).toBeVisible();
    await expect(page.getByTestId('home-tax-expert-tab')).toBeVisible();
    await expect(page.getByTestId('home-retired-official-tab')).not.toBeVisible();
    await expect(page.getByTestId('gnb-membership-btn')).toBeVisible();
  });

  test('FN-AUTH-006: 로그아웃 → /login 리다이렉트', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(
      process.env.ANCHOR_EMAIL_TAX_OFFICIAL!,
      process.env.ANCHOR_PASSWORD!
    );
    await page.getByTestId('gnb-profile-btn').click();
    await page.getByTestId('gnb-logout-btn').click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('auth-email-input')).toBeVisible();
  });
});
