import { Page } from '@playwright/test';

export class TaxExpertSearchPage {
  constructor(private page: Page) {}

  async applyExpertAreaFilter(areaText: string) {
    await this.page.getByRole('button', { name: areaText }).click();
  }

  async clickExpertByName(name: string) {
    await this.page.getByText(name).first().click();
  }
}
