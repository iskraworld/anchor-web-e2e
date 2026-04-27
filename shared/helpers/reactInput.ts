import { Page } from '@playwright/test';

export async function fillReactInput(page: Page, testId: string, value: string): Promise<void> {
  await page.evaluate(
    ({ selector, val }) => {
      const el = document.querySelector(`[data-testid="${selector}"]`) as HTMLInputElement;
      if (!el) throw new Error(`[data-testid="${selector}"] not found`);
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )!.set!;
      nativeSetter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { selector: testId, val: value }
  );
}
