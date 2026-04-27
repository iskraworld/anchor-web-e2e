import { Page } from '@playwright/test';

export class TaxExpertProfilePage {
  constructor(private page: Page) {}

  async goto(uuid: string) {
    await this.page.goto(`/search/tax-experts/${uuid}`);
  }
}
