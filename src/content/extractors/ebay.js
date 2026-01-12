import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from eBay product pages
 * @param {string} domain - The domain (e.g., 'ebay.com')
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractEbayProduct(domain, url, selectors, productData) {
  // Guard: Verify this is actually a product page
  // Since detectProductPage() already passed (we wouldn't be here if it didn't),
  // we trust that it's a product page. The selectors might be outdated, but
  // heuristics will handle extraction if selectors don't match.
  // Only do a light check: if selectors don't exist AND heuristics also fail,
  // we'll know during extraction. But don't block here.
  
  // Note: We removed the strict guard because:
  // 1. detectProductPage() already validated it's a product page
  // 2. Selectors might be outdated (eBay changes their HTML frequently)
  // 3. Heuristics can still extract data even if selectors don't match
  // 4. This prevents false negatives on legitimate product pages

  // eBay extraction: Use selectors first, then heuristics as fallback
  
  // --- Extract Product Name ---
  if (selectors.name) {
    const nameElement = document.querySelector(selectors.name);
    if (nameElement) {
      productData.name = nameElement.textContent.trim();
    }
  }

  // --- Extract Product Price ---
  if (selectors.price) {
    const priceSelectors = selectors.price.split(',').map(s => s.trim());
    // Regex to match prices with thousands separators and decimals
    // Handles: $2,250.00 (US format with comma thousands, dot decimals)
    // Pattern: currency + optional space + digits with optional comma thousands + optional dot decimals
    // Examples: "$2,250.00", "$249.99", "$1,234.56"
    // The (?:,\d{3})* part handles thousands separators (e.g., $2,250 or $1,234,567)
    // The (?:\.\d{1,2})? part handles US decimal format (e.g., .00 or .99)
    const priceRegex = /([$€£¥]\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/g;

    // For eBay, prioritize div.x-bin-price__content (main price container with discount info)
    // Collect all price candidates first, then pick the best one
    const priceCandidates = [];

    // Try each price selector (some may match multiple elements)
    for (const selector of priceSelectors) {
      const priceElements = document.querySelectorAll(selector);

      // Check each matching element
      for (const priceElement of priceElements) {
        // Get full text content to check for multiple prices
        const fullText = priceElement.textContent || priceElement.innerText || '';
        
        // Reset regex for fresh match
        priceRegex.lastIndex = 0;
        const allPrices = fullText.match(priceRegex);
        
        let priceText = null;
        let priceValue = null;
        
        if (allPrices && allPrices.length >= 2) {
          // Multiple prices found - extract all, sort, and pick the highest (original price)
          // Example: "US $269.99\n$249.99 with coupon code" -> extract both, pick $269.99
          const prices = allPrices.map(p => {
            // Clean the price text (remove extra spaces, preserve thousands separators in text)
            const cleanPrice = p.trim();
            // Parse value: remove currency symbol, spaces, and thousands separators (commas)
            // Keep decimal point/dot for parsing
            const valueStr = cleanPrice.replace(/[$€£¥\s]/g, '').replace(/,/g, '');
            const value = parseFloat(valueStr);
            return { text: cleanPrice, value: value };
          });
          prices.sort((a, b) => b.value - a.value); // Sort descending (highest first)
          
          // Use the highest price (original price, ignore discount)
          priceText = prices[0].text;
          priceValue = prices[0].value;
        } else if (allPrices && allPrices.length === 1) {
          // Single price found - preserve the full price string as-is
          priceText = allPrices[0].trim();
          // Parse value: remove currency symbol, spaces, and thousands separators for calculation
          const valueStr = priceText.replace(/[$€£¥\s]/g, '').replace(/,/g, '');
          priceValue = parseFloat(valueStr);
        } else {
          // No prices found in text, try superscript extraction
          priceText = extractPriceFromElement(priceElement);
          if (priceText) {
            // Reset regex for validation
            priceRegex.lastIndex = 0;
            if (priceRegex.test(priceText)) {
              priceValue = parseFloat(priceText.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
            } else {
              priceText = null;
            }
          }
        }

        // Validate price is reasonable and add to candidates
        if (priceText && priceValue !== null) {
          // Ensure we have the full price with decimals
          // Check if price ends with a decimal point (might be split format)
          if (priceText.endsWith('.')) {
            // Look for decimal part in nearby elements (eBay might split like Amazon)
            const parent = priceElement.parentElement;
            if (parent) {
              const siblingText = parent.textContent || parent.innerText || '';
              priceRegex.lastIndex = 0;
              const siblingPrices = siblingText.match(priceRegex);
              if (siblingPrices && siblingPrices.length > 0) {
                // Find the price that starts with our price
                const completePrice = siblingPrices.find(p => p.startsWith(priceText));
                if (completePrice && completePrice.includes('.')) {
                  priceText = completePrice;
                  priceValue = parseFloat(priceText.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
                }
              }
            }
          }
          
          // Validate price is in reasonable range (not shipping, not error)
          if (priceValue >= 0.5 && priceValue <= 100000) {
            // Score this candidate:
            // - Higher score = better candidate
            // - Prioritize div.x-bin-price__content (main price container)
            // - Prioritize higher prices (main product vs. shipping/related items)
            let score = 0;
            
            // Check if this element is the main eBay price container
            // Prioritize div.x-price-primary (most reliable) and div.x-bin-price__content
            const isMainPriceContainer = priceElement.classList.contains('x-price-primary') ||
                                        priceElement.closest('.x-price-primary') !== null ||
                                        (priceElement.tagName === 'DIV' && priceElement.className.includes('x-price-primary')) ||
                                        selector === 'div.x-price-primary' ||
                                        selector.includes('x-price-primary') ||
                                        priceElement.classList.contains('x-bin-price__content') ||
                                        priceElement.closest('.x-bin-price__content') !== null ||
                                        (priceElement.tagName === 'DIV' && priceElement.className.includes('x-bin-price__content')) ||
                                        selector === 'div.x-bin-price__content' ||
                                        selector.includes('x-bin-price__content');
            
            if (isMainPriceContainer) {
              // Extra boost for x-price-primary (the most reliable selector)
              if (priceElement.classList.contains('x-price-primary') || 
                  priceElement.closest('.x-price-primary') !== null ||
                  selector === 'div.x-price-primary' ||
                  selector.includes('x-price-primary')) {
                score += 200000; // Highest priority for x-price-primary
              } else {
                score += 100000; // High priority for x-bin-price__content
              }
            }
            // Prefer prices in reasonable product range ($50-$1000) over very low prices
            if (priceValue >= 50 && priceValue <= 1000) {
              score += 20000; // Strong boost for typical product prices
            }
            // Penalize very low prices (likely shipping or related items)
            if (priceValue < 30) {
              score -= 50000; // Heavy penalty for very low prices
            }
            score += priceValue * 100; // Prefer higher prices (main product vs. $20 shipping)
            
            priceCandidates.push({
              text: priceText.trim(),
              value: priceValue,
              score: score,
              selector: selector
            });
          }
        }
      }
    }

    // Sort candidates by score (highest = best) and use the best one
    if (priceCandidates.length > 0) {
      priceCandidates.sort((a, b) => b.score - a.score);
      const bestCandidate = priceCandidates[0];
      productData.price = bestCandidate.text;
    }
  }

  // --- Extract Product Image ---
  if (selectors.image) {
    const imageSelectors = selectors.image.split(',').map(s => s.trim());
    for (const selector of imageSelectors) {
      const imageElement = document.querySelector(selector);
      if (imageElement) {
        let imageUrl =
          imageElement.src ||
          imageElement.getAttribute('data-src') ||
          imageElement.getAttribute('data-lazy-src') ||
          imageElement.getAttribute('data-old-src');
        if (imageUrl) {
          productData.image = imageUrl;
          break;
        }
      }
    }
  }

  // --- Fallback to Heuristics ---
  if (!productData.name) {
    productData.name = extractProductName();
  }
  if (!productData.price) {
    // For sites without specific logic, try selectors first, then heuristics
    if (selectors.price) {
      const priceSelectors = selectors.price.split(',').map(s => s.trim());
      // Match full price with decimals - ensure we capture .99, .00, etc.
      // Pattern: currency + optional space + digits + optional decimal point + 1-2 digits
      const priceRegex = /([$€£¥]\s?\d+\.\d{1,2}|[$€£¥]\s?\d+)/g; // Prioritize prices with decimals first
      
      // Collect all price candidates from all matching elements
      const priceCandidates = [];
      
      for (const selector of priceSelectors) {
        const priceElements = document.querySelectorAll(selector);
        
        for (const priceElement of priceElements) {
          const fullText = priceElement.textContent || priceElement.innerText || '';
          
          // Skip if text is too short or doesn't look like a price
          if (!fullText || fullText.trim().length < 3) continue;
          
          // Reset regex
          priceRegex.lastIndex = 0;
          const matches = fullText.match(priceRegex);
          
          if (matches && matches.length > 0) {
            // For each match, score it and add to candidates
            matches.forEach(match => {
              const priceText = match.trim();
              const priceValue = parseFloat(priceText.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
              
              // Validate price is reasonable
              if (priceValue >= 0.5 && priceValue <= 100000) {
                // Score: prioritize prices with decimals, then by value (higher = better for product prices)
                let score = 0;
                const hasDecimal = /\.\d{1,2}$/.test(priceText);
                
                if (hasDecimal) {
                  score += 1000; // Big boost for prices with decimals
                }
                
                // Prefer prices in reasonable product range
                if (priceValue >= 5 && priceValue <= 1000) {
                  score += 500;
                }
                
                // Prefer longer price strings (more complete)
                score += priceText.length * 10;
                
                priceCandidates.push({
                  text: priceText,
                  value: priceValue,
                  score: score
                });
              }
            });
          }
        }
      }
      
      // Sort candidates by score (highest = best) and use the best one
      if (priceCandidates.length > 0) {
        priceCandidates.sort((a, b) => b.score - a.score);
        productData.price = priceCandidates[0].text;
      }
    }
    
    // If still no price, use heuristic function
    if (!productData.price) {
      productData.price = extractPrice();
    }
  }
  if (!productData.image) {
    productData.image = extractProductImage();
  }

  return productData;
}
