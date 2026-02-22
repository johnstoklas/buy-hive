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
import { injectCircle } from "./add-item-button.js";

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

const ALLOWED_ORIGINS = [
  "https://www.buyhive.dev",
  "http://localhost:5173",
];

injectCircle();

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!ALLOWED_ORIGINS.includes(event.origin)) return;

  if (event.data?.action === "sendUserData" && event.data.access_token) {
    chrome.runtime.sendMessage({
      action: "storeUserData",
      access_token: event.data.access_token,
      refresh_token: event.data.refresh_token,
      user: event.data.user,
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'extractProduct') {
    // Use async IIFE to handle async extractProductInfo() function
    (async () => {
      try {
        const result = await extractProductInfo();
        // Don't log confidence scores for success - they're in the payload
        sendResponse({ success: true, data: result });
      } catch (error) {
        // Check if it's a structured error (has error.type property)
        if (error.type) {
          // Log error with pageConfidence if available
          const pageConfidence = error.confidence || error.errorData?.confidence;
          // console.log('[Content Script] Extraction failed -', {
          //   pageConfidence: pageConfidence,
          //   error: error.message,
          //   errorType: error.type
          // });
          sendResponse({ 
            success: false, 
            error: error.message,
            errorType: error.type,
            errorData: error
          });
        } else {
          // Generic error - wrap in standard format
          // console.log('[Content Script] Extraction failed -', {
          //   error: error.message || 'Failed to extract product information'
          // });
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
  else if (request.action === "getInnerText") {
    const data = {
      innerText: document.documentElement.innerText,
    }
    sendResponse({ success: true, data: data });   
    return false;   
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
  // STEP 1: DETECT IF PAGE IS A PRODUCT PAGE
  // ============================================================================
  const url = window.location.href;
  const domain = getBaseDomain(url);
  
  // Always check if it's a product page first
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
  // STEP 2: GET SITE-SPECIFIC SELECTORS (if available)
  // ============================================================================
  const selectors = getSelectorsForSite(url);
  const isSupported = isSupportedSite(domain);

  // ============================================================================
  // STEP 3: INITIALIZE PRODUCT DATA OBJECT
  // ============================================================================
  const productData = {
    name: null,
    image: null,
    price: null,
    site: domain,
    url: url,
    timestamp: new Date().toISOString(),
    pageConfidence: pageCheck.confidence
  };

  // ============================================================================
  // STEP 4: EXTRACT PRODUCT DATA (SITE-SPECIFIC LOGIC OR GENERIC)
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
    // Only use site-specific extractors if site is actually supported
    if (isAmazon && isSupported) {
      productData.extractorType = 'amazon';
      result = extractAmazonProduct(domain, url, selectors, productData);
    } else if (isEbay && isSupported) {
      productData.extractorType = 'ebay';
      result = extractEbayProduct(domain, url, selectors, productData);
    } else if (isAbercrombie && isSupported) {
      productData.extractorType = 'abercrombie';
      result = extractAbercrombieProduct(domain, url, selectors, productData);
    } else if (isWalmart && isSupported) {
      productData.extractorType = 'walmart';
      result = extractWalmartProduct(domain, url, selectors, productData);
    } else if (isTarget && isSupported) {
      productData.extractorType = 'target';
      result = extractTargetProduct(domain, url, selectors, productData);
    } else if (isBestBuy && isSupported) {
      productData.extractorType = 'bestbuy';
      result = extractBestBuyProduct(domain, url, selectors, productData);
    } else if (isEtsy && isSupported) {
      productData.extractorType = 'etsy';
      result = extractEtsyProduct(domain, url, selectors, productData);
    } else if (isTemu && isSupported) {
      productData.extractorType = 'temu';
      result = extractTemuProduct(domain, url, selectors, productData);
    } else if (isPacsun && isSupported) {
      productData.extractorType = 'pacsun';
      result = extractPacsunProduct(domain, url, selectors, productData);
    } else if (isAeropostale && isSupported) {
      productData.extractorType = 'aeropostale';
      result = extractAeropostaleProduct(domain, url, selectors, productData);
    } else {
      // For unsupported sites that pass product page detection, use generic extraction
      // console.log('[Content Script] Using generic extraction for unsupported site:', domain);
      productData.extractorType = 'generic';
      result = extractGenericProduct(domain, url, selectors || {}, productData);
    }
    
    // Validate that we got at least some product data
    if (!result.name && !result.image && !result.price) {
      throw new Error('Could not extract product information using standard methods');
    }

    result.pageConfidence = result.pageConfidence ?? 0;
    result.nameConfidence = result.nameConfidence ?? 0;
    result.priceConfidence = result.priceConfidence ?? 0;
    result.imageConfidence = result.imageConfidence ?? 0;
    result.extractorType = result.extractorType ?? 0;
    
    return result;
  } catch (error) {
    // If extraction failed, try GPT fallback
    // GPT extractor will check for API key in storage or options
    try {
      productData.extractorType = 'gpt';
      const gptResult = await extractProductWithGPT(domain, url, productData);
      gptResult.pageConfidence = gptResult.pageConfidence ?? 0;
      gptResult.nameConfidence = gptResult.nameConfidence ?? 0;
      gptResult.priceConfidence = gptResult.priceConfidence ?? 0;
      gptResult.imageConfidence = gptResult.imageConfidence ?? 0;
      gptResult.extractorType = gptResult.extractorType ?? 0;
      return gptResult;
    } catch (gptError) {
      // If GPT also fails, throw the original error
      throw error;
    }
  }
}

