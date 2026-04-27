import { Page } from '@playwright/test';

export async function loginAs(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.locator('[data-testid="auth-email-input"]').fill(email);
  await page.locator('[data-testid="auth-password-input"]').fill(password);
  await page.locator('[data-testid="auth-login-btn"]').click();
  await page.waitForURL('/');
}

// React controlled inputs ignore direct .value assignment.
// Use the native setter so React's synthetic event fires and enables the submit button.
export async function fillReactInput(page: Page, testId: string, value: string): Promise<void> {
  await page.locator(`[data-testid="${testId}"]`).evaluate((el: HTMLInputElement, val: string) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    if (setter) {
      setter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, value);
}
