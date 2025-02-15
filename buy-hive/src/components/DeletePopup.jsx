import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'


const DeletePopup = ({ 
  setIsVisible, 
  setModifyOrgSec, 
  setModOrgHidden, 
  setIsLocked, 
  cartId, 
  handleDeleteSection, 
  handleDeleteItem,
  type,
  itemId,
}) => {

  const closePopup = () => {
    if(type === "folder") {
      setIsVisible(false);
      setModifyOrgSec(false);
      setModOrgHidden(false);
      setIsLocked(false);
    }
    else if(type === "item") {
      setIsVisible(false);
    }
  }

  const submitDelete = () => {
    if(type === "folder") {
      handleDeleteSection(cartId);
    
      setIsVisible(false);
      setModifyOrgSec(false);
      setModOrgHidden(false);
      setIsLocked(false);
    }
    else if(type === "item") {
      handleDeleteItem(cartId, itemId);

      setIsVisible(false);
    }
  }
  
  return (
  <>
    <section id="delete-popup-section"> 
        <p id="close-delete-popup" onClick={closePopup}> &#10005; </p>
        <FontAwesomeIcon icon={faTrashCan} id="trash-icon" />
        <p> Are you sure you want to delete this folder? </p>
        <div id="dps-button-section">
          <button id="dps-delete-button" onClick={submitDelete}> Yes, I'm sure </button>
          <button id="dps-cancel-button" onClick={closePopup}> No, cancel </button>
        </div>
    </section>
  </>
  )
};

export default DeletePopup;
