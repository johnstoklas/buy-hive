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