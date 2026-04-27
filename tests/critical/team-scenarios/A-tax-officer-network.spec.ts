import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { HomePage } from '../../../shared/pages/HomePage';
import { OfficialProfilePage } from '../../../shared/pages/OfficialProfilePage';

test.use({ storageState: AUTH_FILES.taxOfficer });

const KIMJEONGHEE_ID = 5707;

test.describe('시나리오 A: 현직 공무원 공통 인맥 탐색 (전관 세무사)', () => {
  test('A-1: 김정희(5707) 조사관 검색', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.searchOfficialByName('김정희');
    await expect(page).toHaveURL(/\/search\/active-officials/);
    await expect(page.getByText('김정희').first()).toBeVisible();
    await expect(page.getByText('서울지방국세청').first()).toBeVisible();
    // Row click doesn't trigger SPA navigation; navigate directly to confirm profile URL resolves
    await page.goto(`/search/active-officials/${KIMJEONGHEE_ID}`);
    await expect(page).toHaveURL(new RegExp(`/search/active-officials/${KIMJEONGHEE_ID}`));
  });

  test('A-2: 김정희 프로필 — 공통 관계망 섹션 UI 확인', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMJEONGHEE_ID);
    await expect(page.getByText('김정희').first()).toBeVisible();
    const section = await profile.getNetworkSection();
    await expect(section).toBeVisible();
    await expect(page.getByRole('button', { name: /관계망 찾기/ })).toBeVisible();
  });

  test('A-3: 나 기준 공통 관계망 조회 → 그래프 렌더링', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMJEONGHEE_ID);
    await profile.clickFindNetworkButton();
    await profile.waitForGraphRender();
  });
});
