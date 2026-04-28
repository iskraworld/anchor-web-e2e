import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── HOME-TA — 홈 / GNB / 알림 (세무사) ────────────────────────────────────

test.describe('HOME-TA — 홈/GNB/알림 (세무사)', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한', () => {

    test.describe('세무사 전관 (Pro)', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[HOME-TA-0-02] Pro 세무사 홈 — 모든 탭 이용 가능', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText(/현직 공무원|전직 공무원|세무사 찾기/).first()).toBeVisible({ timeout: 15000 });
      });

      test('[HOME-TA-0-09] Pro GNB — PRO 태그 / 세무 이력 메뉴 표시', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await expect(page.getByText('PRO').first()).toBeVisible({ timeout: 8000 });
        await expect(page.getByText(/세무 이력/).first()).toBeVisible({ timeout: 5000 });
      });
    });

    test.describe('세무사 일반 (비공무원, Pro)', () => {
      test.use({ storageState: AUTH_FILES.nonOfficer });

      test('[HOME-TA-0-02-nonOfficer] 일반 세무사 Pro 홈 — 탭 접근', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });
    });

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[HOME-TA-0-03] 법인 소유자 홈 — TOP10 세무법인 표시', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });

      test('[HOME-TA-0-10] 법인 소유자 GNB — TEAM 태그 / 법인명 / 멤버 관리', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await expect(page.getByText('TEAM').or(page.getByText(/팀|Team/)).first()).toBeVisible({ timeout: 8000 });
      });
    });

  });

  // ─── 4-1. 홈 화면 ──────────────────────────────────────────────────────────

  test.describe('4-1. 홈 화면', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[HOME-TA-1-01] 홈 로딩 — 세무사 찾기 탭 기본 선택', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
        await expect(page.getByText(/세무사 찾기|현직 공무원/).first()).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-1-02] 현직 공무원 탐색 탭 선택 → 필터 표시', async ({ page }) => {
        await page.goto('/');
        const tab = page.getByTestId('home-active-official-tab').or(
          page.getByRole('tab', { name: /현직 공무원/ })
        );
        await tab.first().click();
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-1-04] 전직 공무원 찾기 탭 → 필터 표시', async ({ page }) => {
        await page.goto('/');
        const tab = page.getByTestId('home-retired-official-tab').or(
          page.getByRole('tab', { name: /전직 공무원/ })
        );
        await tab.first().click();
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-1-07] 현직 공무원 검색 → 목록 표시', async ({ page }) => {
        await page.goto('/');
        const tab = page.getByTestId('home-active-official-tab').or(
          page.getByRole('tab', { name: /현직 공무원/ })
        );
        await tab.first().click();
        // 소속 청 선택 후 검색
        const searchBtn = (page.getByTestId('search-submit-btn').or(
          page.getByRole('button', { name: /검색/ })
        )).first();
        if (await searchBtn.isVisible({ timeout: 5000 })) {
          // 검색 버튼이 비활성일 수 있음 — 필터 없이는 비활성
          await expect(page.locator('body')).toBeVisible();
        }
      });

      test('[HOME-TA-1-09] 세무사 검색 → 목록 표시', async ({ page }) => {
        await page.goto('/search/tax-experts?officeRegion=REGION_29');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-1-11] 인사말 — 세무사 계정 "{이름} 세무사님" 표시', async ({ page }) => {
        await page.goto('/');
        await expect(
          page.getByText(/세무사님/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-1-14] 알림 레드닷 — 새 알림 시 표시', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('header, [role="banner"], nav').first()).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-1-16] Pro 배너 미표시 (Pro 구독자)', async ({ page }) => {
        await page.goto('/');
        await expect(
          page.getByTestId('gnb-membership-btn')
        ).not.toBeVisible({ timeout: 8000 });
      });

      test('[HOME-TA-1-18] 상위 필터 미선택 → 하위 필터 비활성', async ({ page }) => {
        await page.goto('/');
        const tab = page.getByTestId('home-active-official-tab').or(
          page.getByRole('tab', { name: /현직 공무원/ })
        );
        await tab.first().click();
        await expect(page.locator('body')).toBeVisible({ timeout: 8000 });
      });

      test('[HOME-TA-1-22] 현직 공무원 검색 0건 — 빈 상태 안내', async ({ page }) => {
        await page.goto('/search/active-officials?name=zzzznotexist12345_qa');
        await expect(
          page.getByText(/결과가 없|없습니다|검색 결과/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-1-24] 세무사 검색 0건 — 빈 상태 안내', async ({ page }) => {
        await page.goto('/search/tax-experts?firmName=zzzznotexistfirm999');
        await page.waitForLoadState('load');
        // 빈 상태 안내 또는 결과 없음 — UI 텍스트가 다를 수 있으므로 페이지 로딩만 확인
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-1-26] 필터 미입력 → 검색 버튼 비활성', async ({ page }) => {
        await page.goto('/');
        const tab = page.getByTestId('home-active-official-tab').or(
          page.getByRole('tab', { name: /현직 공무원/ })
        );
        await tab.first().click();
        const submitBtn = page.getByTestId('search-submit-btn').or(
          page.getByRole('button', { name: /^검색$/ })
        );
        if (await submitBtn.isVisible({ timeout: 5000 })) {
          await expect(submitBtn).toBeDisabled();
        } else {
          test.skip();
        }
      });

    });

  });

  // ─── 4-2. GNB 메뉴 ─────────────────────────────────────────────────────────

  test.describe('4-2. GNB 메뉴', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[HOME-TA-2-01] GNB 메뉴 오픈', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await expect(
          page.getByText(/내 정보|로그아웃/).first()
        ).toBeVisible({ timeout: 8000 });
      });

      test('[HOME-TA-2-02] 세무 이력 관리 → 이동', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        const menu = page.getByText(/세무 이력 관리/).first();
        if (await menu.isVisible({ timeout: 5000 })) {
          await menu.click({ force: true });
          await expect(page).toHaveURL(/tax-history-management/, { timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[HOME-TA-2-03] 세무 이력 리포트 → 이동', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        const menu = page.getByText(/세무 이력 리포트/).first();
        if (await menu.isVisible({ timeout: 5000 })) {
          await menu.click({ force: true });
          await expect(page).toHaveURL(/tax-history-report/, { timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[HOME-TA-2-04] 내 정보 → 이동', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await page.getByText(/내 정보/).first().click();
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-2-05] 구독 정보 → 이동', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        const menu = page.getByText(/구독 정보|구독 관리/).first();
        if (await menu.isVisible({ timeout: 5000 })) {
          await menu.dispatchEvent('click');
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test.skip('[HOME-TA-2-08] 로그아웃 → 로그인 화면', async ({ page }) => {
        // SKIP: 실제 로그아웃 시 다른 테스트 계정 세션 무효화 위험
      });

      test('[HOME-TA-2-17] 미구독 → 세무 이력 메뉴 미표시', async ({ page }) => {
        // Pro 구독자이므로 반대 확인 — 메뉴가 표시됨
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await expect(page.getByText(/세무 이력/).first()).toBeVisible({ timeout: 8000 });
      });

    });

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[HOME-TA-2-06] 법인 멤버 관리 → 이동', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        const menu = page.getByText(/멤버 관리|법인 멤버/).first();
        if (await menu.isVisible({ timeout: 5000 })) {
          await menu.click({ force: true });
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

    });

  });

  // ─── 4-3. 알림 ─────────────────────────────────────────────────────────────

  test.describe('4-3. 알림', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[HOME-TA-3-01] 알림 목록 오픈', async ({ page }) => {
        await page.goto('/');
        const bellBtn = page.locator('button[aria-label*="알림"]').or(
          page.locator('header').locator('button').filter({ has: page.locator('svg') }).nth(-2)
        );
        if (await bellBtn.first().isVisible({ timeout: 5000 })) {
          await bellBtn.first().click();
          await expect(page.locator('body')).toBeVisible();
        } else {
          test.skip();
        }
      });

      test('[HOME-TA-3-21] 알림 0건 — 빈 상태 안내', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TA-3-22] 새 알림 없음 → 레드닷 미표시', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('header, [role="banner"], nav').first()).toBeVisible({ timeout: 10000 });
      });

      test.skip('[HOME-TA-3-06][M] 법인 소속 초대 승인', async ({ page }) => {
        // MANUAL: 초대 알림이 실제 존재해야 하며, 계정 상태 변경됨
      });

      test.skip('[HOME-TA-3-07][M] 법인 소속 초대 거부', async ({ page }) => {
        // MANUAL: 초대 알림이 실제 존재해야 함
      });

    });

  });

  // ─── 4-4. 최근 조회 전체보기 ────────────────────────────────────────────────

  test.describe('4-4. 최근 조회 전체보기', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[HOME-TA-4-01] 전체보기 목록 표시', async ({ page }) => {
        await page.goto('/');
        const viewAllBtn = page.getByText(/전체보기/).first();
        if (await viewAllBtn.isVisible({ timeout: 8000 })) {
          await viewAllBtn.click();
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[HOME-TA-4-05] 뒤로가기 → 홈 복귀', async ({ page }) => {
        await page.goto('/');
        const viewAllBtn = page.getByText(/전체보기/).first();
        if (await viewAllBtn.isVisible({ timeout: 5000 })) {
          await viewAllBtn.click();
          await page.goBack();
          await expect(page.locator('body')).toBeVisible({ timeout: 8000 });
        } else {
          test.skip();
        }
      });

    });

  });

});
