import React, { useEffect, useState } from 'react';

const AddItem = ({ isVisible, organizationSections, scrapedData, errorData }) => {
  const cartItem = scrapedData?.cart_items?.[0];

  return(
  <>
    <section id="add-item-section">
      {errorData
        ? ( <h4 className="processing-add-item"> `Error: ${errorData}` </h4>)
        : scrapedData 
        ? (
        <>
        <div class="add-item-container">
        <div class="add-item-image-container">
            <img src="images/spider_man.png"></img>
        </div>
        <div class="add-item-information-container">
            <h4 class="add-item-name"> 
              {cartItem.product_name}
            </h4>
            <h4 class="add-item-price">
              {cartItem.price}  
            </h4>
            <textarea id="add-item-notes" placeholder="Notes"></textarea>
        </div>
        </div>
        <div class="add-item-organization-container">
        <select select id="add-item-select-folder">
            <option value="" disabled selected>Select a folder</option>
            {organizationSections.map((section) => (
            <option key={section.id} value={section.title}>
              {section.title}
            </option>
            ))}
        </select>
        <button id="add-item"> Add Item </button>
        </div> 
        </>
        )
        : ( <h4 className="processing-add-item"> Loading... </h4> )
      }
    </section>
  </>
  )
};

export default AddItem;
