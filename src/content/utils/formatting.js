/**
 * Format supported sites list for display
 * @param {Array<string>} sites - Array of supported site domains
 * @returns {string} - Formatted string of supported sites
 */
export function formatSupportedSitesList(sites) {
  // Group sites by main domain
  const grouped = {};
  sites.forEach(site => {
    const mainDomain = site.split('.')[0];
    if (!grouped[mainDomain]) {
      grouped[mainDomain] = [];
    }
    grouped[mainDomain].push(site);
  });
  
  // Format as readable list
  const formatted = [];
  Object.keys(grouped).sort().forEach(mainDomain => {
    const domains = grouped[mainDomain];
    if (domains.length === 1) {
      formatted.push(`• ${mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1)} (${domains[0]})`);
    } else {
      const mainSite = domains.find(d => !d.includes('.co.') && !d.includes('.com.')) || domains[0];
      const others = domains.filter(d => d !== mainSite);
      if (others.length > 0) {
        formatted.push(`• ${mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1)} (${mainSite}${others.length > 2 ? `, ${others.length} more` : ', ' + others.join(', ')})`);
      } else {
        formatted.push(`• ${mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1)} (${mainSite})`);
      }
    }
  });
  
  return formatted.join('\n');
}

