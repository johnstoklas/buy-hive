import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from Target product pages
 * @param {string} domain - The domain
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractTargetProduct(domain, url, selectors, productData) {
  // Guard: if core Target product selectors are missing, treat as NOT_PRODUCT_PAGE
  const hasTitleElement = !!document.querySelector(selectors.name || '#pdp-product-title-id');
  const hasPriceElement = !!document.querySelector(selectors.price || 'div.styles_priceFullLineHeight__BgU9C');

  if (!hasTitleElement || !hasPriceElement) {
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: 100,
      indicators: ['Missing Target product title or price selectors on this page']
    };
    throw error;
  }

  // Extract product name
  let nameUsedSelector = false;
  if (selectors.name) {
    const nameElement = document.querySelector(selectors.name);
    if (nameElement) {
      productData.name = nameElement.textContent.trim();
      nameUsedSelector = true;
    }
  }

  // Extract product price
  let priceUsedSelector = false;
  if (selectors.price) {
    const priceElement = document.querySelector(selectors.price);
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
        priceUsedSelector = true;
      }
    }
  }

  // Extract product image
  let imageUsedSelector = false;
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
          imageUsedSelector = true;
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

  // Add confidence scores: 95% for site-specific selectors, 75% for heuristics
  productData.nameConfidence = nameUsedSelector ? 95 : (productData.name ? 75 : undefined);
  productData.priceConfidence = priceUsedSelector ? 95 : (productData.price ? 75 : undefined);
  productData.imageConfidence = imageUsedSelector ? 95 : (productData.image ? 75 : undefined);

  return productData;
}

