import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('TC-04 ~ TC-05｜購物車功能', () => {
  // 每個 test 都需要先登入，抽成 beforeEach 避免重複
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForLoadState('networkidle');
  });

  test('TC-04｜加入商品到購物車，badge 應顯示數量 1', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addItemToCart('Sauce Labs Backpack');

    // 驗證 badge 出現且數量正確
    await inventoryPage.expectCartBadgeVisible();
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('TC-05｜加入商品後再移除，購物車 badge 應消失', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadgeVisible();

    // 從商品頁移除（按鈕從「Add to cart」變成「Remove」）
    await inventoryPage.removeItemFromCart('Sauce Labs Bike Light');

    await inventoryPage.expectCartBadgeHidden();
  });
});
