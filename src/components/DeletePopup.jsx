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
    console.log("???");
    if(type === "folder" || type === "item") {
      setSec(false);
      setSecHidden(false);
      setIsLocked(false);
    }
    setIsVisible(false);
  }

  const submitDelete = () => {
    if(type === "folder") {
      handleDeleteSection(cartId);
    }
    else if(type === "item" || type === "move") {
      handleDeleteItem(cartId, itemId);  
      setIsLocked(false);
    }
    closePopup();
  }
  
  return (
  <>
    <section id="delete-popup-section"> 
        <p id="close-delete-popup" onClick={closePopup}> &#10005; </p>
        <FontAwesomeIcon icon={faTrashCan} id="trash-icon" />
        {type === "folder" ? (
          <p> Are you sure you want to delete this folder? </p>
        ) : (
          <p> Are you sure you want to delete this item? </p>
        )}
        <div id="dps-button-section">
          <button id="dps-delete-button" onClick={submitDelete}> Yes, I'm sure </button>
          <button id="dps-cancel-button" onClick={closePopup}> No, cancel </button>
        </div>
    </section>
  </>
  )
};

export default DeletePopup;
