/**
 * Tests for all extractors
 * Tests product extraction on real URLs
 */

const { testExtractor, testProductPageDetection } = require('./setup.js');
const { TEST_URLS, EXPECTED_RESULTS } = require('./test-data.js');

// Helper to check if result has required fields
function validateResult(result, expected) {
  if (!result.success || !result.data) {
    return { valid: false, reason: 'Extraction failed' };
  }
  
  const data = result.data;
  const hasName = !!data.name && data.name.trim().length > 0;
  const hasPrice = !!data.price && data.price.trim().length > 0;
  const hasImage = !!data.image && data.image.trim().length > 0;
  
  // Check required fields
  for (const field of expected.shouldHave) {
    if (field === 'name' && !hasName) {
      return { valid: false, reason: 'Missing product name' };
    }
    if (field === 'price' && !hasPrice) {
      return { valid: false, reason: 'Missing product price' };
    }
    if (field === 'image' && !hasImage) {
      return { valid: false, reason: 'Missing product image' };
    }
  }
  
  // For generic extractor, at least one field should be present
  if (expected.shouldHave.length === 0) {
    if (!hasName && !hasPrice && !hasImage) {
      return { valid: false, reason: 'No product data extracted' };
    }
  }
  
  return { valid: true };
}

describe('Product Page Detection', () => {
  // Test Amazon product pages
  describe('Amazon', () => {
    TEST_URLS.amazon.product.forEach((url, index) => {
      test(`should detect product page: ${url}`, async () => {
        const result = await testProductPageDetection(url, true);
        expect(result.success).toBe(true);
        expect(result.isProductPage).toBe(true);
        expect(result.confidence).toBeGreaterThanOrEqual(70);
      }, 60000); // 60 second timeout
    });
    
    TEST_URLS.amazon.nonProduct.forEach((url, index) => {
      test(`should NOT detect product page: ${url}`, async () => {
        const result = await testProductPageDetection(url, false);
        expect(result.success).toBe(true);
        expect(result.isProductPage).toBe(false);
      }, 60000);
    });
  });
  
  // Test Pacsun (to catch category pages)
  describe('Pacsun', () => {
    TEST_URLS.pacsun.product.forEach((url, index) => {
      test(`should detect product page: ${url}`, async () => {
        const result = await testProductPageDetection(url, true);
        expect(result.success).toBe(true);
        expect(result.isProductPage).toBe(true);
      }, 60000);
    });
    
    TEST_URLS.pacsun.nonProduct.forEach((url, index) => {
      test(`should NOT detect category page: ${url}`, async () => {
        const result = await testProductPageDetection(url, false);
        expect(result.success).toBe(true);
        expect(result.isProductPage).toBe(false);
      }, 60000);
    });
  });
});

describe('Product Extraction', () => {
  // Test Amazon extractor
  describe('Amazon Extractor', () => {
    TEST_URLS.amazon.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.amazon);
        expect(validation.valid).toBe(true);
        
        // Verify extracted data
        if (result.data) {
          expect(result.data.name).toBeTruthy();
          expect(result.data.price).toBeTruthy();
          expect(result.data.site).toBe('amazon.com');
        }
      }, 60000);
    });
  });
  
  // Test eBay extractor
  describe('eBay Extractor', () => {
    TEST_URLS.ebay.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.ebay);
        expect(validation.valid).toBe(true);
      }, 60000);
    });
  });
  
  // Test Walmart extractor
  describe('Walmart Extractor', () => {
    TEST_URLS.walmart.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.walmart);
        expect(validation.valid).toBe(true);
      }, 60000);
    });
  });
  
  // Test Target extractor
  describe('Target Extractor', () => {
    TEST_URLS.target.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.target);
        expect(validation.valid).toBe(true);
      }, 60000);
    });
  });
  
  // Test Best Buy extractor
  describe('Best Buy Extractor', () => {
    TEST_URLS.bestbuy.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.bestbuy);
        expect(validation.valid).toBe(true);
      }, 60000);
    });
  });
  
  // Test Etsy extractor
  describe('Etsy Extractor', () => {
    TEST_URLS.etsy.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.etsy);
        expect(validation.valid).toBe(true);
      }, 60000);
    });
  });
  
  // Test Temu extractor
  describe('Temu Extractor', () => {
    TEST_URLS.temu.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.temu);
        expect(validation.valid).toBe(true);
      }, 60000);
    });
  });
  
  // Test Pacsun extractor
  describe('Pacsun Extractor', () => {
    TEST_URLS.pacsun.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.pacsun);
        expect(validation.valid).toBe(true);
      }, 60000);
    });
    
    // Test that category pages fail
    TEST_URLS.pacsun.nonProduct.forEach((url, index) => {
      test(`should fail on category page: ${url}`, async () => {
        const result = await testExtractor(url, false);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error.type).toBe('NOT_PRODUCT_PAGE');
      }, 60000);
    });
  });
  
  // Test Abercrombie extractor
  describe('Abercrombie Extractor', () => {
    TEST_URLS.abercrombie.product.forEach((url, index) => {
      test(`should extract product from: ${url}`, async () => {
        const result = await testExtractor(url, true);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        const validation = validateResult(result, EXPECTED_RESULTS.abercrombie);
        expect(validation.valid).toBe(true);
      }, 60000);
    });
  });
});

describe('Error Handling', () => {
  test('should reject non-product pages', async () => {
    const nonProductUrls = [
      ...TEST_URLS.amazon.nonProduct,
      ...TEST_URLS.pacsun.nonProduct,
    ];
    
    for (const url of nonProductUrls.slice(0, 2)) { // Test first 2 to save time
      const result = await testExtractor(url, false);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.type).toBe('NOT_PRODUCT_PAGE');
    }
  }, 120000);
});

