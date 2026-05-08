import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { TaxReportPage } from '../../../shared/pages/TaxReportPage';

test.use({ storageState: AUTH_FILES.firmOwner });

// D-2/D-3는 Anchor 팀 1그룹/2그룹 분류 UI 미출시로 인해 작성 보류.
// UI 출시 후 추가 — 추적: .harness/state.md "D-2/D-3 BLOCKED 해제 (UI 출시 후)"
test.describe('시나리오 D: 세무법인 역량 리포트 조회', () => {
  test('D-1: 세무이력 리포트 페이지 로딩', async ({ page }) => {
    const report = new TaxReportPage(page);
    await report.goto('corporate');
    await expect(page).toHaveURL(/\/tax-history-report\/me/);
    await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
    await expect(page.getByText(/404|찾을 수 없/i)).not.toBeVisible();
    await expect(page.getByText('가온세무법인 프로필 리포트').first()).toBeVisible();
  });
});
