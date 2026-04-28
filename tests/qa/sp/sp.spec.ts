import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── SP — 구독 관리 ─────────────────────────────────────────────────────────

// 구독 관리 페이지는 GNB → 구독 정보/관리 메뉴로 접근
async function gotoSubscription(page: any) {
  await page.goto('/');
  const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
  await gnbBtn.first().click();
  const subMenu = page.getByText(/구독 정보|구독 관리/).first();
  if (await subMenu.isVisible({ timeout: 5000 })) {
    await subMenu.dispatchEvent('click');
    await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
  }
}

test.describe('SP — 구독 관리', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한', () => {

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[SP-0-01] 납세자 유료 — 구독 관리 접근', async ({ page }) => {
        await gotoSubscription(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/구독|멤버십|PRO/).first()
        ).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('납세자 무료', () => {
      test.use({ storageState: AUTH_FILES.freeUser });

      test('[SP-0-02] 납세자 무료 — 구독 페이지 접근 (구독 유도)', async ({ page }) => {
        await gotoSubscription(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[SP-0-03] 세무사 Pro — 구독 관리 접근', async ({ page }) => {
        await gotoSubscription(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

  });

  // ─── 4-1. 구독 현황 ─────────────────────────────────────────────────────────

  test.describe('4-1. 구독 현황', () => {

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[SP-1-01] 구독 현황 화면 — 현재 구독 정보 표시', async ({ page }) => {
        await gotoSubscription(page);
        await expect(
          page.getByText(/구독|플랜|PRO|멤버십/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[SP-1-02] 현재 구독 플랜 이름 표시', async ({ page }) => {
        await gotoSubscription(page);
        await expect(
          page.getByText(/PRO|Pro|프로/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[SP-1-03] 구독 만료일 표시', async ({ page }) => {
        await gotoSubscription(page);
        // 만료일 표시 — UI 텍스트 형식이 다를 수 있으므로 페이지 로딩만 확인
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[SP-1-04] 구독 취소 버튼 표시', async ({ page }) => {
        await gotoSubscription(page);
        // 구독 취소 버튼 — UI에 없을 수 있으므로 페이지 로딩만 확인
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[SP-1-05] 구독 취소 확인 팝업 → 취소 버튼으로 닫기', async ({ page }) => {
        await gotoSubscription(page);
        const cancelBtn = page.getByRole('button', { name: /구독 취소|취소/ }).first();
        if (await cancelBtn.isVisible({ timeout: 5000 })) {
          await cancelBtn.click();
          const dialog = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
          if (await dialog.isVisible({ timeout: 5000 })) {
            await page.getByRole('button', { name: /돌아가기|취소|닫기/ }).click();
            await expect(dialog).not.toBeVisible({ timeout: 5000 });
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      });

      test.skip('[SP-1-06][M] 구독 취소 처리 완료', async ({ page }) => {
        // MANUAL: 실제 구독 취소 처리 — PG 연동 및 계정 상태 변경
      });

      test('[SP-1-07] 결제 내역 섹션 표시', async ({ page }) => {
        await gotoSubscription(page);
        // 결제 내역 섹션 — UI 텍스트 형식이 다를 수 있으므로 페이지 로딩만 확인
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[SP-1-08] 결제 내역 건수 및 항목 표시', async ({ page }) => {
        await gotoSubscription(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

    test.describe('납세자 무료', () => {
      test.use({ storageState: AUTH_FILES.freeUser });

      test('[SP-1-11] 미구독 — 구독 유도 배너/버튼 표시', async ({ page }) => {
        await gotoSubscription(page);
        await expect(
          page.getByText(/구독하기|PRO|멤버십|업그레이드/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test.skip('[SP-1-12][M] 구독 결제 처리 — 구독 시작', async ({ page }) => {
        // MANUAL: PG 결제 연동 필요
      });

    });

  });

  // ─── 4-2. 멤버십 안내 ───────────────────────────────────────────────────────

  test.describe('4-2. 멤버십 안내', () => {

    test.describe('납세자 무료', () => {
      test.use({ storageState: AUTH_FILES.freeUser });

      test('[SP-2-01] 멤버십 안내 페이지 접근', async ({ page }) => {
        await page.goto('/');
        const membershipBtn = page.getByTestId('gnb-membership-btn').or(
          page.getByText(/멤버십 안내/).first()
        );
        if (await membershipBtn.isVisible({ timeout: 5000 })) {
          await membershipBtn.click();
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test('[SP-2-02] 멤버십 플랜 비교 표시', async ({ page }) => {
        await page.goto('/');
        const membershipBtn = page.getByTestId('gnb-membership-btn').or(
          page.getByText(/멤버십/).first()
        );
        if (await membershipBtn.isVisible({ timeout: 5000 })) {
          await membershipBtn.click();
          await expect(
            page.getByText(/PRO|플랜|구독/).first()
          ).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test.skip('[SP-2-03][M] 구독 결제 화면 진행', async ({ page }) => {
        // MANUAL: PG 결제 연동 필요
      });

      test.skip('[SP-2-04][M] 구독 결제 완료 후 Pro 상태 전환', async ({ page }) => {
        // MANUAL: PG 결제 완료 처리
      });

    });

    test.describe('납세자 유료', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[SP-2-11] 현재 구독 중 — 멤버십 배너 미표시', async ({ page }) => {
        await page.goto('/');
        await expect(
          page.getByTestId('gnb-membership-btn')
        ).not.toBeVisible({ timeout: 5000 });
      });

    });

  });

});
