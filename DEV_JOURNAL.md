# 開發者設計精華日誌

## 專案概覽

| 項目 | 說明 |
|------|------|
| 目的 | 展示 QA 工程師能力的 Side Project：E2E + API 自動化測試 + CI/CD + GCP |
| 測試對象 | SauceDemo（E2E UI）、ReqRes.in（API） |
| 技術棧 | Playwright + TypeScript + Docker + GitHub Actions + GCP (Cloud Run Job / GCS) |

---

## 架構設計

```
playwright-demo/
├── pages/                  # Page Object Model（POM）封裝 UI 操作
│   ├── BasePage.ts         # 共用行為：navigate、waitForPageLoad、截圖
│   ├── LoginPage.ts        # SauceDemo 登入頁
│   ├── InventoryPage.ts    # 商品列表頁：加購、排序、badge
│   ├── CartPage.ts         # 購物車頁：移除、數量、進結帳
│   └── CheckoutPage.ts     # 結帳流程：填資料、完成訂單
├── tests/
│   ├── e2e/                # UI 測試（SauceDemo）
│   │   ├── login.spec.ts   # TC-01 ~ TC-03
│   │   ├── cart.spec.ts    # TC-04 ~ TC-05
│   │   └── checkout.spec.ts# TC-06 ~ TC-07
│   └── api/                # API 測試（ReqRes.in）
│       └── reqres.spec.ts  # TC-08 ~ TC-10
├── .github/workflows/
│   └── playwright.yml      # CI/CD：測試 → GCS 上傳 → Job Summary 連結
├── Dockerfile              # 容器化執行環境（含 gcloud CLI）
└── entrypoint.sh           # 跑測試 + 上傳 GCS
```

### 資料流向

```
開發者 push → GitHub Actions 觸發
  → npm ci + playwright install chromium
  → npx playwright test（E2E + API）
  → HTML report 生成
  → google-github-actions/auth 認證 GCP
  → upload-cloud-storage 上傳到 GCS
  → Job Summary 顯示公開報告連結
```

---

## 關鍵設計決策

### 1. 為什麼選 SauceDemo + ReqRes.in？

- **SauceDemo**：專為測試自動化設計，有刻意內建的 bug（`problem_user`、`locked_out_user`），讓測試情境更豐富，面試官一看就知道你懂行
- **ReqRes.in**：乾淨的 REST API Mock，支援 GET/POST/PUT/DELETE，穩定不會掛，適合展示 API 測試能力

### 2. 為什麼用 Page Object Model？

- 測試邏輯與 UI 操作分離，UI 改版只需改 POM，測試 spec 不用動
- 可讀性高：`cartPage.proceedToCheckout()` 比 `page.locator('[data-test="checkout"]').click()` 清楚

### 3. 為什麼 CI 只裝 chromium？

- 節省 CI 執行時間和費用（firefox + webkit 增加約 60% 時間）
- 決策：本機開發可跑多瀏覽器，CI 以 chromium 為主確保快速回饋

### 4. 為什麼 GCS 而不是只用 GitHub Artifacts？

- GCS 可設定 public read，產生永久公開連結，直接貼給面試官
- GitHub Artifacts 有期限（14天）且需要登入才能看

### 5. 為什麼保留 GitHub Artifacts 作為備援？

- GCP 認證可能失敗（Secret 設定錯誤、額度問題），備援確保報告不會消失

### 6. 為什麼 continue-on-error: true？

- 測試失敗時仍需要上傳失敗報告，否則失敗原因看不到

---

## 踩過的坑

- SauceDemo 登入頁的 input 沒有 `<label>` 元素，`getByLabel` 找不到 → 改用 `data-test` 屬性選擇器
- macOS 外接硬碟路徑含中文，`git` 指令需要加引號

---

## 如果從零重新設計（架構師視角）

1. **加入 fixtures**：把登入流程抽成 Playwright fixture，避免每個 spec 重複 beforeEach 登入
2. **加入 .env 管理**：帳號密碼不應硬寫在測試檔，用 `dotenv` + GitHub Secrets 管理
3. **加入 Allure Report**：比 Playwright 內建 HTML report 更適合給 PM/非技術成員看
4. **GCP Cloud Run Job**：把 Docker 部署到 Cloud Run Job，定時（cron）執行測試，模擬真實 CI/CD 情境
5. **測試分層**：smoke / regression / performance 三層，CI 只跑 smoke，週期性跑 regression

---

## 變更紀錄

| 日期 | 變更內容 |
|------|----------|
| 2026-03-05 | 初始化專案，建立 Playwright TypeScript 基礎結構 |
| 2026-03-05 | 加入 Docker + entrypoint.sh，支援 GCS 結果上傳 |
| 2026-03-05 | 重構測試目標：從 playwright.dev 改為 SauceDemo + ReqRes.in；新增 10 個 test cases（TC-01 ~ TC-10）；建立完整 POM（InventoryPage、CartPage、CheckoutPage）；更新 GitHub Actions 加入 GCS 公開報告連結 |
