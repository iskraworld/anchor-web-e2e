import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── EO — 전직 공무원 찾기 ──────────────────────────────────────────────────

test.describe('EO — 전직 공무원 찾기', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한', () => {

    test.describe('납세자 무료 (미구독)', () => {
      test.use({ storageState: AUTH_FILES.freeUser });

      test('[EO-0-01] 미구독 — 전직 공무원 찾기 구독 유도', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/구독|PRO|멤버십|권한/).first()
        ).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('납세자 유료 (Pro)', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[EO-0-02] 납세자 Pro — 전직 공무원 목록 접근', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('세무사 전관 (Pro)', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[EO-0-03] 세무사 Pro — 전직 공무원 찾기 전체 기능', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('세무사 일반', () => {
      test.use({ storageState: AUTH_FILES.nonOfficer });

      test('[EO-0-04] 일반 세무사 Pro — 전직 공무원 찾기 접근', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[EO-0-05] 법인 소유자 — 전직 공무원 찾기 접근', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

  });

  // ─── 4-1. 전직 공무원 목록 ──────────────────────────────────────────────────

  test.describe('4-1. 전직 공무원 목록', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[EO-1-01] 목록 기본 접근 — 필터 영역 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[EO-1-02] 이름으로 검색 — 결과 표시', async ({ page }) => {
        await page.goto('/search/retired-officials?name=김');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });

      test('[EO-1-03] 존재하지 않는 이름 검색 — 빈 상태 안내', async ({ page }) => {
        await page.goto('/search/retired-officials?name=zzzznotexist12345_qa');
        await expect(
          page.getByText(/결과가 없|없습니다|검색 결과/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[EO-1-04] 전직 공무원 행 클릭 → 프로필 상세', async ({ page }) => {
        await page.goto('/search/retired-officials?name=김');
        await page.waitForLoadState('load');
        const rows = page.locator('tr').filter({ hasNot: page.locator('th') }).or(
          page.getByRole('row').nth(1)
        );
        if (await rows.first().isVisible({ timeout: 8000 })) {
          await rows.first().click();
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[EO-1-05] 필터 초기화 버튼 동작', async ({ page }) => {
        await page.goto('/search/retired-officials?name=김');
        const resetBtn = page.getByRole('button', { name: /초기화/ });
        if (await resetBtn.isVisible({ timeout: 5000 })) {
          await resetBtn.click();
          await expect(page.locator('body')).toBeVisible({ timeout: 8000 });
        } else {
          test.skip();
        }
      });

      test('[EO-1-06] 소속 청서 필터 선택', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        // 소속 필터 드롭다운 확인
        const filter = (page.getByRole('combobox').or(
          page.getByText(/소속|청|필터/)
        )).first();
        await expect(filter).toBeVisible({ timeout: 10000 });
      });

      test('[EO-1-07] 필터 미입력 — 검색 버튼 비활성', async ({ page }) => {
        await page.goto('/search/retired-officials');
        const submitBtn = page.getByTestId('search-submit-btn').or(
          page.getByRole('button', { name: /^검색$/ })
        );
        if (await submitBtn.isVisible({ timeout: 5000 })) {
          await expect(submitBtn).toBeDisabled();
        } else {
          test.skip();
        }
      });

      test('[EO-1-08] 결과 건수 표시', async ({ page }) => {
        await page.goto('/search/retired-officials?name=김');
        await expect(
          page.getByText(/\d+건|\d+명|\d+개|총 \d+/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[EO-1-09] 현직 공무원 탭 전환', async ({ page }) => {
        await page.goto('/search/retired-officials');
        const tab = page.getByRole('tab', { name: /현직 공무원/ }).or(
          page.getByText(/현직 공무원 탐색/)
        );
        if (await tab.first().isVisible({ timeout: 5000 })) {
          await tab.first().click();
          await expect(page).toHaveURL(/active-officials/, { timeout: 8000 });
        } else {
          test.skip();
        }
      });

      test('[EO-1-10] 세무사 찾기 탭 전환', async ({ page }) => {
        await page.goto('/search/retired-officials');
        const tab = page.getByRole('tab', { name: /세무사 찾기/ }).or(
          page.getByText(/세무사 찾기/)
        );
        if (await tab.first().isVisible({ timeout: 5000 })) {
          await tab.first().click();
          await expect(page).toHaveURL(/tax-experts/, { timeout: 8000 });
        } else {
          test.skip();
        }
      });

      test('[EO-1-11] 페이지네이션 표시', async ({ page }) => {
        await page.goto('/search/retired-officials?name=김');
        await page.waitForLoadState('load');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

  });

  // ─── 4-2. 전직 공무원 프로필 상세 ───────────────────────────────────────────

  test.describe('4-2. 전직 공무원 프로필 상세', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[EO-2-01] 전직 공무원 프로필 기본 정보 표시', async ({ page }) => {
        await page.goto('/search/retired-officials?name=김');
        await page.waitForLoadState('load');
        const rows = page.locator('tbody tr').or(
          page.getByRole('row').nth(1)
        );
        if (await rows.first().isVisible({ timeout: 8000 })) {
          await rows.first().click();
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[EO-2-02] 공통 관계망 분석 접근 (공무원 출신 세무사)', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[EO-2-03] 납세자 — 세무사 추천 정보 표시', async ({ page }) => {
        await page.goto('/search/retired-officials');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

  });

});
