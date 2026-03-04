import { Page, Locator } from '@playwright/test';

/**
 * BasePage - 所有 Page Object 的基底類別
 * 封裝共用行為，例如等待、截圖、捲動等
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }
}
