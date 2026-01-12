/**
 * Heuristic function to extract product name from h1 elements
 * 
 * Strategy:
 * - Finds all h1 elements on the page
 * - Scores each h1 based on position (higher on page = better) and length
 * - Returns the h1 with the lowest score (best candidate)
 * 
 * @returns {string|null} - Product name or null if no h1 found
 */
export function extractProductName() {
  const headings = Array.from(document.querySelectorAll("h1"));
  if (headings.length === 0) return null;

  // Score each h1: lower score = better candidate
  // Score = vertical position + (text length * 0.5)
  // This prefers headings that are higher on the page and have reasonable length
  const candidates = headings
    .filter(el => el.innerText.trim().length > 0) // Only non-empty headings
    .map(el => {
      const rect = el.getBoundingClientRect();
      return {
        text: el.innerText.trim(),
        score: rect.top + el.innerText.length * 0.5 // Lower = better (higher on page)
      };
    });

  // Sort by score (ascending) and return the best candidate
  candidates.sort((a, b) => a.score - b.score);
  return candidates[0]?.text || null;
}

