import { test as setup } from '@playwright/test';
import { Page } from '@playwright/test';
import { mkdirSync } from 'fs';
import { AUTH_FILES } from '../shared/helpers/authFiles';

mkdirSync('tests/.auth', { recursive: true });

const PASSWORD = process.env.ANCHOR_PASSWORD!;

async function saveAuth(page: Page, email: string, file: string) {
  await page.goto('/login');
  await page.getByTestId('auth-email-input').fill(email);
  await page.getByTestId('auth-password-input').fill(PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('/');
  await page.context().storageState({ path: file });
}

setup('auth: tax officer', async ({ page }) => {
  await saveAuth(page, process.env.ANCHOR_EMAIL_TAX_OFFICIAL!, AUTH_FILES.taxOfficer);
});

setup('auth: non officer', async ({ page }) => {
  await saveAuth(page, process.env.ANCHOR_EMAIL_TAX_GENERAL!, AUTH_FILES.nonOfficer);
});

setup('auth: firm owner', async ({ page }) => {
  await saveAuth(page, process.env.ANCHOR_EMAIL_FIRM_OWNER!, AUTH_FILES.firmOwner);
});

setup('auth: paid user', async ({ page }) => {
  await saveAuth(page, process.env.ANCHOR_EMAIL_TAXPAYER_PAID!, AUTH_FILES.paidUser);
});

setup('auth: free user', async ({ page }) => {
  await saveAuth(page, process.env.ANCHOR_EMAIL_TAXPAYER_FREE!, AUTH_FILES.freeUser);
});
