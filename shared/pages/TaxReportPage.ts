import { Page } from '@playwright/test';

export class TaxReportPage {
  constructor(private page: Page) {}

  async goto(tab?: 'corporate') {
    const url = tab ? `/tax-history-report/me?tab=${tab}` : '/tax-history-report/me';
    await this.page.goto(url);
  }
}
