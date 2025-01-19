// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import Extension from './extension/Extension';

ReactDOM.render(<Extension />, document.getElementById('root'));

document.addEventListener('DOMContentLoaded', function() {
  const buttonContainer = document.getElementById('organization-section');

  buttonContainer.addEventListener('click', function(event) {
      if (event.target && event.target.classList.contains('expand-section-button')) {
          rotateSection(event.target);
      }
  });
});

function rotateSection(button) {
  const expandableSection = button.closest('.expand-section');
  const expandedDisplay = expandableSection.querySelector('.expand-section-expanded-display');

  if (expandableSection.style.height === "45px" || !expandableSection.style.height) {
      const calculatedHeight = calculateTotalHeight(expandedDisplay);
      expandableSection.style.height = calculatedHeight + "px"; 
  } else {
      expandableSection.style.height = "45px"; 
  }

  button.classList.toggle('rotate');
}

function calculateTotalHeight(expandedDisplay) {
  const expandableSectionHeight = expandedDisplay.offsetHeight;
  if(!expandableSectionHeight) {
    return 45;
  }
  const totalHeight = expandableSectionHeight + 60;
  return totalHeight;
}

document.getElementById('close-button').addEventListener('click', function() {
  window.close(); 
});

document.getElementById('profile').addEventListener('click', function() {
  const signInPage = document.getElementById('sign-in-page');

  console.log(signInPage.style.display);

  if(signInPage.style.display === 'none' || !signInPage.style.display) {
    signInPage.style.display = 'flex';
  }
  else {
    signInPage.style.display = 'none';
  }
});

const inputElement = document.getElementById('file-title');

inputElement.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
      handleSubmit();
  }
});

document.getElementById('submit-file').addEventListener('click', function() {
  handleSubmit();
});

function handleSubmit() {
  const title = document.getElementById('file-title');
  const titleTrimmed = title.value.trim();

  if(titleTrimmed) {
    const groupingSection = document.getElementById('organization-section');

    const newDiv = document.createElement('div');
    newDiv.innerHTML = `<div class="expand-section">
                          <section class="expand-section-main-display">
                            <button class="expand-section-button"> ▶ </button>
                            <h4 class="expand-section-title"> ${titleTrimmed} </h4>
                            <h4 class="expand-section-items"> 0 </h4>
                          </section>
                          <section class="expand-section-expanded-display">
                          </section>
                        </div>`
    groupingSection.appendChild(newDiv);
    title.value = '';
  }
}

function popUpIn(item) {
  const div = document.getElementById(item);
  div.classList.remove('slide-out');
  div.classList.add('slide-in');
  if(item === 'add-file-section') {
    div.style.display = 'flex'; 
  }
  else {
    div.style.display = 'block'; 
  }
}

function popUpOut(item) {
  const div = document.getElementById(item);
  div.classList.remove('slide-in');
  div.classList.add('slide-out');
  setTimeout(() => { 
    div.style.display = 'none'; 
  }, 400);
}


let addFileState = false;
let addItemState = false;

document.getElementById('section').addEventListener('click', function() {
  if(!addFileState) {
    popUpIn('add-file-section');
  }
  else {
    popUpOut('add-file-section');
  }
  addFileState = !addFileState;
});

document.getElementById('scrape').addEventListener('click', function() {
  if(!addItemState) {
    popUpIn('add-item-section');
  }
  else {
    popUpOut('add-item-section');
  }
  addItemState = !addItemState;
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
