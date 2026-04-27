import { Page, expect } from '@playwright/test';

export class OfficialProfilePage {
  constructor(private page: Page) {}

  async goto(id: number | string) {
    await this.page.goto(`/search/active-officials/${id}`);
  }

  async clickFindNetworkButton() {
    await this.page.getByRole('button', { name: /관계망 찾기/ }).click();
  }

  async clickFirmMemberFilter() {
    await this.page.getByTestId('mutual-firm-member-filter').click();
  }

  async waitForGraphRender(timeout = 30000) {
    await expect(this.page.getByTestId('rf__wrapper')).toBeVisible({ timeout });
  }

  async getNetworkSection() {
    return this.page.getByRole('heading', { name: /공통 관계망 찾기/ });
  }

  async getRecommendedExpertSection() {
    return this.page.locator('section, div').filter({ hasText: /추천 세무사/ }).first();
  }
}
