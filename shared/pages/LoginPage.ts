import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('auth-email-input').fill(email);
    await this.page.getByTestId('auth-password-input').fill(password);
    await this.page.locator('button[type="submit"]').click();
    await this.page.waitForURL('/');
  }
}
