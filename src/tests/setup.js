/**
 * Test setup for content script extractors
 * Uses Puppeteer to load pages and test extractors in browser context
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * Load and inject content script into page
 */
async function injectContentScript(page) {
  // Read the bundled content script
  const contentScriptPath = path.resolve(__dirname, '../dist/content/index.bundle.js');
  
  if (!fs.existsSync(contentScriptPath)) {
    throw new Error(`Content script not found at ${contentScriptPath}. Please run 'npm run build' first.`);
  }
  
  const contentScript = fs.readFileSync(contentScriptPath, 'utf-8');
  
  // Enable testing mode
  await page.evaluateOnNewDocument(() => {
    window.ENABLE_TESTING = true;
  });
  
  // Inject the script
  await page.evaluateOnNewDocument(contentScript);
}

/**
 * Wait for page to be ready
 */
async function waitForPageReady(page) {
  await page.waitForFunction(() => {
    return document.readyState === 'complete';
  }, { timeout: 10000 });
  
  // Wait a bit more for dynamic content
  await page.waitForTimeout(2000);
}

/**
 * Test extractor on a URL
 */
async function testExtractor(url, expectedToSucceed = true) {
  const browser = await puppeteer.launch({
    headless: "new", // Use new headless mode (fixes deprecation warning)
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 60000 // Add 60 second timeout for browser launch
  });
  
  try {
    const page = await browser.newPage();
    
    // Set a reasonable viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to the page
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for page to be ready
    await waitForPageReady(page);
    
    // Inject content script
    await injectContentScript(page);
    
    // Wait a bit for script to initialize
    await page.waitForTimeout(1000);
    
    // Wait for extractProductInfo to be available
    await page.waitForFunction(() => window.extractProductInfo !== undefined, { timeout: 5000 });
    
    // Call extractProductInfo function
    const result = await page.evaluate(async () => {
      if (window.extractProductInfo) {
        try {
          return await window.extractProductInfo();
        } catch (error) {
          return {
            error: true,
            message: error.message,
            type: error.type || 'UNKNOWN_ERROR'
          };
        }
      }
      return { error: true, message: 'extractProductInfo not found' };
    });
    
    await browser.close();
    
    return {
      success: !result.error,
      data: result.error ? null : result,
      error: result.error ? result : null,
      url: url
    };
  } catch (error) {
    await browser.close();
    return {
      success: false,
      data: null,
      error: { message: error.message, type: 'TEST_ERROR' },
      url: url
    };
  }
}

/**
 * Test product page detection
 */
async function testProductPageDetection(url, expectedIsProductPage = true) {
  const browser = await puppeteer.launch({
    headless: "new", // Use new headless mode (fixes deprecation warning)
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 60000 // Add 60 second timeout for browser launch
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    await waitForPageReady(page);
    await injectContentScript(page);
    await page.waitForTimeout(1000);
    
    // Wait for detectProductPage to be available
    await page.waitForFunction(() => window.detectProductPage !== undefined, { timeout: 5000 });
    
    const result = await page.evaluate(async () => {
      if (window.detectProductPage) {
        return window.detectProductPage();
      }
      return { error: true, message: 'detectProductPage not found' };
    });
    
    await browser.close();
    
    return {
      success: !result.error && result.isProductPage === expectedIsProductPage,
      isProductPage: result.isProductPage,
      expectedIsProductPage: expectedIsProductPage,
      confidence: result.confidence,
      url: url
    };
  } catch (error) {
    await browser.close();
    return {
      success: false,
      isProductPage: null,
      expectedIsProductPage: expectedIsProductPage,
      error: error.message,
      url: url
    };
  }
}

module.exports = {
  testExtractor,
  testProductPageDetection
};
