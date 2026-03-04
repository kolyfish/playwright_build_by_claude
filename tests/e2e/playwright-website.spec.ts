import { test, expect } from '@playwright/test';
import { BasePage } from '../../pages/BasePage';

/**
 * E2E 測試範例 - 測試 Playwright 官網
 * 示範：導航、斷言、元素互動
 */
test.describe('Playwright 官網 E2E 測試', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test('頁面標題應包含 Playwright', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('點擊 Get started 應導航到安裝頁', async ({ page }) => {
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    await expect(page).toHaveURL(/.*intro/);
  });

  test('導覽列應顯示主要連結', async ({ page }) => {
    const navbar = page.getByRole('navigation');
    await expect(navbar).toBeVisible();
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
  });

  test('BasePage 截圖功能', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.waitForPageLoad();
    const title = await basePage.getTitle();
    expect(title).toContain('Playwright');
  });
});
