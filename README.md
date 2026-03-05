# Playwright Automation Test Project

![CI](https://github.com/kolyfish/playwright_build_by_claude/actions/workflows/playwright.yml/badge.svg)

A professional Playwright + TypeScript end-to-end and API automation testing project, built with Page Object Model (POM) architecture and integrated with Google Cloud Storage for test report hosting.

---

## Tech Stack

- **[Playwright](https://playwright.dev/)** — Cross-browser automation framework
- **TypeScript** — Type-safe test development
- **Google Cloud Storage** — Remote test report hosting
- **GitHub Actions** — CI/CD pipeline

---

## Project Structure

```
playwright-demo/
├── pages/                          # Page Object Model
│   ├── BasePage.ts                 # Base class (navigate, screenshot, wait)
│   └── LoginPage.ts                # SauceDemo login page
├── tests/
│   ├── e2e/                        # End-to-End UI tests
│   │   └── playwright-website.spec.ts
│   └── api/                        # API tests
│       └── jsonplaceholder.spec.ts
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD + GCS report upload
├── playwright.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Git

### Installation

```bash
git clone https://github.com/kolyfish/playwright_build_by_claude.git
cd playwright_build_by_claude
npm install
npx playwright install chromium
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests |
| `npm run test:e2e` | Run E2E tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Run in debug mode |
| `npm run report` | Open last HTML report |

---

## Test Coverage

### E2E Tests — [SauceDemo](https://www.saucedemo.com)
- Page title validation
- Navigation flow
- Login page POM interaction

### API Tests — [JSONPlaceholder](https://jsonplaceholder.typicode.com)
- `GET /posts` — list all posts
- `GET /posts/1` — single post with schema validation
- `POST /posts` — create new post
- `GET /posts/999` — 404 error handling

---

## CI/CD Pipeline

Every push to `main` or `develop` triggers the GitHub Actions workflow:

1. Install dependencies & Playwright browsers (Chromium)
2. Run all tests
3. Authenticate with Google Cloud (via `GCP_SA_KEY` secret)
4. Upload HTML report to Google Cloud Storage
5. Output public report URL to GitHub Job Summary
6. Backup report to GitHub Artifacts (14-day retention)

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `GCP_SA_KEY` | Google Cloud Service Account key (JSON) |
| `GCS_BUCKET` | GCS bucket name for report storage |

### Viewing Test Reports

After each CI run, the report URL appears in the GitHub Actions **Job Summary**:

```
https://storage.googleapis.com/playwright-side-project-reports/playwright-results/{run_id}/playwright-report/index.html
```

---

## Architecture

```
tests/
├── e2e/     →  uses pages/ (POM)  →  Chrome (baseURL: saucedemo.com)
└── api/     →  direct API calls   →  no browser needed
```

- **BasePage** provides shared utilities for all page objects
- **testIgnore** excludes macOS `._*` resource fork files
- **Trace & screenshot** collected automatically on test failure

---

## Author

Built with [Claude Code](https://claude.ai/claude-code) by Anthropic
