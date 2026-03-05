import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

// SauceDemo 所有帳號的密碼都一樣，只有帳號決定行為
const PASSWORD = 'secret_sauce';

test.describe('TC-01 ~ TC-03｜登入功能', () => {
  test.beforeEach(async ({ page }) => {
    // baseURL 已在 playwright.config.ts 設定為 https://www.saucedemo.com
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-01｜標準用戶登入成功，應導向商品列表頁', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', PASSWORD);

    // 確認 URL 跳到 /inventory.html
    await expect(page).toHaveURL(/.*inventory/);
    // 確認商品列表有渲染
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-02｜錯誤密碼登入失敗，應顯示錯誤訊息', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'wrong_password');

    await loginPage.expectErrorMessage('Username and password do not match');
    // 確認停留在登入頁
    await expect(page).toHaveURL('/');
  });

  test('TC-03｜被鎖定帳號登入，應顯示鎖定訊息', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('locked_out_user', PASSWORD);

    // 決策: 測試負面情境，驗證系統是否正確拒絕被鎖定的帳號
    await loginPage.expectErrorMessage('Sorry, this user has been locked out');
  });
});
