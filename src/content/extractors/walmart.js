import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from Walmart product pages
 * @param {string} domain - The domain
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractWalmartProduct(domain, url, selectors, productData) {
  // Guard: if core Walmart product selectors are missing, treat as NOT_PRODUCT_PAGE
  const hasTitleElement = !!document.querySelector(selectors.name || '#main-title');
  const hasPriceElement = !!document.querySelector(selectors.price || 'span[itemprop="price"]');

  if (!hasTitleElement || !hasPriceElement) {
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: 100,
      indicators: ['Missing Walmart product title or price selectors on this page']
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
    const priceElement = document.querySelector(selectors.price);
    if (priceElement) {
      // Walmart uses itemprop="price" which should contain clean price text
      let priceText = priceElement.textContent?.trim() || priceElement.getAttribute('content') || '';
      if (priceText) {
        // Extract price pattern
        const priceMatch = priceText.match(/([$€£¥]\s?\d+(?:[\.,]\d+)?)/);
        if (priceMatch) {
          productData.price = priceMatch[1].trim();
        } else {
          productData.price = priceText.trim();
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

