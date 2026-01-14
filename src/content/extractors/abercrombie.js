import { ERROR_TYPES } from '../constants.js';
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage, extractPriceWithDiscountPreference } from '../utils/index.js';

/**
 * Extract product information from Abercrombie product pages
 * @param {string} domain - The domain (e.g., 'abercrombie.com')
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractAbercrombieProduct(domain, url, selectors, productData) {
    // Guard: Verify this is actually a product page
    const hasTitleElement = selectors.name
      ? !!document.querySelector(selectors.name)
      : false;
    const hasPriceElement = selectors.price
      ? !!document.querySelector(selectors.price)
      : false;

    if (!hasTitleElement || !hasPriceElement) {
      const error = {
        type: ERROR_TYPES.NOT_PRODUCT_PAGE,
        message: `This isn't a product page.`,
        domain: domain,
        confidence: 100,
        indicators: ['Abercrombie: missing product title or price selectors']
      };
      throw error;
    }

    // --- Extract Product Name ---
    let nameUsedSelector = false;
    if (selectors.name) {
      // Try main header on main page (sub-item/variant title)
      const mainHeaderElement = document.querySelector('h1.product-title-component.product-title-main-header');
      if (mainHeaderElement) {
        productData.name = mainHeaderElement.textContent.trim();
        nameUsedSelector = true;
      } else {
        // Fallback to regular product title
        const regularTitle = document.querySelector(selectors.name);
        if (regularTitle) {
          productData.name = regularTitle.textContent.trim();
          nameUsedSelector = true;
        }
      }
    }

    // --- Extract Product Price (with Discount Detection) ---
    // Abercrombie displays both original and discount prices
    // Strategy: Prioritize discount price over original price
    if (selectors.price) {
      let priceText = null;
      let isDiscounted = false;
      const priceRegex = /([$€£¥]\s?\d+(?:[\.,]\d+)?)/g; // Global flag to find all prices
      
      // METHOD 1: Try direct discount element first (most reliable)
      // span.product-price-text directly contains the discount price
      const directPriceElement = document.querySelector('span.product-price-text');
      if (directPriceElement) {
        const text = directPriceElement.textContent || directPriceElement.innerText || '';
        priceRegex.lastIndex = 0; // Reset regex for fresh match
        const match = text.match(priceRegex);
        if (match && match[0]) {
          priceText = match[0].trim();
          // Check if there's also an original price nearby to confirm discount
          const priceContainer = directPriceElement.closest('div.product-price-container') || 
                                 document.querySelector('div.product-price-container');
          if (priceContainer) {
            const containerText = priceContainer.textContent || priceContainer.innerText || '';
            priceRegex.lastIndex = 0;
            const allPrices = containerText.match(priceRegex);
            if (allPrices && allPrices.length >= 2) {
              isDiscounted = true; // Multiple prices = discount exists
            }
          }
        }
      }
      
      // METHOD 2: If direct element didn't work, search within price container
      if (!priceText) {
        const priceContainer = document.querySelector(selectors.price);
        if (priceContainer) {
          // Step 2a: Look for element with data-variant="discount" attribute
          const discountElement = priceContainer.querySelector('[data-variant="discount"]');
          if (discountElement) {
            isDiscounted = true;
            let discountText = extractPriceFromElement(discountElement);
            if (!discountText) {
              const text = discountElement.textContent || discountElement.innerText || '';
              priceRegex.lastIndex = 0;
              const match = text.match(priceRegex);
              if (match) {
                discountText = match[0];
              }
            }
            if (discountText && priceRegex.test(discountText)) {
              priceText = discountText.trim();
            }
          }
          
          // Step 2b: If no discount element, check span.product-price-text within container
          if (!priceText) {
            const priceTextElement = priceContainer.querySelector('span.product-price-text');
            if (priceTextElement) {
              const text = priceTextElement.textContent || priceTextElement.innerText || '';
              priceRegex.lastIndex = 0;
              const match = text.match(priceRegex);
              if (match) {
                priceText = match[0].trim();
                // Check wrapper for multiple prices to confirm discount
                const wrapper = priceContainer.querySelector('.product-price-text-wrapper');
                if (wrapper) {
                  const wrapperText = wrapper.textContent || wrapper.innerText || '';
                  priceRegex.lastIndex = 0;
                  const allPrices = wrapperText.match(priceRegex);
                  if (allPrices && allPrices.length >= 2) {
                    isDiscounted = true;
                  }
                }
              }
            }
          }
          
          // Step 2c: Check if price wrapper contains both prices (e.g., "$160\n$136")
          if (!priceText) {
            const priceWrapper = priceContainer.querySelector('.product-price-text-wrapper');
            if (priceWrapper) {
              const wrapperText = priceWrapper.textContent || priceWrapper.innerText || '';
              priceRegex.lastIndex = 0;
              const allPrices = wrapperText.match(priceRegex);
              if (allPrices && allPrices.length >= 2) {
                // Multiple prices found - extract and compare values
                const prices = allPrices.map(p => {
                  const value = parseFloat(p.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
                  return { text: p.trim(), value: value };
                });
                
                // Sort by value (ascending) - discount is usually the lower price
                prices.sort((a, b) => a.value - b.value);
                
                // Use the lower price as discount
                if (prices.length >= 2 && prices[0].value < prices[1].value) {
                  isDiscounted = true;
                  priceText = prices[0].text; // Lower price = discount
                } else {
                  priceText = prices[0].text; // Fallback to first price
                }
              } else if (allPrices && allPrices.length === 1) {
                priceText = allPrices[0].trim();
              }
            }
          }
          
          // Step 2d: Fallback to original price element (if no discount found)
          if (!priceText) {
            const originalElement = priceContainer.querySelector('[data-variant="original"]');
            if (originalElement) {
              let originalText = extractPriceFromElement(originalElement);
              if (!originalText) {
                const text = originalElement.textContent || originalElement.innerText || '';
                priceRegex.lastIndex = 0;
                const match = text.match(priceRegex);
                if (match) {
                  originalText = match[0];
                }
              }
              if (originalText && priceRegex.test(originalText)) {
                priceText = originalText.trim();
              }
            }
          }
          
          // Step 2e: Try wrapper with data-variant="discount" attribute
          if (!priceText) {
            const discountWrapper = priceContainer.querySelector('.product-price-text-wrapper[data-variant="discount"]');
            if (discountWrapper) {
              isDiscounted = true;
              let discountText = extractPriceFromElement(discountWrapper);
              if (!discountText) {
                const text = discountWrapper.textContent || discountWrapper.innerText || '';
                priceRegex.lastIndex = 0;
                const match = text.match(priceRegex);
                if (match) {
                  discountText = match[0];
                }
              }
              if (discountText && priceRegex.test(discountText)) {
                priceText = discountText.trim();
              }
            }
          }
          
          // Step 2f: Final fallback - use generic discount preference function
          if (!priceText) {
            priceText = extractPriceWithDiscountPreference(
              selectors.price,
              'data-variant',
              'discount',
              'original'
            );
            if (priceText && priceContainer.querySelector('[data-variant="discount"]')) {
              isDiscounted = true;
            }
          }
        }
      }
      
      // VALIDATION: If we detected a discount but got a high price, correct it
      // This handles cases where the extraction picked up the original price instead of discount
      if (priceText && isDiscounted) {
        const priceContainer = document.querySelector('div.product-price-container');
        if (priceContainer) {
          const containerText = priceContainer.textContent || priceContainer.innerText || '';
          priceRegex.lastIndex = 0;
          const allPrices = containerText.match(priceRegex);
          if (allPrices && allPrices.length >= 2) {
            const prices = allPrices.map(p => {
              const value = parseFloat(p.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
              return { text: p.trim(), value: value };
            });
            prices.sort((a, b) => a.value - b.value);
            
            // Compare current price with lowest price
            const currentValue = parseFloat(priceText.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
            
            // If current price is higher than the lowest, use the lowest (discount)
            if (prices[0].value < currentValue) {
              priceText = prices[0].text; // Correct to discount price
            }
          }
        }
      }
      
      // Store the extracted price if valid
      let priceUsedSelector = false;
      if (priceText) {
        const priceValue = parseFloat(priceText.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
        if (priceValue >= 0.50 && priceValue <= 100000) {
          productData.price = priceText;
          priceUsedSelector = true;
          if (isDiscounted) {
            productData.isDiscounted = true;
          }
        }
      }
      
      // METHOD 3: If all discount methods failed, try standard extraction
      if (!productData.price) {
        const priceSelectors = selectors.price.split(',').map(s => s.trim());
        const priceRegex = /([$€£¥]\s?\d+(?:[\.,]\d+)?)/;
        
        for (const selector of priceSelectors) {
          const priceElement = document.querySelector(selector);
          if (priceElement) {
            let priceText = extractPriceFromElement(priceElement);
            if (!priceText) {
              priceText = priceElement.textContent || priceElement.innerText;
              if (priceText) {
                priceText = priceText.trim();
                const match = priceText.match(priceRegex);
                if (match) {
                  priceText = match[1];
                }
              }
            }
            
            if (priceText && priceRegex.test(priceText)) {
              const priceValue = parseFloat(priceText.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
              if (priceValue >= 0.50 && priceValue <= 100000) {
                productData.price = priceText.trim();
                priceUsedSelector = true;
                break;
              }
            }
          }
        }
      }
    }

    // --- Extract Product Image ---
    // Filter for large images (product images are typically 200x200px or larger)
    let imageUsedSelector = false;
    if (selectors.image) {
      const images = Array.from(document.querySelectorAll('img'));
      const productImages = images.filter(img => {
        const rect = img.getBoundingClientRect();
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (!src || img.offsetParent === null) return false;
        // Filter for large images (likely product images, not icons)
        return rect.width >= 200 && rect.height >= 200;
      });
      
      // Sort by size (largest first) - biggest image is usually the main product image
      productImages.sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        return (bRect.width * bRect.height) - (aRect.width * aRect.height);
      });
      
      if (productImages.length > 0) {
        const img = productImages[0];
        productData.image = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        imageUsedSelector = true;
      }
    }

    // --- Fallback to Heuristics ---
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