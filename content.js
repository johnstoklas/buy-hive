// Listen for messages from the popup
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
        scrapeH1Tags(currentUrl);
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

currentUrl = '';

chrome.webNavigation.onCompleted.addListener((details) => {
  currentUrl = details.url; // Update the current URL when navigation is complete
}, { url: [{ urlMatches: 'https://*/*' }] }); // Match all URLs or specific ones




