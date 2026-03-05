import { test, expect } from '@playwright/test';

// reqres.in 是公開的 REST API Mock，專門用來測試 HTTP client
const BASE_URL = 'https://reqres.in';

test.describe('TC-08 ~ TC-10｜ReqRes API 測試', () => {
  test('TC-08｜GET /api/users?page=2 應回傳 200 且資料結構正確', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users?page=2`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    // 驗證 pagination 欄位存在
    expect(body.page).toBe(2);
    expect(body.per_page).toBeDefined();
    expect(body.total).toBeDefined();
    // 驗證 data 陣列格式
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);
    // 驗證每筆資料的必要欄位
    body.data.forEach((user: { id: number; email: string; first_name: string }) => {
      expect(user.id).toBeDefined();
      expect(user.email).toContain('@');
      expect(user.first_name).toBeDefined();
    });
  });

  test('TC-09｜POST /api/users 建立用戶，應回傳 201 且含有 id', async ({ request }) => {
    const payload = {
      name: 'QA Engineer',
      job: 'Test Automation',
    };

    const response = await request.post(`${BASE_URL}/api/users`, { data: payload });

    expect(response.status()).toBe(201);

    const body = await response.json();
    // 決策: 驗證 id 存在即可，不驗證具體值（reqres.in 每次回傳不同 id）
    expect(body.id).toBeDefined();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.createdAt).toBeDefined();
  });

  test('TC-10｜POST /api/login 缺少密碼，應回傳 400 且含有 error 訊息', async ({ request }) => {
    // 決策: 測試負面情境，確保 API 正確拒絕不完整的請求
    const response = await request.post(`${BASE_URL}/api/login`, {
      data: { email: 'eve.holt@reqres.in' }, // 故意不帶 password
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBeDefined();
    expect(body.error).toContain('Missing password');
  });
});
