import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { TaxReportPage } from '../../../shared/pages/TaxReportPage';

test.use({ storageState: AUTH_FILES.firmOwner });

test.describe('시나리오 E: 법인 특장점 확인', () => {
  test('E-1: 전문 영역별 실적 — 상속·증여·승계 항목 포함', async ({ page }) => {
    const report = new TaxReportPage(page);
    await report.goto('corporate');
    await expect(page.getByText(/상속|증여|승계/).first()).toBeVisible();
  });

  test('E-3: 전문 영역 분포 시각화 요소 존재', async ({ page }) => {
    const report = new TaxReportPage(page);
    await report.goto('corporate');
    // 실적 건수 또는 분포 섹션이 렌더링됨
    await expect(page.getByText(/세무조사|상속|조세불복|세무검증/).first()).toBeVisible();
  });
});
