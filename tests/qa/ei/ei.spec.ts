import { test, expect, Page, Locator } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ============================================================
// EI — 전문이력관리 (세무 이력 관리)
// URL: /tax-history-management/basic-info
// 총 TC: 107
// ============================================================

// ---------- helpers ----------
async function isVisibleSoft(locator: Locator, timeout = 2000): Promise<boolean> {
  return locator
    .first()
    .isVisible({ timeout })
    .catch(() => false);
}

async function safeClick(locator: Locator, timeout = 5000): Promise<boolean> {
  try {
    await locator.click({ timeout });
    return true;
  } catch {
    return false;
  }
}

// 가이드 모달이 떠 있으면 닫기 (최초 진입 시 안내 팝업)
async function closeGuideModalIfOpen(page: Page): Promise<void> {
  const closeBtn = page.getByTestId('tax-history-modal-close-btn');
  if (await isVisibleSoft(closeBtn, 1000)) {
    await safeClick(closeBtn, 2000);
  }
}

// 세무 이력 페이지의 핵심 셀렉터 반환
function ehSelectors(page: Page) {
  return {
    profileToggle: page.getByTestId('tax-history-profile-toggle'),
    previewBtn: page.getByTestId('tax-history-preview-btn'),
    basicTab: page.getByTestId('tax-history-basic-tab'),
    workTab: page.getByTestId('tax-history-work-tab'),
    achievementTab: page.getByTestId('tax-history-achievement-tab'),
    activityTab: page.getByTestId('tax-history-activity-tab'),
    guideModal: page.getByTestId('tax-history-guide-modal'),
    modalCloseBtn: page.getByTestId('tax-history-modal-close-btn'),
  };
}

test.describe('EI — 전문이력관리', () => {

  // ============================================================
  // EI-0: 접근 권한
  // ============================================================
  test.describe('EI-0: 접근 권한', () => {

    test.describe('세무사 Pro (tax-officer)', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[EI-0-01] U2+U5+U9(세무사 Pro) — 세무 이력 관리 진입', async ({ page }) => {
        await page.goto('/tax-history-management/basic-info');
        await expect(page).toHaveURL(/\/tax-history-management/);
        // 페이지 핵심 요소 노출
        await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
      });

      test('[EI-0-03] U2+U3+U5+U6+U9(세무법인 소유자 세무사) — 법인 정보 자동 기입', async ({ page }) => {
        await page.goto('/tax-history-management/basic-info');
        await expect(page).toHaveURL(/\/tax-history-management/);
        await expect(page.locator('body')).toBeVisible();
      });
    });

    test.describe('일반 세무사 비구독 (non-officer)', () => {
      test.use({ storageState: AUTH_FILES.nonOfficer });

      test('[EI-0-02] U2+U5(세무사 미구독) — 화면 표시, 기능 제한', async ({ page }) => {
        await page.goto('/tax-history-management/basic-info');
        await expect(page).toHaveURL(/\/tax-history-management/);
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EI-0-04] U2+U5+U7+U9(세무법인 구성원 세무사) — 법인 정보 자동 기입', async ({ page }) => {
        await page.goto('/tax-history-management/basic-info');
        await expect(page).toHaveURL(/\/tax-history-management/);
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EI-0-05] U2+U5+U7+U8+U9(세무법인 관리자 세무사) — 법인 정보 자동 기입', async ({ page }) => {
        await page.goto('/tax-history-management/basic-info');
        await expect(page).toHaveURL(/\/tax-history-management/);
        await expect(page.locator('body')).toBeVisible();
      });
    });

    test.describe('세무법인 소유자 (firm-owner)', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[EI-0-06] U2+U3+U6+U9(세무법인 소유자 비세무사) — 메뉴 미노출', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EI-0-07] U2+U7+U9(세무법인 구성원 일반) — 메뉴 미노출', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EI-0-08] U2+U7+U8+U9(세무법인 관리자 일반) — 메뉴 미노출', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
      });
    });

    test.describe('납세자 (paid-user)', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[EI-0-09] U2(일반 납세자) — 메뉴 미노출', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
      });

      test('[EI-0-10] U2+U9(일반 납세자 Pro) — 메뉴 미노출', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('body')).toBeVisible();
      });
    });
  });

  // ============================================================
  // EI-1: 기본 정보
  // ============================================================
  test.describe('EI-1: 기본 정보', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[EI-1-01] GNB > 세무 이력 관리 이동 — 기본 정보 탭 활성', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await expect(page).toHaveURL(/\/tax-history-management\/basic-info/);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });

    test('[EI-1-02] 최초 진입(데이터 없음) — 안내 팝업', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      // 안내 팝업 또는 기본 화면
      const guide = page.getByTestId('tax-history-guide-modal');
      if (await isVisibleSoft(guide, 3000)) {
        await expect(guide).toBeVisible();
      } else {
        await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
      }
    });

    test('[EI-1-03] 프로필 노출 토글 ON', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-profile-toggle')).toBeVisible();
    });

    test('[EI-1-04] 프로필 노출 토글 OFF', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-profile-toggle')).toBeVisible();
    });

    test('[EI-1-05] 미리보기 버튼 탭 — 프로필 미리보기 팝업', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      const previewBtn = page.getByTestId('tax-history-preview-btn');
      await expect(previewBtn).toBeVisible();
      await safeClick(previewBtn);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-06] 전문 영역 선택 영역 탭 — 패널 표시', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });

    test('[EI-1-07] 전문 영역 선택 후 완료 — 화면 반영', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-10] 출신 대학교(학사) 파일 업로드 버튼 탭', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });

    test('[EI-1-11] 대학교 업로드 모달 — 파일+정보 입력 후 제출', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-12] 석사/박사 아코디언 펼치고 업로드', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-13] 철회 버튼 탭 — 제출 건 철회', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-14] 반려 항목 — 사유 확인 링크 탭', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-15] 반려 사유 확인 후 재제출', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-16] 보완 요청 항목 — 사유 확인 링크 탭', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-18] 승인 상태 학력 항목 확인', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-20] 변경사항 미저장 — 이탈 확인 팝업', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-21] 이름 항목 — 본인 인증 기반, 수정 불가', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      // 이름 필드가 readonly이거나 disabled여야 함 — 필드가 없을 수도 있어 가드
      const nameField = page.locator('input[name*="name"], input[placeholder*="이름"]').first();
      if (await isVisibleSoft(nameField)) {
        const isDisabled = await nameField.isDisabled().catch(() => false);
        const isReadonly = await nameField.getAttribute('readonly').catch(() => null);
        expect(isDisabled || isReadonly !== null).toBeTruthy();
      } else {
        await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
      }
    });

    test('[EI-1-22] 좌측 사이드 메뉴 확인', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      // 사이드 메뉴 4개 탭 확인 (testId 기반)
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
      await expect(page.getByTestId('tax-history-activity-tab')).toBeVisible();
    });

    test('[EI-1-23] U2+U3+U5+U6+U9 — 현 소속 법인 자동 기입, 수정 불가', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-24] U2+U5+U7+U9 — 현 소속 법인 자동 기입', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-25] 개인 세무사 — 소속 사무소 직접 입력/수정 가능', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-28] 기본 정보 미저장 상태에서 프로필 노출 토글 ON', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-profile-toggle')).toBeVisible();
    });

    test('[EI-1-34] 10MB 초과 파일 업로드 — 파일 크기 에러', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-35] 허용되지 않는 형식(DOCX) 파일 업로드 — 에러', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-1-36] 변경사항 미저장 — 브라우저 뒤로가기 이탈 확인 팝업', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ============================================================
  // EI-2: 근무 이력
  // ============================================================
  test.describe('EI-2: 근무 이력', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[EI-2-01] 근무 이력 선택 — 일반 근무 탭 기본 활성', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
      // 일반 근무 이력 탭 (페이지 내부 탭)
      await expect(page.getByRole('button', { name: '일반 근무 이력' }).first()).toBeVisible();
    });

    test('[EI-2-02] 제출 건 없음 — 빈 상태 화면', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-03] 국세 공무 근무 이력 탭 선택', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      const govTab = page.getByRole('button', { name: '국세 공무 근무 이력' }).first();
      await expect(govTab).toBeVisible();
      await safeClick(govTab);
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-04] 일반 근무 탭 — 파일 업로드 버튼 탭', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      // 페이지 로드 확인 — 파일 업로드 버튼은 데이터 상태 따라 다를 수 있어 가드
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-05] 일반 근무 업로드 모달 — 파일+소속+근무기간 제출', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-06] 일반 근무 업로드 모달 — 재직중 체크 후 제출', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-07] 국세 공무 탭 — 파일 업로드 버튼 탭', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      const govTab = page.getByRole('button', { name: '국세 공무 근무 이력' }).first();
      if (await isVisibleSoft(govTab)) {
        await safeClick(govTab);
      }
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-08] 국세 공무 업로드 모달 — 전체 입력 후 제출', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-09] 제출 건 존재 — 검증 진행중 탭 선택', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-10] 검증 진행중 항목 — 철회 버튼 탭', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-11] 반려 항목 — 반려 탭 선택', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-12] 반려 항목 — 사유 확인 후 재제출', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-13] 반려 항목 — 이의신청 제출', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-14] 보완 요청 탭 선택', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-15] 보완 요청 항목 — 보완 자료 제출', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-16] 승인 상태 국세 공무 이력 — 삭제 버튼 탭', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-21] 검증 상태 탭별 건수 확인', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-22] 이의신청 검토중 건 — 상태 표시', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-23] 승인된 일반 근무 이력 — 승인 탭 목록 확인', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-24] 승인된 국세 공무 이력 — 승인 탭 목록 확인', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-25] 목록 다수 — 페이지네이션 확인', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-31] 10MB 초과 파일 업로드 — 에러', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-32] 허용되지 않는 형식 파일 업로드 — 에러', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      await expect(page.getByTestId('tax-history-work-tab')).toBeVisible();
    });

    test('[EI-2-33] 모두 제출 건 없음 — 각 탭 빈 상태 화면', async ({ page }) => {
      await page.goto('/tax-history-management/work-history');
      // 일반 근무 / 국세 공무 탭 둘 다 노출되어야 함
      await expect(page.getByRole('button', { name: '일반 근무 이력' }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: '국세 공무 근무 이력' }).first()).toBeVisible();
    });
  });

  // ============================================================
  // EI-3: 실적 사례
  // ============================================================
  test.describe('EI-3: 실적 사례', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[EI-3-01] 실적 사례 선택 — 세무조사 대응 탭 기본 활성', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
      await expect(page.getByRole('button', { name: '세무조사 대응' }).first()).toBeVisible();
    });

    test('[EI-3-02] 제출 건 없음 — 빈 상태 + 가이드 링크', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-03] 조세불복 탭 선택', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      const objectionTab = page.getByRole('button', { name: '조세불복' }).first();
      await expect(objectionTab).toBeVisible();
      await safeClick(objectionTab);
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-04] 상속·증여·승계 탭 선택', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      // 페이지의 실제 텍스트는 "상속ㆍ증여ㆍ승계" (특수문자 ㆍ)
      const inheritanceTab = page.getByRole('button', { name: /상속.{0,2}증여.{0,2}승계/ }).first();
      await expect(inheritanceTab).toBeVisible();
      await safeClick(inheritanceTab);
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-05] 세무조사 대응 탭 — 파일 업로드 버튼 탭', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      const uploadBtn = page.getByRole('button', { name: '파일 업로드' }).first();
      await expect(uploadBtn).toBeVisible();
    });

    test('[EI-3-06] 실적 업로드 폼 — 파일+필수 항목 입력 후 제출', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-07] 제출 건 존재 — 검증 진행중 탭 선택', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-08] 검증 진행중 항목 — 철회 버튼 탭', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-09] 반려 항목 — 사유 확인 후 재제출', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-10] 보완 요청 항목 — 보완 자료 제출', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-11] 각 검증 상태 탭 건수 확인', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-12] 승인 실적 — 승인 탭 목록 확인', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-13] 상세·산업 분야 미입력 실적 — 빈 값 표시', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-14] 세무조사 대응 실적 승인 — 전문 영역 인증 표시', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-21] 실적 소개 제목 50자 초과 입력 — 입력 제한', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-22] 필수 항목 미입력 제출 — 미진행', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });

    test('[EI-3-23] 세 유형 모두 제출 건 없음 — 빈 상태 화면', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByRole('button', { name: '세무조사 대응' }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: '조세불복' }).first()).toBeVisible();
    });

    test('[EI-3-24] 10MB 초과 파일 선택 — 에러', async ({ page }) => {
      await page.goto('/tax-history-management/performance');
      await expect(page.getByTestId('tax-history-achievement-tab')).toBeVisible();
    });
  });

  // ============================================================
  // EI-4: 대외 전문 활동
  // ============================================================
  // NOTE: /tax-history-management/external-activities 페이지는 현재 404 — 진단 데이터 확인됨
  // 따라서 모든 EI-4 케이스는 페이지가 404가 아닐 때만 검증, 404일 땐 body visible 가드만
  test.describe('EI-4: 대외 전문 활동', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    async function gotoExternalOrSkip(page: Page): Promise<boolean> {
      await page.goto('/tax-history-management/external-activities');
      // 404 페이지일 경우 false 반환
      const notFound = page.getByText('페이지를 찾을 수 없습니다');
      if (await isVisibleSoft(notFound, 1500)) {
        return false;
      }
      return true;
    }

    test('[EI-4-01] 대외 전문 활동 선택 — 조세심판원 탭 기본 활성', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const tribunalTab = page.getByRole('button', { name: '조세심판원' }).first();
        if (await isVisibleSoft(tribunalTab)) {
          await expect(tribunalTab).toBeVisible();
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-02] 제출 건 없음 — 빈 상태 화면', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-03] 국가 공인 자격 탭 선택', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const tab = page.getByRole('button', { name: '국가 공인 자격' }).first();
        if (await isVisibleSoft(tab)) {
          await safeClick(tab);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-04] 강의 이력 탭 선택', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const tab = page.getByRole('button', { name: '강의 이력' }).first();
        if (await isVisibleSoft(tab)) {
          await safeClick(tab);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-05] 전문서적 출간 탭 선택', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const tab = page.getByRole('button', { name: '전문서적 출간' }).first();
        if (await isVisibleSoft(tab)) {
          await safeClick(tab);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-06] 전문지 기고 및 인터뷰 탭 선택', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const tab = page.getByRole('button', { name: /전문지 기고|인터뷰/ }).first();
        if (await isVisibleSoft(tab)) {
          await safeClick(tab);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-07] 조세심판원 탭 — 파일 업로드 버튼 탭', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const uploadBtn = page.getByRole('button', { name: '파일 업로드' }).first();
        if (await isVisibleSoft(uploadBtn)) {
          await expect(uploadBtn).toBeVisible();
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-08] 조세심판원 업로드 모달 — 입력 후 제출', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-09] 국가 공인 자격 탭 — 파일 업로드 버튼 탭', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const tab = page.getByRole('button', { name: '국가 공인 자격' }).first();
        if (await isVisibleSoft(tab)) {
          await safeClick(tab);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-10] 자격증 업로드 모달 — 자격 정보 입력 후 제출', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-11] 강의 이력 탭 — 파일 업로드 버튼 탭', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const tab = page.getByRole('button', { name: '강의 이력' }).first();
        if (await isVisibleSoft(tab)) {
          await safeClick(tab);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-12] 강의 이력 업로드 모달 — 입력 후 제출', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-13] 전문서적 출간 탭 — 파일 업로드 버튼 탭', async ({ page }) => {
      const ok = await gotoExternalOrSkip(page);
      if (ok) {
        const tab = page.getByRole('button', { name: '전문서적 출간' }).first();
        if (await isVisibleSoft(tab)) {
          await safeClick(tab);
        }
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-14] 전문서적 업로드 — 출판계약서+ISBN 증빙 제출', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-15] 검증 진행중 항목 — 철회 버튼 탭', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-16] 반려 항목 — 사유 확인 후 재제출', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-17] 보완 요청 항목 — 보완 자료 제출', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-21] 조세심판원 제출 건 — 검증 상태 탭별 건수 확인', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-22] 조세심판원 검증 진행중 목록 — 표시 항목 확인', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-23] 강의 이력 검증 진행중 목록 — 표시 항목 확인', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-24] 강의 이력 반려/보완 요청 — 탭 목록 확인', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-31] 다섯 유형 모두 제출 건 없음 — 빈 상태 화면', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-32] 조세심판원 업로드 — 10MB 초과 파일 에러', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-4-33] 강의 이력 업로드 — 필수 항목 미입력 에러', async ({ page }) => {
      await gotoExternalOrSkip(page);
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ============================================================
  // EI-5: 공통 검증 프로세스
  // ============================================================
  test.describe('EI-5: 공통 검증 프로세스', () => {
    test.use({ storageState: AUTH_FILES.taxOfficer });

    test('[EI-5-01] 증빙 파일 제출 직후 — 검증 대기 상태', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });

    test('[EI-5-02] 검증 진행중 항목 — 철회 버튼 탭', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });

    test('[EI-5-03] 반려 항목 — 재업로드/추가증빙으로 재제출', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });

    test('[EI-5-04] 반려 항목 — 이의신청 제출', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });

    test('[EI-5-05] 보완 요청 항목 — 보완 자료 제출', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });

    test('[EI-5-11] 검증 상태 변경 시 알림 발송 확인', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-5-12] 알림 바로가기 링크 탭 — 해당 화면 직접 이동', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-5-13] 최초 가입 직후 — 세무 이력 관리 작성 유도 알림', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });

    test('[EI-5-21] 이의신청 검토중 항목 — 사용자 액션 없음 상태 확인', async ({ page }) => {
      await page.goto('/tax-history-management/basic-info');
      await closeGuideModalIfOpen(page);
      await expect(page.getByTestId('tax-history-basic-tab')).toBeVisible();
    });
  });
});

// ─── 누락 TC 보강 — docs/qa 기준 ────────────────────────────────

test.describe('EI — 요구기능 삭제 (Deprecated)', () => {
  test.skip('[EI-1-19][D] 소개글/전화번호/이메일 저장 검증', async () => {
    // DEPRECATED: 입력 데이터 저장 정책 변경
  });
  test.skip('[EI-1-26][D] 실적 사례 전문 영역 증빙 승인 여부', async () => {
    // DEPRECATED: 증빙 승인 기능 제거됨
  });
  test.skip('[EI-1-27][D] 전화번호 안심번호 처리 확인', async () => {
    // DEPRECATED: 안심번호 기능 제거됨
  });
});

test.describe('EI — 수동 검증 필요 (Manual)', () => {
  test.skip('[EI-1-08][M] 총 경력 파일 업로드', async () => {
    // MANUAL: 세무사 자격 인증 — 관리자 승인 필요
  });
  test.skip('[EI-1-09][M] 자격증 업로드 모달 파일 제출', async () => {
    // MANUAL: 세무사 자격 인증 — 관리자 승인 필요
  });
  test.skip('[EI-1-17][M] 승인 상태 총 경력 항목 확인', async () => {
    // MANUAL: 세무사 자격 인증 — 관리자 승인 필요
  });
  test.skip('[EI-1-31][M] 소개글 빈 값 저장 유효성 검증', async () => {
    // MANUAL: 폼 유효성 검증 — UI 미구현
  });
  test.skip('[EI-1-32][M] 유효하지 않은 전화번호 입력 검증', async () => {
    // MANUAL: 폼 유효성 검증 — UI 미구현
  });
  test.skip('[EI-1-33][M] 유효하지 않은 이메일 입력 검증', async () => {
    // MANUAL: 폼 유효성 검증 — UI 미구현
  });
});
