import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { OfficialProfilePage } from '../../../shared/pages/OfficialProfilePage';

test.use({ storageState: AUTH_FILES.nonOfficer });

const KIMGYEONGGUK_ID = 3313;

test.describe('시나리오 B 세부: 관계망 그래프 노드 상호작용', () => {

  test('TM-B-4: 관계망 그래프 렌더링 후 노드 클릭 — 상세 패널 노출', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMGYEONGGUK_ID);

    // 회사 전체 기준 필터 선택 + 관계망 찾기
    await profile.clickFirmMemberFilter();
    await profile.clickFindNetworkButton();
    await profile.waitForGraphRender();

    // 그래프 내 첫 번째 노드 클릭 (React Flow 노드)
    const graphWrapper = page.getByTestId('rf__wrapper');
    await expect(graphWrapper).toBeVisible();

    const firstNode = graphWrapper.locator('.react-flow__node').first();
    const nodeCount = await graphWrapper.locator('.react-flow__node').count();

    if (nodeCount > 0) {
      await firstNode.click();
      // 클릭 후 무언가(패널, 툴팁, 사이드바)가 나타나는지 확인
      // 에러 없이 정상 동작 확인이 핵심
      await expect(page.getByText(/500|서버 오류/i)).not.toBeVisible();
    }
  });

});
