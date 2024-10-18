document.getElementById('clickMe').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Inject content.js dynamically
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']  // Ensure you're injecting content.js
      }, () => {
        // Send a message after content.js is injected
        chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColor' }, (response) => {
          if (response) {
            console.log('Response from content script:', response.status);
          } else {
            console.log('No response from content script.');
          }
        });
      });
    });
  });

document.getElementById('scrape').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Inject content.js dynamically
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']  // Ensure you're injecting content.js
      }, () => {
        // Send a message after content.js is injected
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrapeSite' }, (response) => {
          if (response) {
            console.log('Response from content script:', response.status);
          } else {
            console.log('No response from content script.');
          }
        });
      });
    });
  });
/*
document.getElementById('scrapeButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: scrapeData
        });
    });
});

// The function to be injected into the current tab
function scrapeData() {
    const products = Array.from(document.querySelectorAll('.product')); // Change this selector as needed
    const productData = products.map(product => {
        return {
            title: product.querySelector('.product-title').textContent,  // Adjust selectors
            price: product.querySelector('.product-price').textContent,    // Adjust selectors
            imageUrl: product.querySelector('.product-image img').src      // Adjust selectors
        };
    });

    // Send the data back to the background or popup script
    console.log(productData); // For demonstration; handle the data as needed
}
    */
