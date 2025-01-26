import React, { useEffect, useState, useRef } from 'react';
import { ClipLoader } from "react-spinners";
import SelectFolders from './SelectFolders.jsx';

const AddItem = ({ isVisible, organizationSections, scrapedData, errorData, setIsVisible }) => {
  
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
              <img src="images/spider_man.png"></img>
          </div>
          <div class="add-item-information-container">
              <h4 class="add-item-name"> 
                Spider Man Pillow
                {scrapedData?.product_name}
              </h4>
              <h4 class="add-item-price">
                $20.99
                {scrapedData?.price}  
              </h4>
              <textarea id="add-item-notes" placeholder="Notes"></textarea> 
        </div> 
        </> ) 
        : ( <div className="spinner-loader"></div> ) }
        </div>
        <div class="add-item-organization-container">
          <SelectFolders />
        </div> 
        <button id="add-item"> Add Item </button>
        </> 
        )       
      }
    </section>
  </>
  )
};

export default AddItem;
