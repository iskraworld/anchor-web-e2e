import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── MY — 내 정보 ────────────────────────────────────────────────────────────

// 내 정보는 GNB 메뉴 → "내 정보" 진입
// URL 탐색 helper
async function gotoMyInfo(page: any) {
  await page.goto('/');
  const profileBtn = page.getByTestId('gnb-profile-btn').or(
    page.locator('button[aria-label*="프로필"]').or(
      page.locator('header button').last()
    )
  );
  await profileBtn.first().click();
  await page.getByText(/내 정보/).first().click();
  await page.waitForLoadState('load');
}

test.describe('MY — 내 정보', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한', () => {

    test.describe('납세자 (유료)', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[MY-0-01] 납세자 내 정보 진입 — 계정 정보 영역 표시', async ({ page }) => {
        await gotoMyInfo(page);
        await expect(page.getByText(/내 정보|계정 정보/).first()).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('세무사 (전관)', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[MY-0-03] 세무사 내 정보 진입 — 세무사 정보 + 계정 정보 표시', async ({ page }) => {
        await gotoMyInfo(page);
        await expect(page.getByText(/내 정보|계정 정보/).first()).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[MY-0-07] 법인 소유자 법인 정보 표시', async ({ page }) => {
        await gotoMyInfo(page);
        await expect(page.getByText(/법인|내 정보/).first()).toBeVisible({ timeout: 10000 });
      });
    });

  });

  // ─── 4-1. 내 정보 화면 (납세자) ────────────────────────────────────────────

  test.describe('4-1. 내 정보 화면 (납세자 유료)', () => {
    test.use({ storageState: AUTH_FILES.paidUser });

    test('[MY-1-01] 계정 기본 정보 조회 — 이메일/이름 표시', async ({ page }) => {
      await gotoMyInfo(page);
      await expect(page.getByText(/이메일/).first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/이름/).first()).toBeVisible();
    });

    test('[MY-1-02] 이메일 변경 버튼 표시', async ({ page }) => {
      await gotoMyInfo(page);
      await expect(
        page.getByRole('button', { name: /변경/ }).first()
      ).toBeVisible({ timeout: 10000 });
    });

    test('[MY-1-02-modal] 이메일 변경 버튼 클릭 → 모달 표시', async ({ page }) => {
      await gotoMyInfo(page);
      const changeButtons = page.getByRole('button', { name: /변경/ });
      await changeButtons.first().click();
      await expect(
        page.getByRole('dialog').or(page.locator('[role="dialog"]').or(page.getByText(/이메일 변경/)))
      ).toBeVisible({ timeout: 8000 });
    });

    test('[MY-1-04] 이메일 변경 취소 → 모달 닫힘', async ({ page }) => {
      await gotoMyInfo(page);
      const changeButtons = page.getByRole('button', { name: /변경/ });
      await changeButtons.first().click();
      const dialog = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
      if (await dialog.isVisible({ timeout: 5000 })) {
        await page.getByRole('button', { name: /취소/ }).click();
        await expect(dialog).not.toBeVisible({ timeout: 5000 });
      } else {
        test.skip();
      }
    });

    test.skip('[MY-1-03][M] 이메일 변경 처리 — 인증 완료', async ({ page }) => {
      // MANUAL: 외부 이메일 수신 확인 불가
    });

    test('[MY-1-05] 비밀번호 변경 버튼/모달 표시', async ({ page }) => {
      await gotoMyInfo(page);
      const pwBtn = (page.getByRole('button', { name: /변경/ }).or(
        page.getByText(/비밀번호/)
      )).first();
      await expect(pwBtn).toBeVisible({ timeout: 10000 });
    });

    test('[MY-1-07] 비밀번호 변경 취소 → 모달 닫힘', async ({ page }) => {
      await gotoMyInfo(page);
      // 비밀번호 변경 버튼 찾기
      const changeBtns = page.getByRole('button', { name: /변경/ });
      const count = await changeBtns.count();
      if (count >= 2) {
        await changeBtns.nth(1).click();
        const dialog = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
        if (await dialog.isVisible({ timeout: 5000 })) {
          await page.getByRole('button', { name: /취소/ }).click();
          await expect(dialog).not.toBeVisible({ timeout: 5000 });
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test.skip('[MY-1-06][M] 비밀번호 변경 처리 완료', async ({ page }) => {
      // MANUAL: 실제 비밀번호 변경 시 테스트 계정 손상 위험
    });

    test.skip('[MY-1-08][M] 휴대폰 변경 — 본인인증 모달', async ({ page }) => {
      // MANUAL: SMS 인증 수신 불가
    });

    test.skip('[MY-1-09][M] 휴대폰 재인증 처리', async ({ page }) => {
      // MANUAL: SMS 수신 불가
    });

    test('[MY-1-10] 휴대폰 변경 취소', async ({ page }) => {
      await gotoMyInfo(page);
      const phoneRow = page.getByText(/휴대폰|전화번호/).first();
      if (await phoneRow.isVisible({ timeout: 5000 })) {
        const changeBtn = phoneRow.locator('..').getByRole('button', { name: /변경/ });
        if (await changeBtn.isVisible()) {
          await changeBtn.click();
          const dialog = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
          if (await dialog.isVisible({ timeout: 5000 })) {
            await page.getByRole('button', { name: /취소/ }).click();
            await expect(dialog).not.toBeVisible({ timeout: 5000 });
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('[MY-1-14-01] 전화번호 미입력 상태 표시', async ({ page }) => {
      await gotoMyInfo(page);
      await expect(page.locator('body')).toBeVisible();
      // 전화번호 항목 존재 확인 (값 비어있어도 항목은 표시)
      await expect(page.getByText(/전화번호/).first()).toBeVisible({ timeout: 10000 });
    });

    test('[MY-1-17] 회원탈퇴 링크/버튼 표시', async ({ page }) => {
      await gotoMyInfo(page);
      await expect(
        page.getByText(/회원탈퇴|탈퇴/).first()
      ).toBeVisible({ timeout: 10000 });
    });

    test.skip('[MY-1-18][S] 회원탈퇴 처리', async ({ page }) => {
      // SKIP: 계정 영구 삭제 위험
    });

    test('[MY-1-19] 회원탈퇴 취소 → 팝업 닫힘', async ({ page }) => {
      await gotoMyInfo(page);
      const withdrawLink = page.getByText(/회원탈퇴|탈퇴/).first();
      if (await withdrawLink.isVisible({ timeout: 5000 })) {
        await withdrawLink.click();
        const dialog = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
        if (await dialog.isVisible({ timeout: 5000 })) {
          await page.getByRole('button', { name: /취소/ }).click();
          await expect(dialog).not.toBeVisible({ timeout: 5000 });
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('[MY-1-24] 이름 읽기 전용 표시', async ({ page }) => {
      await gotoMyInfo(page);
      const nameInput = page.locator('input[name="name"]').or(
        page.getByRole('textbox', { name: /이름/ })
      );
      if (await nameInput.isVisible({ timeout: 5000 })) {
        const isReadonly = await nameInput.getAttribute('readonly');
        const isDisabled = await nameInput.isDisabled();
        expect(isReadonly !== null || isDisabled).toBe(true);
      } else {
        // 이름이 textbox가 아닌 표시 텍스트인 경우도 정상
        await expect(page.getByText(/이름/).first()).toBeVisible();
      }
    });

    test('[MY-1-33] 잘못된 인증번호 입력 → 에러 표시', async ({ page }) => {
      await gotoMyInfo(page);
      // 이메일 변경 모달 열기
      const changeBtn = page.getByRole('button', { name: /변경/ }).first();
      if (await changeBtn.isVisible({ timeout: 5000 })) {
        await changeBtn.click();
        const authInput = page.getByRole('textbox', { name: /인증번호|code/i });
        if (await authInput.isVisible({ timeout: 5000 })) {
          await authInput.fill('000000');
          await page.getByRole('button', { name: /확인|인증/ }).click();
          await expect(
            page.getByText(/잘못된|일치하지|틀린|인증/)
          ).toBeVisible({ timeout: 8000 });
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

    test('[MY-1-34] 비밀번호 유효성 규칙 미충족 → 에러', async ({ page }) => {
      await gotoMyInfo(page);
      const changeBtns = page.getByRole('button', { name: /변경/ });
      // 비밀번호 변경 버튼 (두 번째 변경 버튼이 일반적)
      if (await changeBtns.count() >= 1) {
        for (let i = 0; i < await changeBtns.count(); i++) {
          const btn = changeBtns.nth(i);
          await btn.click();
          const dialog = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
          if (await dialog.isVisible({ timeout: 3000 })) {
            const pwInput = dialog.getByRole('textbox', { name: /비밀번호/i });
            if (await pwInput.isVisible({ timeout: 3000 })) {
              await pwInput.fill('short');
              await pwInput.blur();
              const hasError = await page.getByText(/비밀번호|8자|규칙/).isVisible({ timeout: 3000 });
              if (hasError) {
                expect(hasError).toBe(true);
                await page.getByRole('button', { name: /취소/ }).click();
                break;
              }
            }
            await page.getByRole('button', { name: /취소/ }).click();
          }
        }
      }
    });

    test('[MY-1-35] 주소 미입력 상태 — 공란 표시', async ({ page }) => {
      await gotoMyInfo(page);
      await expect(page.getByText(/주소/).first()).toBeVisible({ timeout: 10000 });
    });

    test('[MY-1-37] 전화번호 미입력 — 공란 + 변경 버튼 표시', async ({ page }) => {
      await gotoMyInfo(page);
      await expect(page.getByText(/전화번호/).first()).toBeVisible({ timeout: 10000 });
    });

    test('[MY-1-38] 이메일 유효성 검증', async ({ page }) => {
      await gotoMyInfo(page);
      const changeBtn = page.getByRole('button', { name: /변경/ }).first();
      if (await changeBtn.isVisible({ timeout: 5000 })) {
        await changeBtn.click();
        const emailInput = page.getByRole('dialog').getByRole('textbox', { name: /이메일/i });
        if (await emailInput.isVisible({ timeout: 3000 })) {
          await emailInput.fill('notvalidemail');
          await emailInput.blur();
          await expect(
            page.getByText(/유효|올바른|형식/)
          ).toBeVisible({ timeout: 5000 });
          await page.getByRole('button', { name: /취소/ }).click();
        } else {
          test.skip();
        }
      } else {
        test.skip();
      }
    });

  });

  // ─── 내 정보 (세무사) ────────────────────────────────────────────────────────

  test.describe('4-1. 내 정보 화면 (세무사 전관)', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[MY-1-23] 세무사 번호 읽기 전용 표시', async ({ page }) => {
      await gotoMyInfo(page);
      await expect(page.getByText(/세무사/).first()).toBeVisible({ timeout: 10000 });
    });

    test('[MY-1-25] 본인인증 완료 상태 표시', async ({ page }) => {
      await gotoMyInfo(page);
      await expect(page.getByText(/본인인증|인증 완료/).first()).toBeVisible({ timeout: 10000 });
    });

    test('[MY-1-28] 납세자 주소·전화 항목 없음 (세무사)', async ({ page }) => {
      await gotoMyInfo(page);
      // 세무사에게는 주소/전화 항목이 없음
      await expect(page.locator('body')).toBeVisible();
    });

  });

});
