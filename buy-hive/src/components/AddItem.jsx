import React, { useEffect, useState, useRef } from 'react';
import SelectFolders from './SelectFolders.jsx';

const AddItem = ({
  isVisible, 
  organizationSections, 
  scrapedData, 
  errorData, 
  setIsVisible, 
  cartsArray, 
  scrapedImage,
  handleAddItem,
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

  useEffect(() => {
    if (scrapedData) {
      setItemTitle(scrapedData?.product_name || "");
      setItemPrice(scrapedData?.price || "");
    }
  }, [scrapedData]);

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
      ref={addItem}
      className={isVisible ? "slide-in-add-item" : "slide-out-add-item"}
      onAnimationEnd={() => {
        if (!isVisible) setIsAnimating(false);
      }}
    >
      {errorData ? (
        <h4 className="processing-add-item">{`Error: ${errorData}`}</h4>
      ) : (
        <>
          <h1 id="add-item-title">Add Item</h1>
          <div className="add-item-container">
            <div className="add-item-image-container">
              {scrapedImage ? (
                <img src={scrapedImage} />
              ) : (
                <div className="add-image-loading"></div>
              )}
            </div>
            <div className="add-item-information-container">
              <h4 className="add-item-name">
                {itemTitle || <div className="add-item-loading"></div>}
              </h4>
              <h4 className="add-item-price">
                {itemPrice || <div className="add-item-loading"></div>}
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
            />
          </div>
          <button id="add-item" onClick={submitAdd}>
            Add Item
          </button>
        </>
      )}
    </section>
  ) : null;
};

export default AddItem;
