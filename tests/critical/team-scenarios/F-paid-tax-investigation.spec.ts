import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { HomePage } from '../../../shared/pages/HomePage';
import { OfficialProfilePage } from '../../../shared/pages/OfficialProfilePage';

test.use({ storageState: AUTH_FILES.paidUser });

const KIMGYEONGGUK_ID = 3313;
const BAKSUNGHO_UUID = '5032cae5-cb6f-4997-80c8-210f9d02edca';

test.describe('시나리오 F: 세무조사 통지서 기반 세무사 추천 (납세자 유료)', () => {
  test('F-1: 김경국(3313) 조사관 검색', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    // 납세자는 전직 공무원 탭이 없음
    await expect(page.getByTestId('home-retired-official-tab')).not.toBeVisible();
    await home.searchOfficialByName('김경국');
    await expect(page).toHaveURL(/\/search\/active-officials/);
    await expect(page.getByText('김경국').first()).toBeVisible();
    await expect(page.getByText('동대문').first()).toBeVisible();
  });

  test('F-2: 김경국 프로필 — 추천 세무사 섹션 1명 이상', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMGYEONGGUK_ID);
    await expect(page.getByText('김경국')).toBeVisible();
    // 추천 세무사 섹션 (납세자 유료만 노출)
    await expect(page.getByText(/추천 세무사/)).toBeVisible();
    // 박성호가 첫 번째 추천 (2026-04-28 확인)
    await expect(page.getByText('박성호')).toBeVisible();
  });

  test('F-3: 추천 세무사 클릭 → 프로필 이동 + 이름·소속 확인', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMGYEONGGUK_ID);
    // 추천 세무사 섹션에서 첫 번째 세무사 클릭
    const recommendSection = page.locator('section, div').filter({ hasText: /추천 세무사/ }).first();
    await expect(recommendSection).toBeVisible();
    await recommendSection.getByText('박성호').click();
    await expect(page).toHaveURL(new RegExp(BAKSUNGHO_UUID));
    // 이름 확인
    await expect(page.getByText('박성호')).toBeVisible();
    // 소속 기관 정보 존재 (텍스트 확인, 금융분석원 or 가온세무법인)
    await expect(
      page.locator('p, span, div').filter({ hasText: /세무법인|분석원|소속/ }).first()
    ).toBeVisible();
  });
});
