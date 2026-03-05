import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly sortContainer: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.sortContainer = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addItemToCart(itemName: string) {
    // 透過商品名稱定位，再找其 add-to-cart 按鈕（避免 index 硬編碼）
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
    await item.locator('[data-test^="add-to-cart"]').click();
  }

  async removeItemFromCart(itemName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
    await item.locator('[data-test^="remove"]').click();
  }

  async getCartBadgeCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async expectCartBadgeVisible() {
    await expect(this.cartBadge).toBeVisible();
  }

  async expectCartBadgeHidden() {
    await expect(this.cartBadge).toBeHidden();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortContainer.selectOption(option);
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
