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
  const [selectedCarts, setSelectedCarts] = useState(cartsArray);
  
  const addItem = useRef(null);
  {/*
  // If the user clicks out of the add item pop-up it disappears
  useEffect(() => {
    const handleClickOutside = (event) => {
      setTimeout(() => {
        if (addItem.current && !addItem.current.contains(event.target)) {
            setIsVisible(false);
        }
      }, 1000); 
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setIsVisible]);*/}

  const submitAdd = () => {
    console.log("information: ", scrapedData, scrapedImage, itemUrl, selectedCarts)
    if(scrapedData && scrapedImage && itemUrl && selectedCarts) {
      const data = {
        itemTitle: itemTitle,
        itemPrice: itemPrice,
        itemImage: scrapedImage,
        itemNotes: itemNotes,
        itemUrl: itemUrl,
        selectedCarts: selectedCarts,
      }
      handleAddItem(data);
      setIsVisible(false);
    }
  }

  useEffect(() => {
    if (scrapedData) {
      setItemTitle(scrapedData?.product_name);
      setItemPrice(scrapedData?.price);
    }
  }, [scrapedData]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const url = tabs[0].url;
        setItemUrl(url);
      }
    });
  }, []); // Empty dependency array ensures it runs only once when the component mounts
  
  
  return(
  <>
    <section id="add-item-section" ref={addItem}>
      {errorData
        ? ( <h4 className="processing-add-item"> `Error: ${errorData}` </h4>)
        : (
        <>
        <h1 id="add-item-title"> Add Item </h1>
        <div class="add-item-container">
          { scrapedData ? (
            <>
          <div class="add-item-image-container">
            <img src={scrapedImage || "images/spider_man.png"}></img>       
          </div>
          <div class="add-item-information-container">
              <h4 class="add-item-name"> 
                {/*Spider Man Pillow*/}
                {itemTitle}
              </h4>
              <h4 class="add-item-price">
                {/*$20.99*/}
                {itemPrice}  
              </h4>
              <textarea 
                id="add-item-notes" 
                placeholder="Notes"
                value={itemNotes} 
                onChange={(e) => setItemNotes(e.target.value)} // <-- Update state
              />
        </div> 
        </> ) 
        : ( <div className="spinner-loader"></div> ) }
        </div>
        <div class="add-item-organization-container">
          <SelectFolders 
            cartsArray={cartsArray}
            selectedCarts={selectedCarts}
            setSelectedCarts={setSelectedCarts}
          />
        </div> 
        <button id="add-item" onClick={submitAdd}> Add Item </button>
        </> 
        )       
      }
    </section>
  </>
  )
};

export default AddItem;
