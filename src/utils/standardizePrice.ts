function formatPrice(p: string) {
  p = p.trim().replace(/\$/g, '').replace(/,/g, '');  // Remove both $ and commas
  const num = parseFloat(p);
  if(isNaN(num)) return "";
  return `$${num.toFixed(2)}`;
}

export function standardizePrice(price: string) {
  if(price.includes('-')) {
    const [low, high] = price.split('-').map(p => p.trim()) ;
    return `${formatPrice(low)} - ${formatPrice(high)}`;
  }
  else if(price.toLowerCase().includes('to')) {
    const [low, high] = price.split('to').map(p => p.trim());
    return `${formatPrice(low)} - ${formatPrice(high)}`;
  }
  else {
    return formatPrice(price);
  }
}

