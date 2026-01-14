import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from Amazon product pages
 * @param {string} domain - The domain (e.g., 'amazon.com')
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractAmazonProduct(domain, url, selectors, productData) {
  // Guard: if core Amazon product selectors are missing, treat as NOT_PRODUCT_PAGE
  const hasTitleElement = !!document.querySelector(selectors.name || '#productTitle');
  let hasPriceElement = false;
  if (selectors.price) {
    const priceSelectorsForCheck = selectors.price.split(',').map(s => s.trim());
    hasPriceElement = priceSelectorsForCheck.some(sel => document.querySelector(sel));
  }

  if (!hasTitleElement || !hasPriceElement) {
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: 100,
      indicators: ['Missing Amazon product title or price selectors on this page']
    };
    throw error;
  }

  // For Amazon, try specific selectors first (more reliable)
  // Extract product name
  let nameUsedSelector = false;
  if (selectors.name) {
    const nameElement = document.querySelector(selectors.name);
    if (nameElement) {
      productData.name = nameElement.textContent.trim();
      nameUsedSelector = true;
    }
  }
  
  // --- Extract Product Price ---
  let priceUsedSelector = false;
  if (selectors.price) {
    const priceSelectors = selectors.price.split(',').map(s => s.trim()); // Handle multiple selectors
    const priceRegex = /([$€£¥]\s?\d+(?:[\.,]\d+)?)/; // Match currency + number with optional decimals
    
    // Try each price selector until we find a valid price
    for (const selector of priceSelectors) {
      const priceElement = document.querySelector(selector);
      if (priceElement) {
        // Step 1: Try to extract price with superscript handling (e.g., "$29<sup>99</sup>" -> "$29.99")
        let priceText = extractPriceFromElement(priceElement);
        
        // Step 2: If superscript extraction didn't work, try traditional text extraction
        if (!priceText) {
          // Get full text content (handles prices split across child elements)
          priceText = priceElement.textContent || priceElement.innerText;
          if (!priceText || priceText.trim() === '') {
            // Fallback to aria-label or title attribute
            priceText = priceElement.getAttribute('aria-label') || priceElement.title;
          }
          
          if (priceText) {
            priceText = priceText.trim();
            
            // Use regex to extract the full price pattern (ensures we get decimals)
            const priceMatch = priceText.match(priceRegex);
            if (priceMatch) {
              priceText = priceMatch[1];
            } else {
              // Fallback: clean up common prefixes/suffixes
              priceText = priceText.replace(/^\s*Price:\s*/i, '');
              priceText = priceText.replace(/\s*each\s*$/i, '');
            }
          }
        }
        
        // Step 3: Amazon-specific - Check for split price format
        // Amazon sometimes splits price: main digits in one element, cents in .a-price-fraction
        // Example: "$39" + "95" (in separate elements) = "$39.95"
        // Or: "$39." + "95" = "$39.95"
        if (priceText && priceText.trim()) {
          // Always check for .a-price-fraction element (Amazon's cents element)
          // This handles both "$39" and "$39." cases
          const parentPrice = priceElement.closest('.a-price');
          if (parentPrice) {
            const fractionElement = parentPrice.querySelector('.a-price-fraction');
            if (fractionElement) {
              const fraction = fractionElement.textContent?.trim() || '';
              if (fraction) {
                // Check if price already has a decimal point
                if (priceText.endsWith('.')) {
                  // Combine: "$39." + "95" = "$39.95"
                  priceText = priceText + fraction;
                } else if (!priceText.includes('.')) {
                  // Combine: "$39" + "95" = "$39.95"
                  priceText = priceText + '.' + fraction;
                }
              }
            }
          }
          
          // If we found a price, use it and stop searching
          if (priceText && priceText.trim()) {
            productData.price = priceText.trim();
            priceUsedSelector = true;
            break;
          }
        }
      }
    }
  }
  
  // --- Extract Product Image ---
  let imageUsedSelector = false;
  if (selectors.image) {
    const imageSelectors = selectors.image.split(',').map(s => s.trim());
    
    for (const selector of imageSelectors) {
      const imageElement = document.querySelector(selector);
      if (imageElement) {
        // Try multiple attributes for lazy-loaded images
        let imageUrl = imageElement.src || 
                      imageElement.getAttribute('data-src') || 
                      imageElement.getAttribute('data-lazy-src') ||
                      imageElement.getAttribute('data-old-src');
        
        // Amazon-specific: Handle dynamic image data attribute
        // Amazon stores image URLs in a JSON object in data-a-dynamic-image
        if (!imageUrl && imageElement.hasAttribute('data-a-dynamic-image')) {
          try {
            const dynamicImage = JSON.parse(imageElement.getAttribute('data-a-dynamic-image'));
            const imageKeys = Object.keys(dynamicImage);
            if (imageKeys.length > 0) {
              imageUrl = imageKeys[0]; // Use the first (usually largest) image
            }
          } catch (e) {
            console.warn('Failed to parse Amazon dynamic image data:', e);
          }
        }
        
        if (imageUrl) {
          productData.image = imageUrl;
          imageUsedSelector = true;
          break; // Found image, stop searching
        }
      }
    }
  }
  
  // --- Fallback to Heuristics ---
  // If site-specific selectors didn't work, use heuristic functions
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

