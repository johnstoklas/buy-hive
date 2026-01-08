# Extractor Tests

This directory contains tests for all product extractors.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```
   This creates the bundled content script that tests will use.

3. **Update test URLs:**
   Edit `test-data.js` and replace the example URLs with real product URLs you want to test.

## Running Tests

```bash
# Run all tests
npm test

# Run only extractor tests
npm run test:extractors

# Run tests in watch mode
npm run test:watch
```

## Test Structure

- **`test-data.js`**: Contains test URLs (product pages and non-product pages) and expected results
- **`setup.js`**: Test utilities using Puppeteer to load pages and test extractors
- **`extractors.test.js`**: Test cases for all extractors

## Adding Test URLs

Edit `tests/test-data.js` and add real URLs:

```javascript
amazon: {
  product: [
    'https://www.amazon.com/dp/B08N5WRWNW', // Real product URL
  ],
  nonProduct: [
    'https://www.amazon.com/s?k=laptop', // Real search results URL
  ]
}
```

## What Gets Tested

1. **Product Page Detection**: Tests that product pages are correctly identified
2. **Non-Product Page Detection**: Tests that category/search pages are rejected
3. **Product Extraction**: Tests that extractors successfully extract name, price, and image
4. **Error Handling**: Tests that non-product pages throw appropriate errors

## Notes

- Tests use Puppeteer to load real web pages
- Tests require internet connection
- Tests may take 1-2 minutes to run (due to page loading)
- Make sure to run `npm run build` before testing to ensure the bundled script is up to date

