import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { cloneElement, useState } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from './LockedProvider.jsx';


const DeletePopup = ({ 
  setIsVisible, 
  setSec, 
  setSecHidden, 
  cartId, 
  handleDeleteSection, 
  handleDeleteItem,
  type,
  itemId,
}) => {

  const { setIsLocked } = useLocked();

  const closePopup = () => {
    setIsVisible(false);
    setSec(false);
    setSecHidden(false);
    setIsLocked(false);
  }

  const submitDelete = () => {
    if(type === "folder") {
      handleDeleteSection(cartId);
    }
    else if(type === "item") {
      handleDeleteItem(cartId, itemId);
    }
    closePopup();
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
