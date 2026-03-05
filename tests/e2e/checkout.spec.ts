import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('TC-06 ~ TC-07｜排序與結帳流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForLoadState('networkidle');
  });

  test('TC-06｜商品依價格低到高排序，清單順序應正確', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getItemPrices();

    // 驗證價格陣列是升序排列
    const isSorted = prices.every((price, i) => i === 0 || prices[i - 1] <= price);
    expect(isSorted).toBeTruthy();
  });

  test('TC-07｜完整結帳流程：登入 → 加購 → 填資料 → 完成訂單', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: 加商品
    await inventoryPage.addItemToCart('Sauce Labs Fleece Jacket');

    // Step 2: 前往購物車
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(1);

    // Step 3: 進入結帳
    await cartPage.proceedToCheckout();

    // Step 4: 填寫收件資訊
    await checkoutPage.fillShippingInfo('Test', 'User', '12345');

    // Step 5: 確認訂單摘要頁後完成
    await expect(page).toHaveURL(/.*checkout-step-two/);
    await checkoutPage.completeOrder();

    // Step 6: 驗證完成頁
    await checkoutPage.expectOrderComplete();
    await expect(page).toHaveURL(/.*checkout-complete/);
  });
});
