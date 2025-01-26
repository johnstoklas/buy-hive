import React, { useEffect, useState } from 'react';
import SelectFolders from './SelectFolders.jsx';

const AddItem = ({ isVisible, organizationSections, scrapedData, errorData }) => {
  

  return(
  <>
    <section id="add-item-section">
      {/*{errorData
        ? ( <h4 className="processing-add-item"> `Error: ${errorData}` </h4>)
        : scrapedData 
        ? (*/}
        <>
        <h1 id="add-item-title"> Add Item </h1>
        <div class="add-item-container">
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
        </div>
        <div class="add-item-organization-container">
          <SelectFolders />
        </div> 
        <button id="add-item"> Add Item </button>
        </>
        {/*
        )
        : ( <h4 className="processing-add-item"> Loading... </h4> )
      }*/}
    </section>
  </>
  )
};

export default AddItem;
