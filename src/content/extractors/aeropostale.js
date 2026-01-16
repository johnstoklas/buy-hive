import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from Aeropostale product pages
 * @param {string} domain - The domain
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractAeropostaleProduct(domain, url, selectors, productData) {
  // Note: Aeropostale selectors are currently empty in site-selector.js
  // This extractor will use heuristics until selectors are defined
  
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
    const imageElement = document.querySelector(selectors.image);
    if (imageElement) {
      const imageUrl = imageElement.src || 
                      imageElement.getAttribute('data-src') || 
                      imageElement.getAttribute('data-lazy-src');
      if (imageUrl && !imageUrl.includes('data:image')) {
        productData.image = imageUrl;
        imageUsedSelector = true;
      }
    }
  }

  // Always use heuristics as fallback (since selectors may be empty)
  if (!productData.name) {
    productData.name = extractProductName();
  }
  if (!productData.price) {
    productData.price = extractPrice();
  }
  if (!productData.image) {
    productData.image = extractProductImage();
  }

  // Validate we got at least some data
  if (!productData.name && !productData.image && !productData.price) {
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: 50,
      indicators: ['Could not extract product information from Aeropostale page']
    };
    throw error;
  }

  // Add confidence scores: 95% for site-specific selectors, 70% for heuristics (lower for Aeropostale since selectors may be empty)
  productData.nameConfidence = nameUsedSelector ? 95 : (productData.name ? 70 : undefined);
  productData.priceConfidence = priceUsedSelector ? 95 : (productData.price ? 70 : undefined);
  productData.imageConfidence = imageUsedSelector ? 95 : (productData.image ? 70 : undefined);

  return productData;
}

