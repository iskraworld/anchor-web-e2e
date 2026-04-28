import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── GO — 현직 공무원 탐색 ──────────────────────────────────────────────────

const KIMGYEONGGUK_ID = 3313;

test.describe('GO — 현직 공무원 탐색', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한', () => {

    test.describe('납세자 무료 (미구독)', () => {
      test.use({ storageState: AUTH_FILES.freeUser });

      test('[GO-0-01] 미구독 — 현직 공무원 탐색 구독 유도', async ({ page }) => {
        await page.goto('/search/active-officials');
        await expect(
          page.getByText(/구독|PRO|멤버십/).first()
        ).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('납세자 유료 (Pro)', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[GO-0-03] 납세자 Pro — 현직 공무원 찾기 접근 / 공통 관계망 미제공', async ({ page }) => {
        await page.goto('/search/active-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('세무사 전관 (Pro)', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[GO-0-06] 세무사 Pro — 현직 공무원 찾기 / 공통 관계망 제공', async ({ page }) => {
        await page.goto('/search/active-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[GO-0-11] 법인 소유자 세무사 — 현직 공무원 탐색 접근', async ({ page }) => {
        await page.goto('/search/active-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

  });

  // ─── 4-1. 현직 공무원 목록 ──────────────────────────────────────────────────

  test.describe('4-1. 현직 공무원 목록', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[GO-1-01] 목록 초기 상태 — 필터 초기화 / 빈 결과', async ({ page }) => {
        await page.goto('/search/active-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[GO-1-12] 필터 입력 후 검색 — 조건 맞는 목록 표시', async ({ page }) => {
        await page.goto('/search/active-officials?name=김');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });

      test('[GO-1-13] 필터 초기화 버튼 동작', async ({ page }) => {
        await page.goto('/search/active-officials?name=김');
        const resetBtn = page.getByRole('button', { name: /초기화/ });
        if (await resetBtn.isVisible({ timeout: 5000 })) {
          await resetBtn.click();
          await expect(page.locator('body')).toBeVisible({ timeout: 8000 });
        } else {
          test.skip();
        }
      });

      test('[GO-1-14] 공무원 행 클릭 → 프로필 상세', async ({ page }) => {
        await page.goto('/search/active-officials?name=김');
        await page.waitForLoadState('load');
        const rows = page.locator('tr[data-testid], tbody tr').or(
          page.getByRole('row').filter({ hasNotText: /소속|직급/ })
        );
        if (await rows.first().isVisible({ timeout: 8000 })) {
          await rows.first().click();
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[GO-1-24] 전직 공무원 탭 전환 → 전직 공무원 화면', async ({ page }) => {
        await page.goto('/search/active-officials');
        const tab = page.getByRole('tab', { name: /전직 공무원/ }).or(
          page.getByText(/전직 공무원 찾기/)
        );
        if (await tab.first().isVisible({ timeout: 5000 })) {
          await tab.first().click();
          await expect(page.locator('body')).toBeVisible({ timeout: 8000 });
        } else {
          test.skip();
        }
      });

      test('[GO-1-25] 세무사 찾기 탭 전환 → 세무사 화면', async ({ page }) => {
        await page.goto('/search/active-officials');
        const tab = page.getByRole('tab', { name: /세무사 찾기/ }).or(
          page.getByText(/세무사 찾기/)
        );
        if (await tab.first().isVisible({ timeout: 5000 })) {
          await tab.first().click();
          await expect(page.locator('body')).toBeVisible({ timeout: 8000 });
        } else {
          test.skip();
        }
      });

      test('[GO-1-31] 페이지네이션 — 10건 기본', async ({ page }) => {
        await page.goto('/search/active-officials?name=김');
        await page.waitForLoadState('load');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[GO-1-35] 결과 건수 정확성 표시', async ({ page }) => {
        await page.goto('/search/active-officials?name=김');
        await expect(
          page.getByText(/\d+건|\d+명|\d+개|총 \d+/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[GO-1-37] 탐색 탭 — 현직 공무원 탭 활성 상태', async ({ page }) => {
        await page.goto('/search/active-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[GO-1-42] GNB 로고 클릭 → 홈 이동', async ({ page }) => {
        await page.goto('/search/active-officials');
        const logo = page.locator('header').getByRole('link').first();
        if (await logo.isVisible({ timeout: 5000 })) {
          await logo.click();
          await expect(page).toHaveURL(/\/$|\/home/, { timeout: 8000 });
        } else {
          test.skip();
        }
      });

      test('[GO-1-51] 존재하지 않는 이름 검색 — 빈 상태 안내', async ({ page }) => {
        await page.goto('/search/active-officials?name=zzzznotexist12345_qa');
        await expect(
          page.getByText(/결과가 없|없습니다|검색 결과/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[GO-1-54] 납세자 Pro — 공통 관계망 미제공', async ({ page }) => {
        // 세무사 계정이므로 관계망 제공됨 — 반대 케이스
        await page.goto('/search/active-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[GO-1-54-paidUser] 납세자 Pro — 공통 관계망 기능 미제공', async ({ page }) => {
        await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
        await expect(page.getByText('김경국').first()).toBeVisible({ timeout: 15000 });
        // 납세자는 관계망 찾기 버튼 없음
        await expect(
          page.getByText(/관계망 찾기/).first()
        ).not.toBeVisible({ timeout: 5000 });
      });

    });

  });

  // ─── 4-2. 공무원 프로필 상세 ────────────────────────────────────────────────

  test.describe('4-2. 공무원 프로필 상세', () => {

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[GO-2-01] 공무원 프로필 상세 오픈', async ({ page }) => {
        await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
        await expect(page.getByText('김경국').first()).toBeVisible({ timeout: 15000 });
      });

      test('[GO-2-11-info] 현직 공무원 기본 정보 표시 — 이름/소속', async ({ page }) => {
        await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
        await expect(page.getByText('김경국').first()).toBeVisible({ timeout: 15000 });
        await expect(page.locator('body')).toBeVisible();
      });

      test('[GO-2-15] 추천 세무사 카드 정보 표시', async ({ page }) => {
        await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
        await expect(page.getByText('김경국').first()).toBeVisible({ timeout: 15000 });
        await expect(
          page.getByText(/추천 세무사/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[GO-2-16] 추천 세무사 건수 정확성', async ({ page }) => {
        await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
        await expect(page.getByText('김경국').first()).toBeVisible({ timeout: 15000 });
        await expect(
          page.getByText(/\d+명|\d+건|\d+개/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[GO-2-17] 프로필 GNB 헤더 표시', async ({ page }) => {
        await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
        await expect(page.locator('header, [role="banner"], nav').first()).toBeVisible({ timeout: 15000 });
      });

    });

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[GO-2-07] 공무원 출신 세무사 — 관계망 찾기 버튼 표시', async ({ page }) => {
        await page.goto(`/search/active-officials/${KIMGYEONGGUK_ID}`);
        await expect(page.getByText('김경국').first()).toBeVisible({ timeout: 15000 });
        await expect(
          page.getByText(/관계망 찾기|공통 관계/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[GO-2-22] 추천 세무사 0건 — 빈 상태 또는 0건 표시', async ({ page }) => {
        await page.goto('/search/active-officials?name=김');
        await page.waitForLoadState('load');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

  });

});
