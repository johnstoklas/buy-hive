/*
document.body.style.border = '5px solid red';
console.log('Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendTextContent') {
      console.log(message.textContent);  // Handle the plain text here
  }
});
*/





/* Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'changeColor') {
      // Change the color of all paragraphs to red
      const paragraphs = document.querySelectorAll('p');
      paragraphs.forEach((p) => {
        p.style.color = 'red';
      });
      sendResponse({ status: 'Color changed' });
    }
    else if(request.action === 'scrapeSite') {
        //scrapeH1Tags(currentUrl);
        scrapeSite();
        sendResponse({ status: 'Site Scraped' });
    }    
    }
  );

// Function to scrape h1 tags from a page 

// we need to change this so it doesn't scrape just h1 tags but instead the specific things we want
async function scrapeH1Tags(url) {
  try {
    // Fetch the HTML content from the URL
    const response = await fetch(url);
    const html = await response.text();
    
    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Select all h1 tags and extract their text content
    const h1Tags = Array.from(doc.querySelectorAll('h1')).map(h1 => h1.textContent.trim());
    
    // Log or store the h1 tags
    console.log(h1Tags);

    // You can return this data if needed
    return h1Tags;
  } catch (error) {
    console.error('Error:', error);
  }
}

//another attempt at web scraping - it works in some places but not all, also only pulls some of the data
async function scrapeSite() {

  // Try extracting JSON-LD first
  let jsonLDScript = document.querySelector('script[type="application/ld+json"]');
  if (jsonLDScript) {
      let productData = JSON.parse(jsonLDScript.textContent);
      let productName = productData.name;
      let productImage = productData.image;
      let productPrice = productData.offers?.price;
      console.log('jsonLD: ', { productName, productPrice, productImage });
  }

  // Fallback to Microdata
  let productScope = document.querySelector('[itemscope][itemtype="https://schema.org/Product"]');
  if (productScope) {
      let productName = productScope.querySelector('[itemprop="name"]')?.innerText;
      let productPrice = productScope.querySelector('[itemprop="price"]')?.content || productScope.querySelector('[itemprop="price"]')?.innerText;
      let productImage = productScope.querySelector('[itemprop="image"]')?.src;
      console.log('productScope: ', { productName, productPrice, productImage });
  } 

  // Fallback to Open Graph meta tags
  let productName = document.querySelector('meta[property="og:title"]')?.content;
  let productImage = document.querySelector('meta[property="og:image"]')?.content;
  let productPrice = document.querySelector('meta[property="product:price:amount"]')?.content;
  console.log('fallback: ', { productName, productPrice, productImage });

}

*/


