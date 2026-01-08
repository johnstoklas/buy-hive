import { SITE_SELECTORS, getBaseDomain, getSelectorsForSite, getSupportedSitesList, isSupportedSite } from "./site-selector";
import { ERROR_TYPES } from "./constants.js";
import { extractProductName, extractPrice, extractPriceFromElement, extractProductImage, detectProductPage, extractPriceWithDiscountPreference, formatSupportedSitesList } from './utils/index.js';
import { extractAmazonProduct } from './extractors/amazon.js';
import { extractEbayProduct } from './extractors/ebay.js';
import { extractAbercrombieProduct } from './extractors/abercrombie.js';
import { extractWalmartProduct } from './extractors/walmart.js';
import { extractTargetProduct } from './extractors/target.js';
import { extractBestBuyProduct } from './extractors/bestbuy.js';
import { extractEtsyProduct } from './extractors/etsy.js';
import { extractTemuProduct } from './extractors/temu.js';
import { extractPacsunProduct } from './extractors/pacsun.js';
import { extractAeropostaleProduct } from './extractors/aeropostale.js';
import { extractGenericProduct } from './extractors/generic.js';
import { extractProductWithGPT } from './extractors/gpt.js';

// Set up message listener IMMEDIATELY after imports
// This ensures it's registered as soon as the module loads
/**
 * Message Listener - Handles communication from popup
 * 
 * When the popup requests product extraction, this listener:
 * 1. Calls extractProductInfo() to get product data from the current page
 * 2. Returns success response with product data, or error response with details
 * 3. Handles both structured errors (NOT_PRODUCT_PAGE, SITE_NOT_SUPPORTED) and generic errors
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'extractProduct') {
    // Use async IIFE to handle async extractProductInfo() function
    (async () => {
      try {
        const result = await extractProductInfo();
        sendResponse({ success: true, data: result });
      } catch (error) {
        // Check if it's a structured error (has error.type property)
        if (error.type) {
          sendResponse({ 
            success: false, 
            error: error.message,
            errorType: error.type,
            errorData: error
          });
        } else {
          // Generic error - wrap in standard format
          sendResponse({ 
            success: false, 
            error: error.message || 'Failed to extract product information',
            errorType: 'UNKNOWN_ERROR'
          });
        }
      }
    })();
    return true; // Keep message channel open for async response (required for Chrome extensions)
  }
  return false; // Don't handle other message types
});

// Expose functions to window for testing (only in non-production or when explicitly enabled)
if (typeof window !== 'undefined' && (process.env.NODE_ENV !== 'production' || window.ENABLE_TESTING)) {
  window.extractProductInfo = extractProductInfo;
  window.detectProductPage = detectProductPage;
}

/**
 * Main function: Extract product information from the current page
 * 
 * Flow:
 * 1. Validate site is supported
 * 2. Detect if page is a product page
 * 3. Get site-specific selectors
 * 4. Extract product data (name, price, image) using site-specific logic or heuristics
 * 5. Return product data object
 * 
 * @returns {Promise<Object>} - Product data object with name, price, image, site, url, timestamp
 * @throws {Object} - Structured error if site not supported or not a product page
 */
async function extractProductInfo() {
  // ============================================================================
  // STEP 1: VALIDATE SITE SUPPORT
  // ============================================================================
  const url = window.location.href;
  const domain = getBaseDomain(url);
  
  // Check if this site is in our supported sites list
  const isSupported = isSupportedSite(domain);
  
  if (!isSupported) {
    // Site is not supported - add to junk sites list and throw error
    // const isJunk = await isJunkSite(domain);
    
    // if (!isJunk) {
    //   // Add to junk sites list (so we don't check it again)
    //   await addToJunkSites(domain);
    // }
    
    // Get supported sites list for error message
    const supportedSites = getSupportedSitesList();
    const supportedSitesFormatted = formatSupportedSitesList(supportedSites);
    
    const error = {
      type: ERROR_TYPES.SITE_NOT_SUPPORTED,
      message: `Site not supported: ${domain}`,
      supportedSites: supportedSites,
      supportedSitesFormatted: supportedSitesFormatted,
      domain: domain
    };
    
    throw error;
  }
  
  // ============================================================================
  // STEP 2: DETECT IF PAGE IS A PRODUCT PAGE
  // ============================================================================
  const pageCheck = detectProductPage(url, domain);
  
  if (!pageCheck.isProductPage) {
    // Page doesn't appear to be a product detail page
    const error = {
      type: ERROR_TYPES.NOT_PRODUCT_PAGE,
      message: `This isn't a product page.`,
      domain: domain,
      confidence: pageCheck.confidence,
      indicators: pageCheck.indicators
    };
    
    throw error;
  }
  
  // ============================================================================
  // STEP 3: GET SITE-SPECIFIC SELECTORS
  // ============================================================================
  const selectors = getSelectorsForSite(url);
  
  if (!selectors) {
    // This shouldn't happen if isSupportedSite worked correctly, but just in case
    throw new Error(`Site not supported: ${domain}`);
  }

  // ============================================================================
  // STEP 4: INITIALIZE PRODUCT DATA OBJECT
  // ============================================================================
  const productData = {
    name: null,
    image: null,
    price: null,
    site: domain,
    url: url,
    timestamp: new Date().toISOString()
  };

  // ============================================================================
  // STEP 5: EXTRACT PRODUCT DATA (SITE-SPECIFIC LOGIC)
  // ============================================================================
  const isAmazon = domain.includes('amazon.');
  const isEbay = domain.includes('ebay.');
  const isAbercrombie = domain.includes('abercrombie.com');
  const isWalmart = domain.includes('walmart.com');
  const isTarget = domain.includes('target.com');
  const isBestBuy = domain.includes('bestbuy.com');
  const isEtsy = domain.includes('etsy.com');
  const isTemu = domain.includes('temu.com');
  const isPacsun = domain.includes('pacsun.com');
  const isAeropostale = domain.includes('aeropostale.com');
  
  let result;
  try {
    if (isAmazon) {
      result = extractAmazonProduct(domain, url, selectors, productData);
    } else if (isEbay) {
      result = extractEbayProduct(domain, url, selectors, productData);
    } else if (isAbercrombie) {
      result = extractAbercrombieProduct(domain, url, selectors, productData);
    } else if (isWalmart) {
      result = extractWalmartProduct(domain, url, selectors, productData);
    } else if (isTarget) {
      result = extractTargetProduct(domain, url, selectors, productData);
    } else if (isBestBuy) {
      result = extractBestBuyProduct(domain, url, selectors, productData);
    } else if (isEtsy) {
      result = extractEtsyProduct(domain, url, selectors, productData);
    } else if (isTemu) {
      result = extractTemuProduct(domain, url, selectors, productData);
    } else if (isPacsun) {
      result = extractPacsunProduct(domain, url, selectors, productData);
    } else if (isAeropostale) {
      result = extractAeropostaleProduct(domain, url, selectors, productData);
    } else {
      result = extractGenericProduct(domain, url, selectors, productData);
    }
    
    // Validate that we got at least some product data
    if (!result.name && !result.image && !result.price) {
      throw new Error('Could not extract product information using standard methods');
    }
    
    return result;
  } catch (error) {
    // If extraction failed, try GPT fallback
    // GPT extractor will check for API key in storage or options
    try {
      return await extractProductWithGPT(domain, url, productData);
    } catch (gptError) {
      // If GPT also fails, throw the original error
      throw error;
    }
  }
}
