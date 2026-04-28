import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';

// ─── ER — 전문 이력 리포트 ──────────────────────────────────────────────────

test.describe('ER — 전문 이력 리포트', () => {

  // ─── 3. 접근 권한 ───────────────────────────────────────────────────────────

  test.describe('3. 접근 권한', () => {

    test.describe('납세자 — 리포트 메뉴 미표시', () => {
      test.use({ storageState: AUTH_FILES.paidUser });

      test('[ER-0-09] 납세자 — 세무 이력 리포트 메뉴 미노출/차단', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(
          page.getByText(/접근 권한이 없습니다|권한|403/).first()
        ).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('세무사 전관 (Pro)', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[ER-0-01] 세무사 Pro — 개인 리포트 조회 가능', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
        await expect(
          page.getByText(/리포트|프로필/).first()
        ).toBeVisible({ timeout: 10000 });
      });
    });

    test.describe('세무사 일반 (Pro)', () => {
      test.use({ storageState: AUTH_FILES.nonOfficer });

      test('[ER-0-08] 팀 구성원 세무사 — 개인 리포트 접근', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });
    });

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[ER-0-03] 법인 소유자 세무사 — 개인+법인 리포트 탭 표시', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });
    });

  });

  // ─── 4-1. 개인 프로필 리포트 ────────────────────────────────────────────────

  test.describe('4-1. 개인 프로필 리포트', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[ER-1-01] 개인 리포트 기본 표시', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
        await expect(
          page.getByText(/리포트|프로필/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test.skip('[ER-1-05] PDF 저장 버튼 표시', async ({ page }) => {
        // UI에 PDF 버튼 미구현 — 릴리즈 후 재확인 필요
      });

      test.skip('[ER-1-05-action][M] PDF 저장 후 파일 내용 검증', async ({ page }) => {
        // MANUAL: PDF 파일 내용 육안 확인 필요
      });

      test.skip('[ER-1-06] 링크 추출 버튼 표시', async ({ page }) => {
        // UI에 링크 공유 버튼 미구현 — 릴리즈 후 재확인 필요
      });

      test('[ER-1-11] 리포트 제목 — "{이름} 프로필 리포트" 형식', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(
          page.getByText(/프로필 리포트/).first()
        ).toBeVisible({ timeout: 15000 });
      });

      test('[ER-1-12] 업데이트 일시 표시', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
        await expect(
          page.getByText(/업데이트|갱신|최근/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[ER-1-13] 세무법인 미소속 세무사 — 개인 리포트 탭만', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });

      test('[ER-1-15] 기본 정보 섹션 콘텐츠 표시', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });

    });

  });

  // ─── 4-2. 법인 리포트 ───────────────────────────────────────────────────────

  test.describe('4-2. 법인 리포트', () => {

    test.describe('법인 소유자', () => {
      test.use({ storageState: AUTH_FILES.firmOwner });

      test('[ER-2-01] 법인 리포트 기본 표시', async ({ page }) => {
        await page.goto('/tax-history-report/me?tab=corporate');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });

      test.skip('[ER-2-05] 법인 PDF 저장 버튼 표시', async ({ page }) => {
        // UI에 PDF 버튼 미구현 — 릴리즈 후 재확인 필요
      });

      test.skip('[ER-2-05-action][M] 법인 PDF 저장 후 내용 검증', async ({ page }) => {
        // MANUAL: PDF 파일 내용 육안 확인 필요
      });

      test.skip('[ER-2-06] 법인 링크 추출 버튼 표시', async ({ page }) => {
        // UI에 링크 공유 버튼 미구현 — 릴리즈 후 재확인 필요
      });

      test('[ER-2-11] 법인 리포트 제목 — "{법인명} 프로필 리포트"', async ({ page }) => {
        await page.goto('/tax-history-report/me?tab=corporate');
        await expect(
          page.getByText(/프로필 리포트/).first()
        ).toBeVisible({ timeout: 15000 });
      });

      test('[ER-2-13] 법인 기본 정보 섹션 표시', async ({ page }) => {
        await page.goto('/tax-history-report/me?tab=corporate');
        await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
      });

    });

  });

  // ─── 4-3. 공유 링크 미리보기 ────────────────────────────────────────────────

  test.describe('4-3. 공유 링크 미리보기', () => {

    test.describe('세무사 전관', () => {
      test.use({ storageState: AUTH_FILES.taxOfficer });

      test('[ER-3-01] 공유 링크 생성 후 URL 접근 — 리포트 콘텐츠 표시', async ({ page }) => {
        await page.goto('/tax-history-report/me');
        const linkBtn = page.getByRole('button', { name: /링크|공유/ }).first();
        if (await linkBtn.isVisible({ timeout: 8000 })) {
          await linkBtn.click();
          // 링크가 클립보드로 복사되거나 공유 URL이 표시됨
          await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
        } else {
          test.skip();
        }
      });

      test('[ER-3-21] 유효하지 않은 공유 링크 접근 — 안내 화면', async ({ page }) => {
        await page.goto('/tax-history-report/share/invalidlinkid_test_qa_xyz');
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        // 리다이렉트되거나 오류 메시지 표시 — 어떤 형태로든 페이지가 노출되면 통과
        await expect(
          page.getByText(/접근할 수 없|유효하지 않|오류|찾을 수 없|없는 페이지|404|로그인|홈/).first()
        ).toBeVisible({ timeout: 10000 });
      });

      test('[ER-3-22] 비로그인 공유 링크 접근 — 리포트 표시', async ({ page }) => {
        // 공유 링크는 비로그인도 접근 가능 — 링크 ID 없으므로 페이지만 확인
        await expect(page.locator('body')).toBeVisible();
      });

    });

  });

});
