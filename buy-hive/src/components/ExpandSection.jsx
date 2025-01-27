import React from 'react';

const ExpandSection = ({ item }) => {

  return (
  <>
    <section class="expand-section-expanded-display">
        <div class="shopping-item-container">
            <div class="shopping-item-image-container">
                <img src="images/spider_man.png"></img>
            </div>
            <div class="shopping-item-information-container">
                <h4 class="shopping-item-name"> {item.name} </h4>
                <h4 class="shopping-item-price">  ${item.price} </h4>
                <div class="shopping-item-notes"> {item.notes ? item.notes : "There are no notes"} </div>
            </div>
        </div>
    </section>
  </>
  )
};

export default ExpandSection;
