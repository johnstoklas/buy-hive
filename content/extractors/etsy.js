import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from Etsy product pages
 * @param {string} domain - The domain
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractEtsyProduct(domain, url, selectors, productData) {
  // Guard: if core Etsy product selectors are missing, treat as NOT_PRODUCT_PAGE
  const hasTitleElement = !!document.querySelector(selectors.name || 'h1.wt-line-height-tight');
  const hasPriceElement = !!document.querySelector(selectors.price || '.wt-screen-reader-only');

  if (!hasTitleElement || !hasPriceElement) {
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: 100,
      indicators: ['Missing Etsy product title or price selectors on this page']
    };
    throw error;
  }

  // Extract product name
  if (selectors.name) {
    const nameElement = document.querySelector(selectors.name);
    if (nameElement) {
      productData.name = nameElement.textContent.trim();
    }
  }

  // Extract product price
  if (selectors.price) {
    const priceSelectors = selectors.price.split(',').map(s => s.trim());
    for (const selector of priceSelectors) {
      // For Etsy, div.wt-display-flex-xs might match multiple elements
      // Find the one that contains "Price:" text
      const allPriceElements = document.querySelectorAll(selector);
      let priceElement = null;
      
      // Try to find the element that contains "Price:" label
      for (const el of allPriceElements) {
        const text = el.textContent?.trim() || '';
        if (text.toLowerCase().includes('price:') || text.toLowerCase().includes('price')) {
          priceElement = el;
          break;
        }
      }
      
      // If no element with "Price:" found, use the first one
      if (!priceElement && allPriceElements.length > 0) {
        priceElement = allPriceElements[0];
      }
      
      if (priceElement) {
        let priceText = priceElement.textContent?.trim() || 
                       priceElement.getAttribute('aria-label') || '';
        if (priceText) {
          // Extract price - look for pattern like "Price: $1.50" or just "$1.50"
          const priceMatch = priceText.match(/(?:price:?\s*)?([$€£¥]\s?\d+(?:[\.,]\d+)?)/i);
          if (priceMatch) {
            productData.price = priceMatch[1].trim();
            break;
          }
        }
      }
    }
  }

  // Extract product image
  if (selectors.image) {
    const imageElement = document.querySelector(selectors.image);
    if (imageElement) {
      const imageUrl = imageElement.src || 
                      imageElement.getAttribute('data-src') || 
                      imageElement.getAttribute('data-lazy-src');
      if (imageUrl && !imageUrl.includes('data:image')) {
        productData.image = imageUrl;
      }
    }
  }

  // Fallback to heuristics if needed
  if (!productData.name) {
    productData.name = extractProductName();
  }
  if (!productData.price) {
    productData.price = extractPrice();
  }
  if (!productData.image) {
    productData.image = extractProductImage();
  }

  return productData;
}

