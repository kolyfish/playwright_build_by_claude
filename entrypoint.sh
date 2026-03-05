#!/bin/bash
set -e

echo "=== Running Playwright tests ==="
npx playwright test --reporter=html,list || TEST_EXIT_CODE=$?

echo "=== Test run complete ==="

# Upload results to GCS if bucket is specified
if [ -n "$GCS_BUCKET" ]; then
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    GCS_PATH="gs://${GCS_BUCKET}/playwright-results/${TIMESTAMP}"

    echo "=== Uploading results to ${GCS_PATH} ==="

    if [ -d "playwright-report" ]; then
        gsutil -m cp -r playwright-report "${GCS_PATH}/html-report"
        echo "HTML report uploaded to ${GCS_PATH}/html-report"
    fi

    if [ -d "test-results" ]; then
        gsutil -m cp -r test-results "${GCS_PATH}/test-results"
        echo "Test artifacts uploaded to ${GCS_PATH}/test-results"
    fi

    echo "=== Upload complete ==="
    echo "View report: https://storage.googleapis.com/${GCS_BUCKET}/playwright-results/${TIMESTAMP}/html-report/index.html"
else
    echo "GCS_BUCKET not set, skipping upload"
fi

exit ${TEST_EXIT_CODE:-0}
