import { test, expect } from '@playwright/test';
import { loginAs, fillReactInput } from './helpers/auth';

const EMAIL = process.env.ANCHOR_EMAIL_TAXPAYER_PAID!;
const PASSWORD = process.env.ANCHOR_PASSWORD!;

// Staging-verified data (2026-04-27)
const KIM_KYEONG_GUK_ID = 3313;
const PARK_SUNG_HO_UUID = '5032cae5-cb6f-4997-80c8-210f9d02edca';

test.describe('Scenario F — 납세자 유료: 세무사 추천 조회 (P0)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
  });

  /**
   * F-1: 납세자가 세무조사 담당 공무원 이름으로 검색하면 결과가 표시된다.
   */
  test('F-1: 김경국 조사관 검색', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="home-active-official-tab"]').click();

    await fillReactInput(page, 'search-name-input', '김경국');
    await page.locator('[data-testid="search-submit-btn"]').click();

    await page.waitForURL('**/search/active-officials**');
    await expect(page.getByText('동대문세무서')).toBeVisible();
    await expect(page.getByText('김경국')).toBeVisible();
  });

  /**
   * F-2: 공무원 프로필 페이지에 추천 세무사 섹션이 1명 이상과 함께 노출된다.
   */
  test('F-2: 김경국 프로필 — 추천 세무사 섹션 확인', async ({ page }) => {
    await page.goto(`/search/active-officials/${KIM_KYEONG_GUK_ID}`);

    await expect(page.getByText('김경국')).toBeVisible();

    // Staging confirmed: "추천 세무사 1: 박성호" text is present
    await expect(page.getByText('추천 세무사')).toBeVisible();
    // "추천 세무사 N:" pattern confirms at least 1 recommendation exists
    await expect(page.getByText(/추천 세무사 \d/)).toBeVisible();
  });

  /**
   * F-3: 추천 세무사 링크를 클릭하면 세무사 프로필 페이지로 이동한다.
   * Staging: 1위 추천 = 박성호 (UUID: 5032cae5-cb6f-4997-80c8-210f9d02edca, 가온세무법인)
   */
  test('F-3: 추천 세무사 프로필 접근', async ({ page }) => {
    await page.goto(`/search/active-officials/${KIM_KYEONG_GUK_ID}`);

    await expect(page.getByText(/추천 세무사 \d/)).toBeVisible();

    // Click 박성호 (staging-confirmed #1 recommendation)
    await page.getByText('박성호').first().click();

    await page.waitForURL(`**/search/tax-experts/${PARK_SUNG_HO_UUID}`);
    await expect(page).toHaveURL(new RegExp(PARK_SUNG_HO_UUID));
    await expect(page.getByRole('heading', { name: '박성호' })).toBeVisible();
    await expect(page.getByText('전직공무원')).toBeVisible();
  });

  /**
   * F-Background: 납세자 역할 GNB에는 "전직 공무원 찾기" 탭이 없다.
   */
  test('F-Background: 납세자 GNB 탭 구성 확인', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-testid="home-active-official-tab"]')).toBeVisible();
    await expect(page.locator('[data-testid="home-tax-expert-tab"]')).toBeVisible();
    await expect(page.locator('[data-testid="home-retired-official-tab"]')).not.toBeVisible();
  });
});
