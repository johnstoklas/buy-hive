document.getElementById('close-button').addEventListener('click', function() {
  window.close(); 
});

const rotate = document.querySelectorAll('.expand-section-button');

rotate.forEach(button => {
  button.addEventListener('click', (e) => {
    const expandableSection = e.target.closest('.expand-section');
    const expandedDisplay = expandableSection.querySelector('.expand-section-expanded-display');
    
    if (expandableSection.style.height === "45px" || !expandableSection.style.height) {
      const calculatedHeight = calculateTotalHeight(expandedDisplay);
      expandableSection.style.height = calculatedHeight + "px"; 
    } else {
      expandableSection.style.height = "45px"; 
    }

    e.target.classList.toggle('rotate');
  });
});

function calculateTotalHeight(expandedDisplay) {
  const expandableSectionHeight = expandedDisplay.offsetHeight;
  const totalHeight = expandableSectionHeight + 60;
  return totalHeight;
}



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

