import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from Pacsun product pages
 * @param {string} domain - The domain
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractPacsunProduct(domain, url, selectors, productData) {
  // Guard: if core Pacsun product selectors are missing, treat as NOT_PRODUCT_PAGE
  // This is critical - category pages won't have h1.text-product-name
  const hasTitleElement = !!document.querySelector(selectors.name || 'h1.text-product-name');
  const hasPriceElement = !!document.querySelector(selectors.price || 'div.bfx-price-container');

  if (!hasTitleElement || !hasPriceElement) {
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: 100,
      indicators: ['Missing Pacsun product title or price selectors on this page (likely a category page)']
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

