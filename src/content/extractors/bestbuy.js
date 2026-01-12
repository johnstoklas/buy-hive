import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from Best Buy product pages
 * @param {string} domain - The domain
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractBestBuyProduct(domain, url, selectors, productData) {
  // Guard: if core Best Buy product selectors are missing, treat as NOT_PRODUCT_PAGE
  const hasTitleElement = !!document.querySelector(selectors.name || 'h1.h4');
  const hasPriceElement = !!document.querySelector(selectors.price || 'div.price-container');

  if (!hasTitleElement || !hasPriceElement) {
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: 100,
      indicators: ['Missing Best Buy product title or price selectors on this page']
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
      const priceElement = document.querySelector(selector);
      if (priceElement) {
        let priceText = extractPriceFromElement(priceElement);
        if (!priceText) {
          priceText = priceElement.textContent?.trim() || '';
          const priceMatch = priceText.match(/([$€£¥]\s?\d+(?:[\.,]\d+)?)/);
          if (priceMatch) {
            priceText = priceMatch[1];
          }
        }
        if (priceText) {
          productData.price = priceText.trim();
          break;
        }
      }
    }
  }

  // Extract product image
  if (selectors.image) {
    const imageSelectors = selectors.image.split(',').map(s => s.trim());
    for (const selector of imageSelectors) {
      const imageElement = document.querySelector(selector);
      if (imageElement) {
        const imageUrl = imageElement.src || 
                        imageElement.getAttribute('data-src') || 
                        imageElement.getAttribute('data-lazy-src');
        if (imageUrl && !imageUrl.includes('data:image')) {
          productData.image = imageUrl;
          break;
        }
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

