import { Page } from '@playwright/test';
import { fillReactInput } from '../helpers/reactInput';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async selectActiveOfficialTab() {
    await this.page.getByTestId('home-active-official-tab').click();
  }

  async selectTaxExpertTab() {
    await this.page.getByTestId('home-tax-expert-tab').click();
  }

  async searchOfficialByName(name: string) {
    await this.page.goto(`/search/active-officials?name=${encodeURIComponent(name)}`);
  }

  async searchTaxExpertByFirm(firmName: string) {
    await this.selectTaxExpertTab();
    await fillReactInput(this.page, 'search-firm-name-input', firmName);
    await this.page.getByTestId('search-submit-btn').click();
  }

  async searchTaxExpertByRegion(regionName: string) {
    await this.selectTaxExpertTab();
    await this.page.getByRole('combobox').first().click();
    await this.page.getByRole('option', { name: regionName }).click();
    await this.page.getByTestId('search-submit-btn').click();
  }
}
