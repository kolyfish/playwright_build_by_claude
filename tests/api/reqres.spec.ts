import { test, expect } from '@playwright/test';

// JSONPlaceholder 是公開的免費 REST API Mock，無需 API key
const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('TC-08 ~ TC-10｜REST API 測試', () => {
  test('TC-08｜GET /users?_page=2 應回傳 200 且資料結構正確', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    // 驗證回傳陣列且有資料
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    // 驗證每筆資料的必要欄位
    body.forEach((user: { id: number; email: string; name: string }) => {
      expect(user.id).toBeDefined();
      expect(user.email).toContain('@');
      expect(user.name).toBeDefined();
    });
  });

  test('TC-09｜POST /posts 建立資源，應回傳 201 且含有 id', async ({ request }) => {
    const payload = {
      title: 'QA Engineer',
      body: 'Test Automation',
      userId: 1,
    };

    const response = await request.post(`${BASE_URL}/posts`, { data: payload });

    expect(response.status()).toBe(201);

    const body = await response.json();
    // 決策: 驗證 id 存在即可，JSONPlaceholder 固定回傳 id: 101
    expect(body.id).toBeDefined();
    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
  });

  test('TC-10｜GET /users/999 不存在的資源，應回傳 404', async ({ request }) => {
    // 決策: 測試負面情境，確保 API 正確處理不存在的資源
    const response = await request.get(`${BASE_URL}/users/999`);

    expect(response.status()).toBe(404);
  });
});
