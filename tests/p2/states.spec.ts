import { test, expect } from '@playwright/test';

test.describe('P2 States: 에러·엣지 케이스 UI', () => {
  test('FN-STATE-002: 존재하지 않는 경로 접근 → 404 UI 노출', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz-404');
    const body = await page.locator('body').textContent();
    const has404 = /404|찾을 수 없|페이지.*없|not found/i.test(body ?? '');
    const isRedirectedToLogin = page.url().includes('/login');
    expect(has404 || isRedirectedToLogin).toBeTruthy();
  });

  test('FN-STATE-004: 비로그인 현직 공무원 프로필 접근 → /login 리다이렉트', async ({ page }) => {
    await page.goto('/search/active-officials/5707');
    await expect(page).toHaveURL(/login/);
  });
});
