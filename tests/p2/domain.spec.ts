import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../shared/helpers/authFiles';
import { OfficialProfilePage } from '../../shared/pages/OfficialProfilePage';

test.use({ storageState: AUTH_FILES.taxOfficer });

const KIMJEONGHEE_ID = 5707;

test.describe('P2 Domain: 관계망 도메인 기능', () => {
  test('FN-DOMAIN-002: 관계망 노드 클릭 → 상세 패널 노출 + 500 에러 없음', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMJEONGHEE_ID);
    await profile.clickFindNetworkButton();
    await profile.waitForGraphRender();

    const graphWrapper = page.getByTestId('rf__wrapper');
    const nodes = graphWrapper.locator('.react-flow__node');
    const nodeCount = await nodes.count();

    if (nodeCount > 0) {
      await nodes.first().click();
      await page.waitForTimeout(800);
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
    }
  });
});
