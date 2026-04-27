import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { TaxReportPage } from '../../../shared/pages/TaxReportPage';

test.use({ storageState: AUTH_FILES.firmOwner });

test.describe('시나리오 D: 세무법인 역량 리포트 조회', () => {
  test('D-1: 세무이력 리포트 페이지 로딩', async ({ page }) => {
    const report = new TaxReportPage(page);
    await report.goto('corporate');
    await expect(page).toHaveURL(/\/tax-history-report\/me/);
    await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
    await expect(page.getByText(/404|찾을 수 없/i)).not.toBeVisible();
    await expect(page.getByText('가온세무법인 프로필 리포트').first()).toBeVisible();
  });

  // D-2: BLOCKED — 법인 리포트에 1그룹/2그룹 분류 UI 없음. Anchor 팀 기능 릴리즈 후 재검토
  test.skip('D-2: 1그룹/2그룹 분류 수치 확인', async () => { /* blocked */ });

  // D-3: BLOCKED — 법인 리포트에 1그룹/2그룹 분류 UI 없음. Anchor 팀 기능 릴리즈 후 재검토
  test.skip('D-3: 그룹별 역량 상세 비교 확인', async () => { /* blocked */ });
});
