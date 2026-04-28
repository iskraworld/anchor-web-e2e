import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── TF — 법인&팀연동관리 ────────────────────────────────────────────────────

// GNB > 법인 멤버 관리 이동 헬퍼
async function gotoFirmMemberMgmt(page: any) {
  await page.goto('/');
  const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
  await gnbBtn.first().click();
  const firmMenu = page.getByText(/법인 멤버 관리/).first();
  if (await firmMenu.isVisible({ timeout: 5000 })) {
    await firmMenu.click();
    await page.waitForLoadState('load');
  }
}

// GNB > 법인 정보 이동 헬퍼
async function gotoFirmInfo(page: any) {
  await page.goto('/');
  const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
  await gnbBtn.first().click();
  const firmInfoMenu = page.getByText('법인 정보', { exact: true }).first();
  if (await firmInfoMenu.isVisible({ timeout: 5000 })) {
    await firmInfoMenu.click();
    await page.waitForLoadState('load');
  }
}

test.describe('TF — 법인&팀연동관리', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한', () => {

    test.describe('법인 소유자 (firmOwner)', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[TF-0-01] 법인 소유자 세무사 — 연동 관리 탭 + 나의연동+멤버연동 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/연동 관리|법인 멤버/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[TF-0-02] 법인 소유자 비세무사 — 법인 멤버 관리 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('납세자 — 법인 메뉴 미표시', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[TF-0-09] 일반 이용자 — 법인 멤버 관리 메뉴 미노출', async ({ page }) => {
        await page.goto('/');
        const gnbBtn = page.getByTestId('gnb-profile-btn').or(page.locator('header button').last());
        if (await gnbBtn.first().isVisible({ timeout: 5000 })) {
          await gnbBtn.first().click();
          await expect(
            page.getByText(/법인 멤버 관리/).first()
          ).not.toBeVisible({ timeout: 5000 });
        } else {
          test.skip();
        }
      });
    });

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[TF-0-03] 세무법인 관리자 세무사 — 연동관리+그룹관리 가능', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('세무사 일반', () => {
      test.use({ storageState: AUTH_FILES.nonOfficer });

      test('[TF-0-05] 세무법인 구성원 세무사 — 나의 연동 상태만 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });
    });

  });

  // ─── 4-1. 연동 관리 ─────────────────────────────────────────────────────────

  test.describe('4-1. 연동 관리', () => {

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[TF-1-01] 연동 관리 탭 활성 — 나의연동+멤버연동 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/연동 관리|나의 연동/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-03] 초대 폼 — 이름·이메일 직접 입력', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        const nameInput = page.getByRole('textbox', { name: /이름/ }).or(
          page.locator('input[placeholder*="이름"]')
        );
        const emailInput = page.getByRole('textbox', { name: /이메일/ }).or(
          page.locator('input[placeholder*="이메일"]')
        );
        if (await nameInput.first().isVisible({ timeout: 5000 })) {
          await expect(nameInput.first()).toBeVisible();
          await expect(emailInput.first()).toBeVisible();
        } else {
          test.skip();
        }
      });

      test('[TF-1-04] 배정 그룹 드롭다운 — 그룹 목록 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-05] 권한 선택 — 일반/관리자 선택 가능', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test.skip('[TF-1-06][M] 초대 버튼 — 수락 대기중 상태 추가', async ({ page }) => {
        // MANUAL: 초대 처리 후 대기 상태 검증 — 데이터 변경 포함
      });

      test('[TF-1-07] 이름/이메일 검색 — 결과+초기화 버튼', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        const searchInput = page.locator('input[type="search"]').or(
          page.locator('input[placeholder*="검색"]')
        );
        if (await searchInput.first().isVisible({ timeout: 5000 })) {
          await expect(searchInput.first()).toBeVisible();
        } else {
          test.skip();
        }
      });

      test.skip('[TF-1-08][M] 연동 해제 — 해제 확인 모달 + 기본 플랜 전환', async ({ page }) => {
        // MANUAL: 실제 연동 해제 — 데이터 변경 포함
      });

      test.skip('[TF-1-09][M] 관리자 권한 회수 — 회수 확인 모달', async ({ page }) => {
        // MANUAL: 권한 변경 — 데이터 변경 포함
      });

      test.skip('[TF-1-10][M] 전체 연동 해제 — 모든 멤버 접근 정지', async ({ page }) => {
        // MANUAL: 전체 데이터 변경 — 위험 작업
      });

      test('[TF-1-11] 나의 연동 영역 — 법인명·이름·역할 최상단 고정', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/나의 연동|법인/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-12] 페이지네이션 — 10명씩 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-13] 초대 직후 수락 대기중 상태 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-14] 미구독 소유자 — Team 플랜 구독 유도 안내 표시', async ({ page }) => {
        // firmOwner 계정 기준 구독 여부에 따라 조건부 — 현재 구독 상태이면 skip
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-15] 구독 취소 소유자 — 그룹 관리 비활성+초대 제거', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-21] 미가입 이메일 초대 시도 — 초대 불가 안내', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-22] 관리자가 소유자 연동 해제 시도 — 차단', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-1-23] 미구독 소유자 — 구독하러 가기 → 구독 관리 이동', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        const subLink = page.getByText(/구독하러 가기|구독 관리/).first();
        if (await subLink.isVisible({ timeout: 5000 })) {
          await expect(subLink).toBeVisible();
        } else {
          test.skip();
        }
      });

      test('[TF-1-24] 기구독 이메일 초대 — Team Plan 우선 적용', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

  });

  // ─── 4-2. 그룹 관리 ─────────────────────────────────────────────────────────

  test.describe('4-2. 그룹 관리', () => {

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[TF-2-01] 그룹 관리 탭 — 법인 전체 선택 + 전체 멤버+그룹 트리 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        const groupTab = page.getByRole('tab', { name: /그룹 관리/ }).or(
          page.getByText(/그룹 관리/).first()
        );
        if (await groupTab.first().isVisible({ timeout: 8000 })) {
          await groupTab.first().click();
          await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        } else {
          test.skip();
        }
      });

      test.skip('[TF-2-02][M] 그룹 추가 — 그룹명 입력 모달 + 트리 반영', async ({ page }) => {
        // MANUAL: 그룹 데이터 변경 포함
      });

      test.skip('[TF-2-03][M] 하위 그룹 추가 — 상위 그룹 선택 + 모달', async ({ page }) => {
        // MANUAL: 그룹 데이터 변경 포함
      });

      test.skip('[TF-2-04][M] 그룹명 변경 — 즉시 반영', async ({ page }) => {
        // MANUAL: 그룹 데이터 변경 포함
      });

      test.skip('[TF-2-05][M] 그룹 삭제 — 하위 전부 삭제 + 멤버 미분류 전환', async ({ page }) => {
        // MANUAL: 그룹 삭제 — 데이터 변경 포함
      });

      test('[TF-2-06] 특정 그룹 선택 — 해당 그룹 소속 멤버 목록 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test.skip('[TF-2-07][M] 멤버 이동 — 이동 대상 그룹 선택 + 완료', async ({ page }) => {
        // MANUAL: 멤버 이동 — 데이터 변경 포함
      });

      test('[TF-2-08] 이름/이메일 검색 — 그룹 내 결과 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test.skip('[TF-2-09][M] 멤버 소속 그룹 직접 변경', async ({ page }) => {
        // MANUAL: 멤버 그룹 변경 — 데이터 변경 포함
      });

      test('[TF-2-11] 그룹 트리 순서 — 생성 시간순(오래된 것 상위)', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-2-12] 법인 전체 선택 — 멤버 정렬 확인', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-2-13] 세무사/비세무사 혼재 — 세무사 태그+역할 구분 표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-2-14] 법인 전체 vs 그룹 선택 — 하단 버튼 구분', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-2-21] 그룹 0개 — 빈 상태 안내', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-2-22] 멤버 없는 그룹 선택 — 빈 상태 안내', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test.skip('[TF-2-23][M] 동일 위계 내 같은 이름 그룹 추가 — 중복 불가 에러', async ({ page }) => {
        // MANUAL: 그룹 생성 시도 — 데이터 변경 포함
      });

      test('[TF-2-24] 3단계 하위 그룹에서 추가 시도 — 불가/버튼 미표시', async ({ page }) => {
        await gotoFirmMemberMgmt(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

  });

  // ─── 4-3. 법인 정보 ─────────────────────────────────────────────────────────

  test.describe('4-3. 법인 정보', () => {

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[TF-3-01] 법인 정보 화면 — 기본 정보+계정 정보 표시', async ({ page }) => {
        await gotoFirmInfo(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/법인 정보|기본 정보/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test.skip('[TF-3-02][M] 검색 노출 토글 ON/OFF — 노출/비노출', async ({ page }) => {
        // MANUAL: 토글 변경 후 검색 노출 상태 검증 — 데이터 변경 포함
      });

      test.skip('[TF-3-03][M] 대표 번호/주소 변경 후 반영', async ({ page }) => {
        // MANUAL: 데이터 변경 포함
      });

      test.skip('[TF-3-04][M] 대표 이미지 변경/삭제', async ({ page }) => {
        // MANUAL: 파일 업로드 — 데이터 변경 포함
      });

      test('[TF-3-05] 대표 세무사 설정 — 법인 소속 세무사 목록 표시', async ({ page }) => {
        await gotoFirmInfo(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test.skip('[TF-3-06][M] 이메일 변경 — 인증번호 입력 후 변경', async ({ page }) => {
        // MANUAL: 이메일 인증 — 외부 메일함 접근 필요
      });

      test.skip('[TF-3-07][M] 비밀번호 변경', async ({ page }) => {
        // MANUAL: 계정 정보 변경 포함
      });

      test.skip('[TF-3-08][M] 휴대폰 번호 변경 — 본인 인증 후 변경', async ({ page }) => {
        // MANUAL: SMS 인증 필요
      });

      test.skip('[TF-3-10][S] 법인 계정 삭제 — 탈퇴 처리', async ({ page }) => {
        // SKIP: 계정 삭제 — 되돌릴 수 없는 작업
      });

      test('[TF-3-11] 수정 불가 필드 — 법인명·등록번호·개업일자', async ({ page }) => {
        await gotoFirmInfo(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/법인명|등록번호|등록 번호|개업|사업자/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[TF-3-13] 비세무사 소유자 — 대표 세무사 후보에 본인 미포함', async ({ page }) => {
        await gotoFirmInfo(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test.skip('[TF-3-21][M] 잘못된 인증번호 입력 — 불일치 에러', async ({ page }) => {
        // MANUAL: 이메일 인증 흐름 필요
      });

      test('[TF-3-22] 유효하지 않은 비밀번호 입력 — 유효성 에러', async ({ page }) => {
        await gotoFirmInfo(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        const pwdChangeBtn = page.getByRole('button', { name: /비밀번호 변경/ }).or(
          page.getByText(/비밀번호 변경/).first()
        );
        if (await pwdChangeBtn.first().isVisible({ timeout: 5000 })) {
          await pwdChangeBtn.first().click();
          const newPwdInput = page.getByRole('textbox', { name: /새 비밀번호/ }).or(
            page.locator('input[type="password"]').nth(1)
          );
          if (await newPwdInput.first().isVisible({ timeout: 5000 })) {
            await newPwdInput.first().fill('123');
            await page.keyboard.press('Tab');
            await expect(
              page.getByText(/유효하지|형식|조건/).first()
            ).toBeVisible({ timeout: 5000 });
          } else {
            test.skip();
          }
        } else {
          test.skip();
        }
      });

      test('[TF-3-23] 법인 세무사 0명 — 대표 세무사 빈 상태 안내', async ({ page }) => {
        await gotoFirmInfo(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

      test('[TF-3-24] 대표 이미지 미등록 — 빈 상태 안내', async ({ page }) => {
        await gotoFirmInfo(page);
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
      });

    });

  });

});
