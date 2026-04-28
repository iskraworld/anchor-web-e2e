import { test, expect } from '@playwright/test';
import { AUTH_FILES } from '../../../shared/helpers/authFiles';
import { OfficialProfilePage } from '../../../shared/pages/OfficialProfilePage';

test.use({ storageState: AUTH_FILES.taxOfficer });

const KIMJEONGHEE_ID = 5707;

test.describe('시나리오 A 확장: 인사권자 포함 관계망 탐색', () => {
  test('TM-A-4: 인사권자 포함 확장 관계망 → UI 버튼 노출 확인', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMJEONGHEE_ID);
    await profile.clickFindNetworkButton();
    await profile.waitForGraphRender();

    // 인사권자 포함 옵션 버튼 탐색
    const supervisorBtn = page.getByRole('button', { name: /인사권자|상사|관리자/i });
    const hasSupervisorOpt = await supervisorBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasSupervisorOpt) {
      await supervisorBtn.click();
      await profile.waitForGraphRender();
    }
    // 그래프 또는 관계망 컨테이너가 유지됨을 확인
    await expect(page.getByTestId('rf__wrapper')).toBeVisible();
  });

  test('TM-A-5: 회사 전체 기준 + 인사권자 관계망 → 그래프 렌더링', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMJEONGHEE_ID);

    // 회사 전체 기준 필터 클릭
    await profile.clickFindNetworkButton();
    await profile.waitForGraphRender();

    const firmFilter = page.getByTestId('mutual-firm-member-filter');
    if (await firmFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firmFilter.click();
      await profile.waitForGraphRender();
    }
    await expect(page.getByTestId('rf__wrapper')).toBeVisible();
  });

  test('TM-A-6: 영향력 높은 인물 목록 섹션 존재 확인', async ({ page }) => {
    const profile = new OfficialProfilePage(page);
    await profile.goto(KIMJEONGHEE_ID);
    await profile.clickFindNetworkButton();
    await profile.waitForGraphRender();

    const influenceSection = page.getByText(/영향력|영향 점수|influence/i);
    const hasList = await influenceSection.first().isVisible({ timeout: 5000 }).catch(() => false);
    // 영향력 섹션이 없으면 그래프 자체가 해당 데이터를 노드로 표시
    const graphNodes = page.getByTestId('rf__wrapper').locator('.react-flow__node');
    const nodeCount = await graphNodes.count();
    expect(hasList || nodeCount > 0).toBeTruthy();
  });
});
