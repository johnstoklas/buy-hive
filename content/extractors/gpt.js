/**
 * GPT Fallback Extractor
 * 
 * This extractor uses GPT/LLM to extract product information when
 * traditional selectors and heuristics fail. It analyzes the page content
 * and uses AI to identify product name, price, and image.
 * 
 * Usage: This should be called as a fallback when:
 * - Generic extractor fails to find product data
 * - Site-specific extractors fail
 * - Product page detection passes but extraction fails
 */

/**
 * Extract product information using GPT/LLM analysis
 * 
 * @param {string} domain - The domain name
 * @param {string} url - The page URL
 * @param {Object} productData - Product data object to populate (may have partial data)
 * @param {Object} options - Configuration options
 * @param {string} options.apiKey - API key for the LLM service
 * @param {string} options.apiUrl - API endpoint URL (default: OpenAI)
 * @param {string} options.model - Model to use (default: 'gpt-4o-mini' for cost efficiency)
 * @returns {Promise<Object>} - Product data object with name, price, image
 */
export async function extractProductWithGPT(domain, url, productData = {}, options = {}) {
  const {
    apiKey = '',
    apiUrl = 'https://api.openai.com/v1/chat/completions',
    model = 'gpt-4o-mini' // Cost-efficient model
  } = options;

  // Check if API key is available
  if (!apiKey) {
    // Try to get from Chrome storage as fallback
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['openai_api_key'], (result) => {
        const key = result.openai_api_key || '';
        if (!key) {
          reject(new Error('GPT extractor requires an API key. Set it in extension settings or pass apiKey option.'));
          return;
        }
        // Retry with the key from storage
        extractProductWithGPT(domain, url, productData, { ...options, apiKey: key })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  try {
    // Extract key page content (not full HTML to save tokens)
    const pageContent = extractPageContent();
    
    // Build the prompt
    const prompt = buildExtractionPrompt(domain, url, pageContent);
    
    // Call GPT API
    const response = await callGPTAPI(apiUrl, apiKey, model, prompt);
    
    // Parse and validate the response
    const extractedData = parseGPTResponse(response);
    
    // Merge with existing productData (prioritize GPT results)
    return {
      ...productData,
      name: extractedData.name || productData.name,
      price: extractedData.price || productData.price,
      image: extractedData.image || productData.image,
      site: domain,
      url: url,
      timestamp: new Date().toISOString(),
      extractedBy: 'gpt' // Flag to indicate this was extracted by GPT
    };
  } catch (error) {
    console.error('GPT extraction failed:', error);
    throw new Error(`GPT extraction failed: ${error.message}`);
  }
}

/**
 * Extract relevant page content for GPT analysis
 * This extracts key elements to reduce token usage
 * 
 * @returns {Object} - Structured page content
 */
function extractPageContent() {
  const content = {
    title: document.title,
    h1: Array.from(document.querySelectorAll('h1')).map(el => el.textContent.trim()).filter(Boolean),
    h2: Array.from(document.querySelectorAll('h2')).slice(0, 5).map(el => el.textContent.trim()).filter(Boolean),
    metaDescription: document.querySelector('meta[name="description"]')?.content || '',
    priceElements: extractPriceElements(),
    imageElements: extractImageElements(),
    buttonText: extractButtonText(),
    schemaData: extractSchemaData()
  };
  
  return content;
}

/**
 * Extract potential price elements
 */
function extractPriceElements() {
  const priceRegex = /([$€£¥]\s?\d+(?:[\.,]\d+)?)/g;
  const elements = Array.from(document.querySelectorAll('*')).filter(el => {
    const text = el.textContent || '';
    return priceRegex.test(text) && text.length < 100 && el.offsetParent !== null;
  }).slice(0, 10); // Limit to 10 elements
  
  return elements.map(el => ({
    text: el.textContent.trim().substring(0, 100),
    tag: el.tagName.toLowerCase(),
    classes: el.className || '',
    id: el.id || ''
  }));
}

/**
 * Extract potential product images
 */
function extractImageElements() {
  const images = Array.from(document.querySelectorAll('img')).filter(img => {
    const rect = img.getBoundingClientRect();
    return rect.width >= 200 && rect.height >= 200 && img.offsetParent !== null;
  }).slice(0, 5); // Limit to 5 images
  
  return images.map(img => ({
    src: img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || '',
    alt: img.alt || '',
    width: img.getBoundingClientRect().width,
    height: img.getBoundingClientRect().height
  }));
}

/**
 * Extract button text (for "Add to Cart" detection)
 */
function extractButtonText() {
  const buttons = Array.from(document.querySelectorAll('button, [role="button"], input[type="submit"]'))
    .slice(0, 10)
    .map(el => el.textContent?.trim() || el.getAttribute('aria-label') || '')
    .filter(Boolean);
  
  return buttons;
}

/**
 * Extract JSON-LD schema data if available
 */
function extractSchemaData() {
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const schemas = [];
  
  for (const script of scripts.slice(0, 3)) { // Limit to 3 schema blocks
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type'] === 'Product' || (Array.isArray(data) && data.some(item => item['@type'] === 'Product'))) {
        schemas.push(data);
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }
  
  return schemas;
}

/**
 * Build the prompt for GPT extraction
 */
function buildExtractionPrompt(domain, url, pageContent) {
  return `You are analyzing a product page from ${domain} to extract product information.

URL: ${url}

Page Content:
- Title: ${pageContent.title}
- H1 Headings: ${pageContent.h1.join(' | ')}
- H2 Headings: ${pageContent.h2.join(' | ')}
- Meta Description: ${pageContent.metaDescription}

Potential Price Elements:
${pageContent.priceElements.map((el, i) => `${i + 1}. [${el.tag}] ${el.text} (classes: ${el.classes}, id: ${el.id})`).join('\n')}

Potential Product Images:
${pageContent.imageElements.map((img, i) => `${i + 1}. ${img.src} (alt: "${img.alt}", size: ${img.width}x${img.height})`).join('\n')}

Button Text Found:
${pageContent.buttonText.join(', ')}

${pageContent.schemaData.length > 0 ? `Schema.org Product Data: ${JSON.stringify(pageContent.schemaData)}` : ''}

Please extract the following information from this product page:
1. Product Name: The main product title/name
2. Price: The current selling price (format: $XX.XX or similar)
3. Product Image URL: The main product image URL (prefer high-resolution images)

Return your response as a JSON object with this exact structure:
{
  "name": "Product Name Here",
  "price": "$XX.XX",
  "image": "https://image-url.com/image.jpg"
}

If you cannot find any of these fields, use null for that field. Be precise and only extract information that is clearly visible on the product page.`;
}

/**
 * Call the GPT API
 */
async function callGPTAPI(apiUrl, apiKey, model, prompt) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts product information from e-commerce pages. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for consistent extraction
      max_tokens: 500,
      response_format: { type: 'json_object' } // Request JSON response format
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown API error' } }));
    throw new Error(`GPT API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from GPT API');
  }

  return data.choices[0].message.content;
}

/**
 * Parse and validate GPT response
 */
function parseGPTResponse(responseText) {
  try {
    // Try to extract JSON from the response (in case it's wrapped in markdown)
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsed = JSON.parse(jsonText);
    
    // Validate structure
    return {
      name: parsed.name && typeof parsed.name === 'string' ? parsed.name.trim() : null,
      price: parsed.price && typeof parsed.price === 'string' ? parsed.price.trim() : null,
      image: parsed.image && typeof parsed.image === 'string' ? parsed.image.trim() : null
    };
  } catch (error) {
    throw new Error(`Failed to parse GPT response: ${error.message}. Response: ${responseText.substring(0, 200)}`);
  }
}

