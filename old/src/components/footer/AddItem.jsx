import React, { useEffect, useState, useRef } from 'react';
import SelectFolders from '../item/SelectFolders.jsx';

const AddItem = ({
  isVisible, 
  organizationSections, 
  scrapedData, 
  errorData, 
  setIsVisible, 
  cartsArray, 
  scrapedImage,
  handleAddItem,
  handleAddSection, showNotification
}) => {
  const [itemTitle, setItemTitle] = useState(null);
  const [itemPrice, setItemPrice] = useState(null);
  const [itemNotes, setItemNotes] = useState(""); 
  const [itemUrl, setItemUrl] = useState(null);
  const [allCarts, setAllCarts] = useState(cartsArray);
  const [selectedCarts, setSelectedCarts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const addItem = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleClickOutside = (event) => {
    if (isVisible && addItem.current && !addItem.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible]);

  const standarizedPrice = (price) => {
    function formatPrice(p) {
      p = p.trim().replace(/\$/g, '');
      let num = parseFloat(p);
      if(isNaN(num)) {
        return "";
      }
      return `$${num.toFixed(2)}`;
    }
    if(price.includes('-')) {
      const [low, high] = price.split('-').map(p => p.trim()) 
      return `${formatPrice(low)} - ${formatPrice(high)}`
    }
    else if(price.toLowerCase().includes('to')) {
      const [low, high] = price.split('to').map(p => p.trim()) 
      return `${formatPrice(low)} - ${formatPrice(high)}`
    }
    else {
      return formatPrice(price);
    }
  }

  useEffect(() => {
    console.log("scraped data is: ", scrapedData);
  }, [scrapedData])

  useEffect(() => {
    console.log("error data: ", errorData);
    if(errorData) {
      setIsVisible(false);
      setTimeout(() => { 
        showNotification("Invalid website", false);
      }, 300);
    }
    else if (scrapedData) {
      setItemTitle(scrapedData?.product_name || "");
      const scrapedPrice = scrapedData?.price; 
      if(scrapedData?.price) {
        const correctedPrice = standarizedPrice(scrapedPrice);
        setItemPrice(correctedPrice);
      }
      else setItemPrice("");
    }

  }, [scrapedData, errorData]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        setItemUrl(tabs[0].url);
      }
    });
  }, []);

  const submitAdd = () => {
    if (scrapedData && scrapedImage && itemUrl && selectedCarts.length > 0) {
      const data = {
        itemTitle,
        itemPrice,
        itemImage: scrapedImage,
        itemNotes,
        itemUrl,
        selectedCarts,
      };
      handleAddItem(data);
      setIsVisible(false);
    }
  };

  return (isVisible || isAnimating) ? (
    <section
      id="add-item-section"
      style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}
      ref={addItem}
      className={isVisible ? "slide-in-add-item" : "slide-out-add-item"}
      onAnimationEnd={() => {
        if (!isVisible) setIsAnimating(false);
      }}
    >
          <div id="add-item-header" style={{justifyContent: "space-between"}}>
            <h1 id="add-item-title" style={{paddingLeft: "10px"}}>Add Item</h1>
            <p id="add-item-close" style={{paddingRight: "10px"}} onClick={() => setIsVisible(false)}> &#10005; </p>
          </div>
          <div className="add-item-container">
            
                {scrapedImage ? (
                  <div className="add-item-image-container-container"> 
                    <div className="add-item-image-container">
                      <img src={scrapedImage} />
                    </div>
                  </div>
                ) : (
                  <div className="add-image-loading"></div>
                )}

            <div className="add-item-information-container">
              <h4 className="add-item-name">
                {itemTitle || <div className="add-item-loading"></div>}
              </h4>
              <h4 className="add-item-price">
                {itemPrice || <div className="add-item-loading add-item-loading-price"></div>}
              </h4>
              <textarea
                id="add-item-notes"
                placeholder="Notes"
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="add-item-organization-container">
            <SelectFolders
              cartsArray={cartsArray}
              allCarts={allCarts}
              setAllCarts={setAllCarts}
              selectedCarts={selectedCarts}
              setSelectedCarts={setSelectedCarts}
              handleAddSection={handleAddSection}
            />
          </div>
          <button id="add-item" onClick={submitAdd}>
            Add Item
          </button>
    </section>
  ) : null;
};

export default AddItem;
