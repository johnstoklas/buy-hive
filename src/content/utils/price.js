import { extractProductName } from './productName.js';

/**
 * Helper function to extract price from element, handling superscript decimals
 * 
 * Some websites display prices like "$29" with cents in superscript: "$29<sup>99</sup>"
 * This function detects and combines them into "$29.99"
 * 
 * Strategy:
 * 1. Find currency symbol + main price digits
 * 2. Look for superscript elements (<sup> tags or styled elements) containing cents
 * 3. Combine: currency + mainPrice + "." + cents
 * 4. Fallback to regular price extraction if no superscript found
 * 
 * @param {HTMLElement} el - The element to extract price from
 * @returns {string|null} - Extracted price (e.g., "$29.99") or null
 */
export function extractPriceFromElement(el) {
  const currencyRegex = /([$€£¥])\s?(\d{1,3}(?:,\d{3})*|\d+)/; // Match currency symbol + main price digits
  const text = el.innerText?.trim() || '';
  
  // Step 1: Find currency symbol and main price digits
  const match = text.match(currencyRegex);
  if (match) {
    const currency = match[1]; // $, €, £, or ¥
    const mainPrice = match[2]; // The main number part (e.g., "29")
    
    // Step 2: Check for superscript elements within this element
    // Superscript could be in <sup> tags or styled with vertical-align/font-size
    const superscripts = el.querySelectorAll('sup, [style*="vertical-align"], [style*="font-size"]');
    
    for (const sup of superscripts) {
      const supText = sup.textContent?.trim() || '';
      // Check if superscript contains 1-3 digits (likely cents: "99", "5", etc.)
      const supMatch = supText.match(/^(\d{1,3})$/);
      if (supMatch) {
        const cents = supMatch[1].padStart(2, '0'); // Ensure 2 digits ("5" -> "05")
        return `${currency}${mainPrice}.${cents}`; // Combine: "$29" + "." + "99" = "$29.99"
      }
    }
    
    // Step 3: Also check sibling elements that might be superscript
    // Sometimes the superscript is a separate element next to the price
    if (el.parentElement) {
      const siblings = Array.from(el.parentElement.children);
      const elIndex = siblings.indexOf(el);
      
      // Check the next sibling element
      if (elIndex >= 0 && elIndex < siblings.length - 1) {
        const nextSibling = siblings[elIndex + 1];
        const nextText = nextSibling.textContent?.trim() || '';
        const nextMatch = nextText.match(/^(\d{1,3})$/);
        
        // Check if it's styled as superscript (smaller font, vertical-align, or <sup> tag)
        const siblingStyles = window.getComputedStyle(nextSibling);
        const elStyles = window.getComputedStyle(el);
        const isSuperscript = nextSibling.tagName === 'SUP' || 
                             siblingStyles.verticalAlign === 'super' ||
                             parseFloat(siblingStyles.fontSize) < parseFloat(elStyles.fontSize); // Smaller font indicates superscript
        
        if (nextMatch && isSuperscript) {
          const cents = nextMatch[1].padStart(2, '0');
          return `${currency}${mainPrice}.${cents}`;
        }
      }
    }
    
    // Step 4: If no superscript found, return the regular price
    return match[0]; // e.g., "$29"
  }
  
  // Fallback: try to match full price pattern (with decimals already included)
  const fullMatch = text.match(/([$€£¥]\s?\d+(?:[\.,]\d+)?)/);
  return fullMatch ? fullMatch[1] : null;
}

/**
 * Extract price with discount preference (for sites with original/discount variants)
 * 
 * Some sites use data attributes to mark discount vs original prices:
 * - <span data-variant="discount">$29.99</span>
 * - <span data-variant="original">$39.99</span>
 * 
 * This function prioritizes discount prices over original prices.
 * 
 * @param {string} containerSelector - CSS selector for the price container
 * @param {string} variantAttribute - Attribute name for variant (default: 'data-variant')
 * @param {string} discountValue - Value for discount variant (default: 'discount')
 * @param {string} originalValue - Value for original variant (default: 'original')
 * @param {HTMLElement} rootElement - Root element to search within (default: document)
 * @returns {string|null} - Extracted price or null if not found
 */
export function extractPriceWithDiscountPreference(containerSelector, variantAttribute = 'data-variant', discountValue = 'discount', originalValue = 'original', rootElement = document) {
  const container = rootElement.querySelector(containerSelector);
  if (!container) return null;
  
  const priceRegex = /([$€£¥]\s?\d+(?:[\.,]\d+)?)/;
  
  // First, try to find discount price
  const discountElement = container.querySelector(`[${variantAttribute}="${discountValue}"]`);
  if (discountElement) {
    let priceText = extractPriceFromElement(discountElement);
    if (!priceText) {
      const text = discountElement.textContent || discountElement.innerText || '';
      const match = text.match(priceRegex);
      if (match) {
        priceText = match[1];
      }
    }
    if (priceText && priceRegex.test(priceText)) {
      return priceText.trim();
    }
  }
  
  // If no discount, try original price
  const originalElement = container.querySelector(`[${variantAttribute}="${originalValue}"]`);
  if (originalElement) {
    let priceText = extractPriceFromElement(originalElement);
    if (!priceText) {
      const text = originalElement.textContent || originalElement.innerText || '';
      const match = text.match(priceRegex);
      if (match) {
        priceText = match[1];
      }
    }
    if (priceText && priceRegex.test(priceText)) {
      return priceText.trim();
    }
  }
  
  // Fallback: extract from container itself
  let priceText = extractPriceFromElement(container);
  if (!priceText) {
    const text = container.textContent || container.innerText || '';
    const match = text.match(priceRegex);
    if (match) {
      priceText = match[1];
    }
  }
  
  return priceText && priceRegex.test(priceText) ? priceText.trim() : null;
}

/**
 * Heuristic function to extract price using currency pattern matching
 * 
 * This is a fallback function that searches the entire page for price-like text.
 * It uses a scoring system to find the most likely product price.
 * 
 * Strategy:
 * 1. Find all elements containing currency patterns ($, €, £, ¥)
 * 2. Filter out non-price elements (shipping, fees, etc.)
 * 3. Score each candidate based on:
 *    - Position on page (higher = better)
 *    - Proximity to product name
 *    - Price value (reasonable range = better)
 *    - Font size (larger = more prominent)
 * 4. Return the highest-scoring price
 * 
 * @returns {string|null} - Extracted price or null if not found
 */
export function extractPrice() {
  const currencyRegex = /([$€£¥]\s?\d+(?:[\.,]\d+)?)/; // Match currency + number with optional decimals
  
  // Get product name position for proximity scoring
  // Prices near the product name are more likely to be the main product price
  const productName = extractProductName();
  let nameElement = null;
  if (productName) {
    const headings = Array.from(document.querySelectorAll("h1"));
    nameElement = headings.find(h => h.innerText.trim() === productName);
  }

  // Search all elements on the page
  const elements = Array.from(document.querySelectorAll("body *"));
  
  // Words that indicate this is NOT the main product price
  // These help filter out shipping costs, old prices, fees, etc.
  const excludeWords = ['shipping', 'delivery', 'was', 'save', 'from', 'starting at', 'each', 'per', 'tax', 'fee', 'original', 'list', 'msrp'];
  
  // Step 1: Filter elements to find price candidates
  const candidates = elements
    .filter(el => {
      // Skip hidden elements
      if (el.offsetParent === null) return false;
      
      // Try to extract price (handles superscript decimals)
      const priceText = extractPriceFromElement(el);
      const text = el.innerText?.trim() || '';
      
      // Must have either extracted price or currency pattern in text
      if (!priceText && !currencyRegex.test(text)) return false;
      
      // Skip elements with too much text (likely not a price element)
      if (text.length > 50) return false;
      
      // Filter out elements containing exclude words (shipping, fees, etc.)
      const textLower = text.toLowerCase();
      if (excludeWords.some(word => textLower.includes(word))) return false;
      
      // Extract the price value to validate it's reasonable
      const finalPrice = priceText || (text.match(currencyRegex)?.[1]);
      if (finalPrice) {
        const priceValue = parseFloat(finalPrice.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
        
        // Filter out very small prices (likely shipping costs, fees, etc.)
        if (priceValue < 0.50) return false;
        
        // Filter out extremely large prices (likely errors or total cart values)
        if (priceValue > 100000) return false;
      }
      
      return true; // This element is a valid price candidate
    })
    // Step 2: Score each candidate (lower score = better)
    .map(el => {
      const rect = el.getBoundingClientRect();
      
      // Extract price text, handling superscript decimals
      let priceText = extractPriceFromElement(el);
      if (!priceText) {
        // Fallback to regex match if superscript extraction didn't work
        const match = el.innerText.match(currencyRegex);
        if (!match) return null;
        priceText = match[1];
      }
      
      const priceValue = parseFloat(priceText.replace(/[$€£¥\s,]/g, '').replace(',', '.'));
      
      // Calculate score - LOWER score = BETTER candidate
      // We subtract points for good indicators, add points for bad indicators
      let score = rect.top; // Base score: vertical position (higher on page = lower score = better)
      
      // Boost: Prices near product name are more likely to be the main price
      if (nameElement) {
        const nameRect = nameElement.getBoundingClientRect();
        const verticalDistance = Math.abs(rect.top - nameRect.bottom);
        if (verticalDistance < 500) { // Within 500px of product name
          score -= 200; // Significant boost (lower score = better)
        }
      }
      
      // Boost: Reasonable price range ($5-$5000) is more likely to be product price
      if (priceValue >= 5 && priceValue <= 5000) {
        score -= 100; // Boost for reasonable prices
      }
      
      // Boost: Larger font sizes indicate more prominent/important prices
      const fontSize = window.getComputedStyle(el).fontSize;
      const fontSizeNum = parseFloat(fontSize);
      if (fontSizeNum > 20) {
        score -= 50; // Boost for larger fonts
      }
      
      // Penalty: Very small prices (< $5) are likely shipping or fees
      if (priceValue < 5) {
        score += 300; // Heavy penalty (higher score = worse)
      }
      
      // Penalty: Prices on the far right are often shipping info or secondary prices
      if (rect.left > window.innerWidth * 0.7) {
        score += 150; // Penalty for far-right position
      }
      
      return {
        price: priceText,
        score: score, // Lower = better
        priceValue: priceValue
      };
    });

  // Step 3: Return the best candidate (lowest score)
  if (candidates.length === 0) return null;

  // Filter out null candidates and sort by score (ascending = best first)
  const validCandidates = candidates.filter(c => c !== null);
  validCandidates.sort((a, b) => a.score - b.score);
  
  return validCandidates[0].price || null;
}

