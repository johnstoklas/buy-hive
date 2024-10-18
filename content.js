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
        const products = document.body.innerText //Array.from(document.querySelectorAll('.product')); // Change this selector as needed
        //const productData = products.map(product => {
            /*
        return {
          title: product.querySelector('.productTitle').innerHTML,  // Adjust selectors
          price: product.querySelector('.product-price').textContent,    // Adjust selectors
          imageUrl: product.querySelector('.product-image img').src      // Adjust selectors
        };
        */
       return products;
    }

    // Send the data back to the background or popup script
    console.log(products); // For demonstration; handle the data as needed
    sendResponse({ status: 'Site Scraped' });
    }
  );

