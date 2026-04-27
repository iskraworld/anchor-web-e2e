import { Page, expect } from '@playwright/test';

export class TaxHistoryPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/tax-history-management/basic-info');
  }

  async closeGuideModal() {
    await expect(this.page.getByTestId('tax-history-guide-modal')).toBeVisible({ timeout: 10000 });
    await this.page.getByTestId('tax-history-modal-close-btn').click();
    await expect(this.page.getByTestId('tax-history-guide-modal')).not.toBeVisible();
  }

  getToggle() {
    return this.page.locator('[role="switch"]');
  }
}
