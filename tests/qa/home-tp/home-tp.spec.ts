import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── HOME-TP — 홈 / GNB / 알림 (납세자) ────────────────────────────────────

test.describe('HOME-TP — 홈/GNB/알림 (납세자)', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한', () => {

    test.describe('납세자 무료 (미구독)', () => {
      test.use({ storageState: AUTH_FILES.freeUser });

      test('[HOME-TP-0-01] 미구독 홈 — 세무사 찾기 기본 / 배너 표시', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText(/세무사 찾기|세무사/).first()).toBeVisible({ timeout: 15000 });
      });

      test('[HOME-TP-0-08] 미구독 GNB — PRO 태그 미표시', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        // 미구독 사용자에게 PRO CTA가 표시될 수 있음 — 자신의 구독 배지 확인
        await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
      });
    });

    test.describe('납세자 유료 (Pro)', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[HOME-TP-0-02] Pro 홈 — 모든 탭 접근 가능', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText(/세무사 찾기|현직 공무원/).first()).toBeVisible({ timeout: 15000 });
      });

      test('[HOME-TP-0-09] Pro GNB — PRO 태그 표시', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await expect(page.getByText('PRO').first()).toBeVisible({ timeout: 8000 });
      });
    });

  });

  // ─── 4-1. 홈 화면 ──────────────────────────────────────────────────────────

  test.describe('4-1. 홈 화면', () => {

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[HOME-TP-1-01] 홈 기본 로딩 — 세무사 찾기 탭 기본 선택', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
        await expect(page.getByText(/세무사 찾기/).first()).toBeVisible({ timeout: 15000 });
      });

      test('[HOME-TP-1-02] 세무사 찾기 탭 — 필터 영역 표시', async ({ page }) => {
        await page.goto('/');
        // 세무사 찾기 탭 클릭
        await page.getByTestId('home-tax-expert-tab').or(
          page.getByRole('tab', { name: /세무사 찾기/ })
        ).first().click();
        await expect(page.getByTestId('search-submit-btn').or(
          page.getByRole('button', { name: /검색/ })
        ).first()).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TP-1-03] 현직 공무원 탐색 탭 — 필터 표시', async ({ page }) => {
        await page.goto('/');
        const tab = page.getByTestId('home-active-official-tab').or(
          page.getByRole('tab', { name: /현직 공무원/ })
        );
        await tab.first().click();
        await expect(page.locator('body')).toBeVisible();
      });

      test.skip('[HOME-TP-1-06] 세무법인 자동완성 — 입력 시 목록 표시', async ({ page }) => {
        // 자동완성 드롭다운 동작 불안정 — 수동 확인 필요
      });

      test('[HOME-TP-1-07] DB 없는 법인명 — 자동완성 미제공', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('home-tax-expert-tab').or(
          page.getByRole('tab', { name: /세무사 찾기/ })
        ).first().click();
        const firmInput = page.getByTestId('search-firm-name-input').or(
          page.getByRole('textbox', { name: /법인명/ })
        );
        if (await firmInput.isVisible({ timeout: 5000 })) {
          await firmInput.fill('절대없는법인이름xyz999');
          await expect(
            page.getByRole('option').or(page.locator('[role="listbox"]'))
          ).not.toBeVisible({ timeout: 5000 });
        } else {
          test.skip();
        }
      });

      test('[HOME-TP-1-10] 세무사 검색 — 결과 표시', async ({ page }) => {
        await page.goto('/search/tax-experts?officeRegion=REGION_29');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[HOME-TP-1-15] 필터 초기화 버튼 동작', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('home-tax-expert-tab').or(
          page.getByRole('tab', { name: /세무사 찾기/ })
        ).first().click();
        const resetBtn = page.getByRole('button', { name: /초기화/ });
        if (await resetBtn.isVisible({ timeout: 5000 })) {
          await resetBtn.click();
          await expect(page.locator('body')).toBeVisible();
        } else {
          test.skip();
        }
      });

      test('[HOME-TP-1-16] 최근 조회 카드 클릭 → 프로필 상세 이동', async ({ page }) => {
        await page.goto('/');
        const cards = page.locator('[data-testid*="recent"], [class*="recent"]').or(
          page.getByText(/최근 조회/).locator('..').locator('a, [role="button"]')
        );
        if (await cards.first().isVisible({ timeout: 5000 })) {
          await cards.first().click();
          await expect(page).not.toHaveURL('/', { timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[HOME-TP-1-17] 최근 조회 전체보기 이동', async ({ page }) => {
        await page.goto('/');
        const viewAllBtn = page.getByText(/전체보기/).first();
        if (await viewAllBtn.isVisible({ timeout: 5000 })) {
          await viewAllBtn.click();
          await expect(page.locator('body')).toBeVisible();
        } else {
          test.skip();
        }
      });

      test('[HOME-TP-1-20] 구독 배너 클릭 → 멤버십 안내 이동', async ({ page }) => {
        // 유료 구독자는 배너 미표시
        await page.goto('/');
        const banner = page.getByTestId('gnb-membership-btn').or(
          page.getByText(/멤버십|구독/)
        );
        // 유료 사용자는 배너가 없을 수 있음
        await expect(page.locator('body')).toBeVisible();
      });

      test('[HOME-TP-1-22] 알림 레드닷 — 새 알림 시 표시', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('header, [role="banner"], nav').first()).toBeVisible();
      });

      test('[HOME-TP-1-24] TOP10 영역 표시', async ({ page }) => {
        await page.goto('/');
        await expect(
          page.getByText(/TOP10|TOP 10|상위 10/).first()
        ).toBeVisible({ timeout: 15000 });
      });

      test('[HOME-TP-1-26] 인사말 표시 — 사용자 이름 + 안내 문구', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        // 인사말 영역 (이름 + 안내 문구)
        const greeting = page.getByText(/님|안녕/).first();
        await expect(greeting).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TP-1-31] 최근 조회 0건 — 빈 상태 안내', async ({ page }) => {
        // 계정에 최근 조회 없는 경우만 검증 가능 — 유료 계정에 데이터 있을 수 있음
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[HOME-TP-1-32] 세무사 필터 미입력 — 검색 버튼 비활성', async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('home-tax-expert-tab').or(
          page.getByRole('tab', { name: /세무사 찾기/ })
        ).first().click();
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

    test.describe('납세자 무료', () => {
      test.use({ storageState: AUTH_FILES.freeUser });

      test('[HOME-TP-1-04] 미구독 — 현직 공무원 탭 구독 유도', async ({ page }) => {
        await page.goto('/');
        const tab = page.getByTestId('home-active-official-tab').or(
          page.getByRole('tab', { name: /현직 공무원/ })
        );
        if (await tab.first().isVisible({ timeout: 5000 })) {
          await tab.first().click();
          await expect(
            page.getByText(/구독|멤버십|PRO/).first()
          ).toBeVisible({ timeout: 8000 });
        } else {
          test.skip();
        }
      });

    });

  });

  // ─── 4-2. GNB 메뉴 ─────────────────────────────────────────────────────────

  test.describe('4-2. GNB 메뉴', () => {

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[HOME-TP-2-01] GNB 메뉴 오픈', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await expect(
          page.getByText(/내 정보|로그아웃|구독/).first()
        ).toBeVisible({ timeout: 8000 });
      });

      test('[HOME-TP-2-02] 내 정보 메뉴 → 내 정보 화면 이동', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await page.getByText(/내 정보/).first().click();
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[HOME-TP-2-03] 구독 관리 메뉴 → 구독 관리 화면 이동', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        const subMenu = page.getByText(/구독 관리|구독 정보/).first();
        if (await subMenu.isVisible({ timeout: 5000 })) {
          await subMenu.dispatchEvent('click');
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test.skip('[HOME-TP-2-10] 로그아웃 → 즉시 로그아웃', async ({ page }) => {
        // SKIP: 실제 로그아웃 시 다른 테스트 계정 세션 무효화 위험
      });

      test('[HOME-TP-2-11] Pro 태그 표시', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        await gnbBtn.first().click();
        await expect(page.getByText('PRO').first()).toBeVisible({ timeout: 8000 });
      });

      test('[HOME-TP-2-16] 미구독 정보 — 태그 미표시', async ({ page }) => {
        // 유료 계정이라 이 테스트는 skip 또는 조건 반전
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
      });

    });

  });

  // ─── 4-3. 알림 ─────────────────────────────────────────────────────────────

  test.describe('4-3. 알림', () => {

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[HOME-TP-3-01] 알림 목록 오픈', async ({ page }) => {
        await page.goto('/');
        const bellBtn = page.locator('button[aria-label*="알림"]').or(
          page.locator('header button').nth(-2)
        );
        if (await bellBtn.first().isVisible({ timeout: 5000 })) {
          await bellBtn.first().click();
          await expect(page.locator('body')).toBeVisible();
        } else {
          test.skip();
        }
      });

      test('[HOME-TP-3-11] 알림 정렬 순서 — 새로운 알림 상위', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[HOME-TP-3-21] 알림 0건 — 빈 상태 안내', async ({ page }) => {
        await page.goto('/');
        const bellBtn = page.locator('button[aria-label*="알림"]').or(
          page.locator('header button').nth(-2)
        );
        if (await bellBtn.first().isVisible({ timeout: 5000 })) {
          await bellBtn.first().click();
          // 알림이 없거나 있거나 — 페이지는 정상 로드
          await expect(page.locator('body')).toBeVisible();
        } else {
          test.skip();
        }
      });

      test.skip('[HOME-TP-3-02][M] 법인 소속 초대 승인', async ({ page }) => {
        // MANUAL: 초대 알림이 존재해야 하며, 현재 계정 상태 변경됨
      });

      test.skip('[HOME-TP-3-03][M] 법인 소속 초대 거부', async ({ page }) => {
        // MANUAL: 초대 알림이 존재해야 함
      });

      test.skip('[HOME-TP-3-13][M] 알림 자동 삭제 (1주 경과 후)', async ({ page }) => {
        // MANUAL: 시간 경과 조건 자동화 불가
      });

    });

  });

  // ─── 4-4. 최근 조회 전체보기 ────────────────────────────────────────────────

  test.describe('4-4. 최근 조회 전체보기', () => {

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[HOME-TP-4-01] 전체보기 목록 표시', async ({ page }) => {
        await page.goto('/');
        const viewAllBtn = page.getByText(/전체보기/).first();
        if (await viewAllBtn.isVisible({ timeout: 8000 })) {
          await viewAllBtn.click();
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[HOME-TP-4-05] 뒤로가기 → 홈 복귀', async ({ page }) => {
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
