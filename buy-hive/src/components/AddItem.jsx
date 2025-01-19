import React from 'react';

const AddItem = ({ isVisible, organizationSections }) => (
  <>
    <section id="add-item-section" className={isVisible ? "visible" : ""}>
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
            {organizationSections.map((section) => (
            <option key={section.id} value={section.title}>
              {section.title}
            </option>
            ))}
        </select>
        <button id="add-item"> Add Item </button>
        </div>
    </section>
  </>
);

export default AddItem;
