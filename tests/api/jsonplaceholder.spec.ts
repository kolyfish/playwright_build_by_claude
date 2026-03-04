import { test, expect } from '@playwright/test';

/**
 * API 測試範例 - 使用 JSONPlaceholder 公開 API
 * 示範：GET / POST / 狀態碼驗證 / Response body 驗證
 */
test.describe('JSONPlaceholder API 測試', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('GET /posts - 應回傳 100 筆文章', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body).toHaveLength(100);
  });

  test('GET /posts/1 - 應回傳單筆文章', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/1`);

    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post).toMatchObject({
      id: 1,
      userId: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('POST /posts - 應建立新文章', async ({ request }) => {
    const newPost = {
      title: 'Playwright API Test',
      body: '這是 API 測試建立的文章',
      userId: 1,
    };

    const response = await request.post(`${BASE_URL}/posts`, {
      data: newPost,
    });

    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created.title).toBe(newPost.title);
    expect(created.id).toBeDefined();
  });

  test('GET /posts/999 - 不存在的資源應回傳 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/999`);
    expect(response.status()).toBe(404);
  });
});
