import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { HomePage } from '../../../shared/pages/HomePage';
import { OfficialProfilePage } from '../../../shared/pages/OfficialProfilePage';

test.use({ storageState: AUTH_FILES.nonOfficer });

const KIMGYEONGGUK_ID = 3313;

test.describe('시나리오 B: 회사 전체 기준 공통 인맥 탐색 (일반 세무사)', () => {
  test('B-1: 김경국(3313) 조사관 검색', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.searchOfficialByName('김경국');
    await expect(page).toHaveURL(/\/search\/active-officials/);
    await expect(page.getByText('김경국').first()).toBeVisible();
    await expect(page.getByText('동대문').first()).toBeVisible();
  });

  test('B-2: 김경국 프로필 — 공통 관계망 섹션 UI 확인', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMGYEONGGUK_ID);
    await expect(page.getByText('김경국').first()).toBeVisible();
    const section = await profile.getNetworkSection();
    await expect(section).toBeVisible();
    await expect(page.getByRole('button', { name: /관계망 찾기/ })).toBeVisible();
  });

  test('B-3: 회사 전체 기준 관계망 조회 → 그래프 렌더링', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMGYEONGGUK_ID);
    // 일반 세무사는 법인 전체 필터 선택 후 조회
    await profile.clickFirmMemberFilter();
    await profile.clickFindNetworkButton();
    await profile.waitForGraphRender();
  });
});
