import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';

// 1회성 실행 스크립트: 한지희(taxhan 계정) 프로필 노출 토글 → OFF
// 실행: npx playwright test tests/scripts/toggle-off-hanjihee.spec.ts --project=chromium --headed
// 완료 후 이 파일은 삭제해도 됨

test.use({ storageState: AUTH_FILES.nonOfficer });

test('한지희 프로필 노출 토글 OFF 설정', async ({ page }) => {
  await page.goto('/tax-history-management/basic-info');

  // 가이드 모달이 나타나면 닫기
  const modal = page.getByTestId('tax-history-guide-modal');
  if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
    await page.getByTestId('tax-history-modal-close-btn').click();
    await expect(modal).not.toBeVisible();
  }

  // 토글 현재 상태 확인
  const toggle = page.locator('[role="switch"]');
  await expect(toggle).toBeVisible();

  const isChecked = await toggle.isChecked();
  console.log(`현재 토글 상태: ${isChecked ? 'ON' : 'OFF'}`);

  if (isChecked) {
    await toggle.click();
    await page.waitForTimeout(1000);
    const afterState = await toggle.isChecked();
    console.log(`변경 후 토글 상태: ${afterState ? 'ON' : 'OFF'}`);
    expect(afterState).toBe(false);
    console.log('✅ 토글 OFF 완료');
  } else {
    console.log('이미 OFF 상태입니다. 변경 불필요.');
  }
});
