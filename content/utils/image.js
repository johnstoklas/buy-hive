/**
 * Heuristic function to extract product image
 * 
 * Strategy:
 * 1. Find all images on the page
 * 2. Filter out small images (icons), hidden images, and non-product images (logos, etc.)
 * 3. Score each candidate based on size and position
 * 4. Return the highest-scoring image URL
 * 
 * @returns {string|null} - Image URL or null if no suitable image found
 */
export function extractProductImage() {
  const images = Array.from(document.querySelectorAll("img"));
  if (images.length === 0) return null;

  // Step 1: Filter to find product image candidates
  const candidates = images
    .filter(img => {
      const rect = img.getBoundingClientRect();
      
      // Filter out very small images (likely icons, buttons, etc.)
      if (rect.width < 100 || rect.height < 100) return false;
      
      // Filter out hidden images (display: none, visibility: hidden, etc.)
      if (img.offsetParent === null) return false;
      
      // Must have a valid image source
      // Check multiple attributes for lazy-loaded images
      const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
      if (!src || src.trim() === '') return false;
      
      // Filter out common non-product images by URL pattern
      const srcLower = src.toLowerCase();
      if (srcLower.includes('logo') || 
          srcLower.includes('icon') || 
          srcLower.includes('avatar') ||
          srcLower.includes('spinner') ||
          srcLower.includes('placeholder')) {
        return false;
      }
      
      return true; // This image is a valid candidate
    })
    // Step 2: Score each candidate (higher score = better)
    .map(img => {
      const rect = img.getBoundingClientRect();
      const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-old-src');
      
      // Score = image area - (vertical position * 10)
      // This prefers larger images that are higher on the page
      const area = rect.width * rect.height;
      const score = area - rect.top * 10;
      
      return {
        url: src,
        score: score // Higher = better
      };
    });

  // Step 3: Return the best candidate (highest score)
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.score - a.score); // Sort descending (highest score first)
  return candidates[0]?.url || null;
}

