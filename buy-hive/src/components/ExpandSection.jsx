import React, { useState } from 'react';
import ModifyItemSec from './ModifyItemSec.jsx';

const ExpandSection = ({ item, handleEditNotes, cartId, itemId }) => {

  const [modifyVisible, setModifyVisible] = useState(false);
  const [notes, setNotes] = useState(item.notes);

  const openModifyItem = () => {
    setModifyVisible(!modifyVisible);
  }

  return (
  <>
    <section class="expand-section-expanded-display">
        <div class="shopping-item-container">
            <div class="shopping-item-image-container">
                <img src="images/spider_man.png"></img>
            </div>
            <div class="shopping-item-information-container">
                <div className="shopping-item-header">
                  <div className="shopping-item-header-text">
                    <h4 class="shopping-item-name"> {item.name} </h4>
                    <h4 class="shopping-item-price">  ${item.price} </h4>
                  </div>
                  <div className="shopping-item-button-container">
                    <button onClick={openModifyItem}> &#8942; </button>
                  </div>
                </div>
                {modifyVisible && <ModifyItemSec 
                  notesContent={notes}
                  setNotes={setNotes}
                  handleEditNotes={handleEditNotes}
                  cartId={cartId}
                  itemId={itemId}
                />} 

                <div class="shopping-item-notes"> {notes ? notes : "There are no notes"} </div>
            </div>
        </div>
    </section>
  </>
  )
};

export default ExpandSection;
