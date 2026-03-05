import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  testIgnore: ['**/_*', '**/._*'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // CI 用單執行緒避免資源競爭；本機用多執行緒加速
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      // E2E UI 測試：SauceDemo 電商網站
      name: 'e2e',
      testMatch: '**/e2e/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
    {
      // API 測試：ReqRes.in — 不需要啟動瀏覽器
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
    },
  ],
});
