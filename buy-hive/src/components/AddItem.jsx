import React from 'react';

const AddItem = () => (
  <>
    <section id="add-item-section">
        <div class="add-item-container">
        <div class="add-item-image-container">
            <img src="images/spider_man.png"></img>
        </div>
        <div class="add-item-information-container">
            <h4 class="add-item-name"> Spider Man Pillow </h4>
            <h4 class="add-item-price"> $4.99 </h4>
            <textarea id="add-item-notes" placeholder="Notes"></textarea>
        </div>
        </div>
        <div class="add-item-organization-container">
        <select select id="add-item-select-folder">
            <option value="" disabled selected>Select a folder</option>
            <option value="1"> Option 1</option>
            <option value="2"> Option 2</option>
        </select>
        <button id="add-item"> Add Item </button>
        </div>
    </section>
  </>
);

export default AddItem;
