import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from Temu product pages
 * @param {string} domain - The domain
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractTemuProduct(domain, url, selectors, productData) {
  // Guard: Temu doesn't have reliable name selector, so we check price and image
  const hasPriceElement = !!document.querySelector(selectors.price || 'div._1vkz0rqG');
  const hasImageElement = !!document.querySelector(selectors.image || 'img.lazy-image');

  if (!hasPriceElement || !hasImageElement) {
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: 100,
      indicators: ['Missing Temu price or image selectors on this page']
    };
    throw error;
  }

  // Extract product name (Temu doesn't have reliable name selector, use heuristics)
  let nameUsedSelector = false;
  if (selectors.name) {
    const nameElement = document.querySelector(selectors.name);
    if (nameElement) {
      productData.name = nameElement.textContent.trim();
      nameUsedSelector = true;
    }
  }
  // Always fall back to heuristics for name since Temu selector is empty
  if (!productData.name) {
    productData.name = extractProductName();
  }

  // Extract product price
  let priceUsedSelector = false;
  if (selectors.price) {
    const priceElement = document.querySelector(selectors.price);
    if (priceElement) {
      let priceText = priceElement.textContent?.trim() || '';
      const priceMatch = priceText.match(/([$€£¥]\s?\d+(?:[\.,]\d+)?)/);
      if (priceMatch) {
        productData.price = priceMatch[1].trim();
        priceUsedSelector = true;
      } else if (priceText) {
        productData.price = priceText.trim();
        priceUsedSelector = true;
      }
    }
  }

  // Extract product image (Temu uses lazy-loaded images)
  let imageUsedSelector = false;
  if (selectors.image) {
    const imageSelectors = selectors.image.split(',').map(s => s.trim());
    for (const selector of imageSelectors) {
      const imageElements = document.querySelectorAll(selector);
      for (const imageElement of imageElements) {
        // Prioritize data attributes for lazy-loaded images
        let imageUrl = imageElement.getAttribute('data-src') || 
                      imageElement.getAttribute('data-lazy-src') ||
                      imageElement.getAttribute('data-original') ||
                      imageElement.src;
        
        // Filter out placeholder images
        if (imageUrl && 
            !imageUrl.includes('data:image/gif') && 
            !imageUrl.includes('base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')) {
          const rect = imageElement.getBoundingClientRect();
          // Prefer larger images (product images are usually 200x200+)
          if (rect.width >= 200 && rect.height >= 200) {
            productData.image = imageUrl;
            imageUsedSelector = true;
            break;
          }
        }
      }
      if (productData.image) break;
    }
  }

  // Fallback to heuristics if needed
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

