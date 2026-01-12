import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage } from '../utils/index.js';

/**
 * Extract product information from generic product pages (Best Buy, Target, Temu, etc.)
 * @param {string} domain - The domain
 * @param {string} url - The page URL
 * @param {Object} selectors - Site-specific selectors
 * @param {Object} productData - Product data object to populate
 * @returns {Object} - Product data object with name, price, image
 */
export function extractGenericProduct(domain, url, selectors, productData) {
  // For other sites (Best Buy, Target, Temu, etc.), use generic extraction:
  // 1. Try site-specific selectors first
  // 2. Fall back to heuristic functions if selectors don't work
  
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
    // Use global regex to find all price matches, prioritize ones with decimals
    const priceRegex = /([$€£¥]\s?\d+\.\d{1,2}|[$€£¥]\s?\d+)/g;
      
    // Collect all price candidates from all matching elements
    const priceCandidates = [];
      
    // Try each price selector (some sites have multiple fallback selectors)
    for (const selector of priceSelectors) {
      // Some selectors may match multiple elements (e.g., multiple prices on page)
      const priceElements = document.querySelectorAll(selector);
        
      // Check each matching element
      for (const priceElement of priceElements) {
        const fullText = priceElement.textContent || priceElement.innerText || '';
          
        // Skip if text is too short
        if (!fullText || fullText.trim().length < 3) continue;
          
        // Reset regex and find all price matches
        priceRegex.lastIndex = 0;
        const matches = fullText.match(priceRegex);
          
        if (matches && matches.length > 0) {
          // For each match, score it and add to candidates
          matches.forEach(match => {
            const priceText = match.trim();
            const priceValue = parseFloat(priceText.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
              
            // Validate price is reasonable
            if (priceValue >= 0.5 && priceValue <= 100000) {
              // Score: prioritize prices with decimals, then by value
              let score = 0;
              const hasDecimal = /\.\d{1,2}$/.test(priceText);
                
              if (hasDecimal) {
                score += 10000; // Very large boost for prices with decimals
              }
                
              // Prefer prices in reasonable product range
              if (priceValue >= 5 && priceValue <= 1000) {
                score += 5000;
              }
                
              // Prefer longer price strings (more complete)
              score += priceText.length * 100;
                
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
    
  // --- Extract Product Image ---
  if (selectors.image) {
    const imageSelectors = selectors.image.split(',').map(s => s.trim());
    for (const selector of imageSelectors) {
      // Use querySelectorAll to get ALL matching images, not just the first one
      const imageElements = document.querySelectorAll(selector);
        
      if (imageElements.length > 0) {
        // Collect all valid image candidates
        const imageCandidates = [];
          
        for (const imageElement of imageElements) {
          // Check data attributes FIRST (for lazy-loaded images like Temu)
          // Then fall back to src (for sites that load images normally)
          let imageUrl = imageElement.getAttribute('data-src') || 
                        imageElement.getAttribute('data-lazy-src') ||
                        imageElement.getAttribute('data-original') ||
                        imageElement.getAttribute('data-old-src') ||
                        imageElement.getAttribute('data-url') ||
                        imageElement.src; // Fallback to src
            
          // Filter out known placeholder images
          if (imageUrl) {
            // Skip the common 1x1 transparent GIF placeholder
            const isPlaceholder = imageUrl.includes('base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==') ||
                                  (imageUrl.startsWith('data:image/gif') && imageUrl.length < 100);
              
            if (isPlaceholder) {
              // If we found a placeholder in src, try data attributes again
              if (imageUrl === imageElement.src) {
                imageUrl = imageElement.getAttribute('data-src') || 
                          imageElement.getAttribute('data-lazy-src') ||
                          imageElement.getAttribute('data-original');
              } else {
                imageUrl = null; // Skip placeholder
              }
            }
          }
            
          // Only consider valid, non-placeholder images
          if (imageUrl && !imageUrl.startsWith('data:image/gif')) {
            const rect = imageElement.getBoundingClientRect();
            const area = rect.width * rect.height;
              
            // Score the image: larger images are more likely to be product images
            // Also prefer images that are higher on the page (product images are usually near the top)
            const score = area - (rect.top * 10); // Larger area = higher score, higher position = higher score
              
            // Filter out very small images (likely icons, thumbnails, etc.)
            // Product images are usually at least 200x200px
            if (rect.width >= 200 && rect.height >= 200) {
              imageCandidates.push({
                url: imageUrl,
                score: score,
                width: rect.width,
                height: rect.height
              });
            }
          }
        }
          
        // If we found candidates, pick the best one (highest score = largest, highest on page)
        if (imageCandidates.length > 0) {
          imageCandidates.sort((a, b) => b.score - a.score); // Sort descending (best first)
          productData.image = imageCandidates[0].url;
          break; // Found image, stop trying other selectors
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

  // If we still don't have all required data, throw error
  // The caller can then use GPT fallback if needed
  if (!productData.name && !productData.image && !productData.price) {
    throw new Error('Could not find product information on this page. Make sure you are on a product page.');
  }

  return productData;
}
