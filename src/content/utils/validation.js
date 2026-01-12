import { getSelectorsForSite, getBaseDomain } from '../site-selector.js';

// Expose detectProductPage to window for testing
if (typeof window !== 'undefined' && (process.env.NODE_ENV !== 'production' || window.ENABLE_TESTING)) {
  window.detectProductPage = detectProductPage;
}

/**
 * Detect if the current page is a product page using hybrid approach:
 * 1. Site-specific detection for known sites (Amazon, eBay, etc.)
 * 2. Generic detection for unknown sites
 * 
 * @param {string} url - Optional URL (defaults to window.location.href)
 * @param {string} domain - Optional domain (defaults to extracted from URL)
 * @returns {Object} - { isProductPage: boolean, confidence: number, score: number, indicators: Array }
 */
export function detectProductPage(url = null, domain = null) {
  const currentUrl = url || window.location.href;
  const currentDomain = domain || getBaseDomain(currentUrl);
  const domainParts = currentDomain.split('.');
  const baseDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : currentDomain;
  
  // ============================================================================
  // TIER 1: SITE-SPECIFIC DETECTION (Most Reliable)
  // ============================================================================
  
  const siteSpecificResult = checkSiteSpecific(currentDomain, baseDomain);
  if (siteSpecificResult) {
    return siteSpecificResult;
  }
  
  // ============================================================================
  // TIER 2: GENERIC DETECTION (For Unknown Sites)
  // ============================================================================
  
  return checkGeneric(currentUrl);
}

/**
 * Site-specific detection for known e-commerce sites
 */
function checkSiteSpecific(domain, baseDomain) {
  const url = window.location.href.toLowerCase();
  
  // Amazon detection
  if (domain.includes('amazon.') || baseDomain.includes('amazon.')) {
    const hasProductTitle = !!document.querySelector('#productTitle');
    const hasPrice = !!document.querySelector('.a-price .a-offscreen, #priceblock_ourprice, #priceblock_dealprice, .a-price-whole, span.a-price');
    const hasLandingImage = !!document.querySelector('#landingImage, #imgBlkFront');
    
    if (hasProductTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 95,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          'Amazon product title found (#productTitle)',
          'Amazon price found',
          hasLandingImage ? 'Amazon product image found' : 'Amazon product image not found'
        ]
      };
    } else {
      return {
        isProductPage: false,
        confidence: 10,
        score: 0,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          hasProductTitle ? 'Amazon product title found' : 'Amazon product title missing',
          hasPrice ? 'Amazon price found' : 'Amazon price missing',
          'Not a valid Amazon product page'
        ]
      };
    }
  }
  
  // eBay detection
  if (domain.includes('ebay.') || baseDomain.includes('ebay.')) {
    const hasTitle = !!document.querySelector('h1.x-item-title__mainTitle, h1.textual-display, h1[data-testid="x-item-title-label"]');
    const hasPrice = !!document.querySelector('div.x-price-primary, div.x-bin-price__content, span.textual-display');
    const hasImage = !!document.querySelector('img[src*="ebayimg.com"], #icImg');
    
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 90,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          'eBay product title found',
          'eBay price found',
          hasImage ? 'eBay product image found' : 'eBay product image not found'
        ]
      };
    } else {
      return {
        isProductPage: false,
        confidence: 15,
        score: 0,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          hasTitle ? 'eBay product title found' : 'eBay product title missing',
          hasPrice ? 'eBay price found' : 'eBay price missing',
          'Not a valid eBay product page'
        ]
      };
    }
  }
  
  // Target detection
  if (domain.includes('target.com')) {
    const hasTitle = !!document.querySelector('#pdp-product-title-id');
    const hasPrice = !!document.querySelector('div.styles_priceFullLineHeight__BgU9C');
    
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 90,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: ['Target product title found', 'Target price found']
      };
    }
  }
  
  // Best Buy detection
  if (domain.includes('bestbuy.com')) {
    const hasTitle = !!document.querySelector('h1.h4');
    const hasPrice = !!document.querySelector('div.price-container, div.standard-layout__middle-block_price');
    
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 90,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: ['Best Buy product title found', 'Best Buy price found']
      };
    }
  }
  
  // Walmart detection
  if (domain.includes('walmart.com')) {
    const hasTitle = !!document.querySelector('#main-title');
    const hasPrice = !!document.querySelector('span[itemprop="price"]');
    const hasImage = !!document.querySelector('img.db');
    
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 90,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          'Walmart product title found (#main-title)',
          'Walmart price found (span[itemprop="price"])',
          hasImage ? 'Walmart product image found' : 'Walmart product image not found'
        ]
      };
    } else {
      return {
        isProductPage: false,
        confidence: 15,
        score: 0,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          hasTitle ? 'Walmart product title found' : 'Walmart product title missing',
          hasPrice ? 'Walmart price found' : 'Walmart price missing',
          'Not a valid Walmart product page'
        ]
      };
    }
  }
  
  // Target detection
  if (domain.includes('target.com')) {
    const hasTitle = !!document.querySelector('#pdp-product-title-id');
    const hasPrice = !!document.querySelector('div.styles_priceFullLineHeight__BgU9C');
    
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 90,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          'Target product title found (#pdp-product-title-id)',
          'Target price found'
        ]
      };
    } else {
      return {
        isProductPage: false,
        confidence: 15,
        score: 0,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          hasTitle ? 'Target product title found' : 'Target product title missing',
          hasPrice ? 'Target price found' : 'Target price missing',
          'Not a valid Target product page'
        ]
      };
    }
  }
  
  // Best Buy detection
  if (domain.includes('bestbuy.com')) {
    const hasTitle = !!document.querySelector('h1.h4');
    const hasPrice = !!document.querySelector('div.price-container, div.standard-layout__middle-block_price');
    
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 90,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          'Best Buy product title found (h1.h4)',
          'Best Buy price found'
        ]
      };
    } else {
      return {
        isProductPage: false,
        confidence: 15,
        score: 0,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          hasTitle ? 'Best Buy product title found' : 'Best Buy product title missing',
          hasPrice ? 'Best Buy price found' : 'Best Buy price missing',
          'Not a valid Best Buy product page'
        ]
      };
    }
  }
  
  // Etsy detection
  if (domain.includes('etsy.com')) {
    const hasTitle = !!document.querySelector('h1.wt-line-height-tight');
    const hasPrice = !!document.querySelector('.wt-text-title-larger.wt-mr-xs-1.wt-text-black .wt-screen-reader-only, .wt-screen-reader-only, div.n-listing-card__price');
    const hasImage = !!document.querySelector('img.wt-max-width-full');
    
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 90,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          'Etsy product title found (h1.wt-line-height-tight)',
          'Etsy price found',
          hasImage ? 'Etsy product image found' : 'Etsy product image not found'
        ]
      };
    } else {
      return {
        isProductPage: false,
        confidence: 15,
        score: 0,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          hasTitle ? 'Etsy product title found' : 'Etsy product title missing',
          hasPrice ? 'Etsy price found' : 'Etsy price missing',
          'Not a valid Etsy product page'
        ]
      };
    }
  }
  
  // Temu detection
  if (domain.includes('temu.com')) {
    const hasPrice = !!document.querySelector('div._1vkz0rqG');
    const hasImage = !!document.querySelector('img.lazy-image');
    
    // Temu doesn't have a reliable name selector, so we check price and image
    if (hasPrice && hasImage) {
      return {
        isProductPage: true,
        confidence: 85,
        score: 20,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          'Temu price found (div._1vkz0rqG)',
          'Temu product image found'
        ]
      };
    } else {
      return {
        isProductPage: false,
        confidence: 15,
        score: 0,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          hasPrice ? 'Temu price found' : 'Temu price missing',
          hasImage ? 'Temu product image found' : 'Temu product image missing',
          'Not a valid Temu product page'
        ]
      };
    }
  }
  
  // Pacsun detection
  if (domain.includes('pacsun.com')) {
    const hasTitle = !!document.querySelector('h1.text-product-name');
    const hasPrice = !!document.querySelector('div.bfx-price-container');
    const hasImage = !!document.querySelector('img.d-block');
    
    // Pacsun product pages MUST have the product name selector
    // Category pages won't have h1.text-product-name
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 90,
        score: 25,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          'Pacsun product title found (h1.text-product-name)',
          'Pacsun price found',
          hasImage ? 'Pacsun product image found' : 'Pacsun product image not found'
        ]
      };
    } else {
      return {
        isProductPage: false,
        confidence: 15,
        score: 0,
        maxScore: 25,
        method: 'site-specific',
        indicators: [
          hasTitle ? 'Pacsun product title found' : 'Pacsun product title missing (likely category page)',
          hasPrice ? 'Pacsun price found' : 'Pacsun price missing',
          'Not a valid Pacsun product page'
        ]
      };
    }
  }
  
  // Aeropostale detection
  if (domain.includes('aeropostale.com')) {
    // Check if selectors exist in site-selector.js
    const selectors = getSelectorsForSite(window.location.href);
    if (selectors && selectors.name && selectors.price) {
      const hasTitle = !!document.querySelector(selectors.name);
      const hasPrice = !!document.querySelector(selectors.price);
      
      if (hasTitle && hasPrice) {
        return {
          isProductPage: true,
          confidence: 85,
          score: 20,
          maxScore: 25,
          method: 'site-specific',
          indicators: [
            `Aeropostale product title found (${selectors.name})`,
            `Aeropostale price found (${selectors.price})`
          ]
        };
      } else {
        return {
          isProductPage: false,
          confidence: 15,
          score: 0,
          maxScore: 25,
          method: 'site-specific',
          indicators: [
            hasTitle ? 'Aeropostale product title found' : 'Aeropostale product title missing',
            hasPrice ? 'Aeropostale price found' : 'Aeropostale price missing',
            'Not a valid Aeropostale product page'
          ]
        };
      }
    }
  }
  
  // Try using selectors from site-selector.js for other known sites
  const selectors = getSelectorsForSite(window.location.href);
  if (selectors && selectors.name && selectors.price) {
    const hasTitle = !!document.querySelector(selectors.name);
    const hasPrice = !!document.querySelector(selectors.price);
    
    if (hasTitle && hasPrice) {
      return {
        isProductPage: true,
        confidence: 85,
        score: 20,
        maxScore: 25,
        method: 'site-specific',
        indicators: [`Product title found (${selectors.name})`, `Price found (${selectors.price})`]
      };
    }
  }
  
  return null; // No site-specific match, use generic
}

/**
 * Generic detection for unknown sites
 */
function checkGeneric(url) {
  let score = 0;
  const maxScore = 25;
  const indicators = [];
  const negativeIndicators = [];
  
  // ============================================================================
  // NEGATIVE CHECKS (do these first)
  // ============================================================================
  
  // 1. URL patterns
  const negativeUrlPatterns = [
    { pattern: /\/s\?|search|query|q=/, penalty: 6, message: 'Search results URL' },
    { pattern: /\/category\/|\/categories\/|\/browse\/|\/shop\/|\/department\//, penalty: 6, message: 'Category/browse URL' },
    { pattern: /\/cart\/|\/basket\/|\/bag\//, penalty: 5, message: 'Cart URL' },
    { pattern: /\/checkout\/|\/payment\//, penalty: 5, message: 'Checkout URL' }
  ];
  
  negativeUrlPatterns.forEach(({ pattern, penalty, message }) => {
    if (pattern.test(url.toLowerCase())) {
      score = Math.max(0, score - penalty);
      negativeIndicators.push(message);
    }
  });
  
  // 2. Multiple product cards (search results indicator)
  const productCardCount = Math.max(
    document.querySelectorAll('[data-product-id]').length,
    document.querySelectorAll('.product-card, .product-item, .product-tile').length
  );
  
  if (productCardCount > 10) {
    score = Math.max(0, score - 5);
    negativeIndicators.push(`Multiple product cards found (${productCardCount})`);
  }
  
  // 3. Check H1 for non-product keywords (improved to catch category pages)
  const h1Elements = Array.from(document.querySelectorAll('h1'));
  const nonProductKeywords = [
    'results', 'search', 'sort by', 'filter', 'category', 'browse', 'shop all',
    'clothing', 'men\'s', 'women\'s', 'sale', 'new arrivals', 'all', 'collections',
    'shop', 'department', 'view all', 'see all'
  ];
  const badH1 = h1Elements.find(h1 => {
    const text = h1.innerText?.toLowerCase().trim() || '';
    // Check if it's a category keyword AND (short text OR few words)
    return nonProductKeywords.some(kw => text.includes(kw)) && 
           (text.length < 50 || text.split(' ').length <= 3);
  });
  
  if (badH1) {
    score = Math.max(0, score - 6); // Increased penalty
    negativeIndicators.push(`H1 indicates category page: "${badH1.innerText.trim().substring(0, 40)}"`);
  }
  
  // ============================================================================
  // POSITIVE CHECKS
  // ============================================================================
  
  // 1. Schema.org (STRONG - 8 points, but check if it's actually a Product, not SomeProducts/ItemList)
  const schemaProduct = document.querySelector('[itemtype*="Product"], [itemtype*="product"]');
  if (schemaProduct) {
    const itemType = schemaProduct.getAttribute('itemtype') || '';
    // Check if it's a category/collection page (SomeProducts, ItemList, Collection)
    if (itemType.includes('SomeProducts') || itemType.includes('ItemList') || itemType.includes('Collection')) {
      score = Math.max(0, score - 8);
      negativeIndicators.push('Schema.org indicates category/collection page (not single product)');
    } else {
      // It's a single Product
      score += 8;
      indicators.push('Schema.org Product markup');
    }
  }
  
  // 2. JSON-LD (STRONG - 8 points)
  const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const hasProductJsonLd = jsonLdScripts.some(script => {
    try {
      const data = JSON.parse(script.textContent);
      return data['@type'] === 'Product' || 
             (Array.isArray(data) && data.some(item => item['@type'] === 'Product')) ||
             (data['@graph'] && data['@graph'].some(item => item['@type'] === 'Product'));
    } catch (e) { return false; }
  });
  
  if (hasProductJsonLd) {
    score += 8;
    indicators.push('JSON-LD Product data');
  }
  
  // 3. Product attributes (STRONG - 5 points if 2+ found)
  const productAttributes = [
    '[data-product-id]', '[data-product-name]', '[data-product-price]',
    '[itemprop="name"]', '[itemprop="price"]', '[itemprop="image"]'
  ];
  const foundAttributes = productAttributes.filter(attr => document.querySelector(attr));
  if (foundAttributes.length >= 2) {
    score += 5;
    indicators.push(`Product attributes (${foundAttributes.length})`);
  }
  
  // 4. Add to Cart button (STRONG - 6 points)
  const buttons = Array.from(document.querySelectorAll('button, a[role="button"], input[type="submit"]'));
  const addToCart = buttons.find(btn => {
    const text = (btn.textContent || btn.innerText || btn.getAttribute('aria-label') || '').toLowerCase();
    return (text.includes('add to cart') || text.includes('add to bag') || 
            text.includes('buy now') || text.includes('purchase')) &&
           !text.includes('view') && !text.includes('checkout');
  });
  
  if (addToCart) {
    const rect = addToCart.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      score += 6;
      indicators.push('Add to Cart button (prominent)');
    }
  }
  
  // 5. Price elements (MODERATE - validate count)
  const pricePattern = /([$€£¥])\s?(\d+(?:[\.,]\d+)?)/;
  const priceElements = Array.from(document.querySelectorAll('*')).filter(el => {
    const text = el.innerText?.trim() || '';
    return pricePattern.test(text) && text.length < 50 && el.offsetParent !== null;
  });
  
  if (priceElements.length > 0 && priceElements.length <= 10) {
    score += 4;
    indicators.push(`Price elements (${priceElements.length})`);
  } else if (priceElements.length > 50) {
    score = Math.max(0, score - 3);
    negativeIndicators.push(`Too many prices (${priceElements.length})`);
  }
  
  // 6. Product images (MODERATE - 1-5 images is good)
  const productImages = Array.from(document.querySelectorAll('img')).filter(img => {
    if (img.offsetParent === null) return false;
    const rect = img.getBoundingClientRect();
    return rect.width >= 200 && rect.height >= 200 && 
           img.src && !img.src.includes('data:') &&
           !img.src.toLowerCase().includes('logo') &&
           !img.src.toLowerCase().includes('icon');
  });
  
  if (productImages.length >= 1 && productImages.length <= 5) {
    score += 3;
    indicators.push(`Product images (${productImages.length})`);
  } else if (productImages.length > 20) {
    score = Math.max(0, score - 2);
    negativeIndicators.push(`Too many images (${productImages.length})`);
  }
  
  // 7. Valid H1 (MODERATE - 3 points)
  const validH1 = h1Elements.find(h1 => {
    const text = h1.innerText?.trim() || '';
    if (text.length < 10 || text.length > 200) return false;
    if (h1.offsetParent === null) return false;
    const lowerText = text.toLowerCase();
    return !nonProductKeywords.some(kw => lowerText.includes(kw));
  });
  
  if (validH1) {
    score += 3;
    indicators.push('Valid product title (h1)');
  }
  
  // 8. Quantity selector (WEAK - 1 point)
  if (document.querySelector('input[type="number"][name*="quantity" i], select[name*="quantity" i]')) {
    score += 1;
    indicators.push('Quantity selector');
  }
  
  // 9. Product variants (WEAK - 1 point)
  if (document.querySelector('[name*="size" i], [name*="color" i], [data-variant]')) {
    score += 1;
    indicators.push('Product variants');
  }
  
  // Final calculation
  const finalScore = Math.max(0, score);
  const confidence = Math.min((finalScore / maxScore) * 100, 100);
  const isProductPage = finalScore >= 10 || (hasProductJsonLd && finalScore >= 8);
  
  return {
    isProductPage: isProductPage,
    confidence: Math.round(confidence),
    score: finalScore,
    maxScore: maxScore,
    method: 'generic',
    indicators: indicators,
    negativeIndicators: negativeIndicators
  };
}

