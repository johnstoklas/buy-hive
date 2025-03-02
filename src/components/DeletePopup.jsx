import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { cloneElement, useState } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from './contexts/LockedProvider.jsx';
import { userDataContext } from './contexts/UserProvider.jsx';


const DeletePopup = ({ 
  cartId, 
  itemId,
  setIsVisible, 
  setSec, 
  setSecHidden, 
  type,
  setItemsInFolder,
  setOrganizationSections,
}) => {

  const { setIsLocked } = useLocked();
  const { userData } = userDataContext();

  const handleDeleteSection = (cartId) => {
    if (!userData) return;

    chrome.runtime.sendMessage({ action: "deleteFolder", data: { email: userData.email, cartId } }, (response) => {
      if (response?.status === "success") {
        setOrganizationSections((prev) => prev.filter((section) => section.cart_id !== cartId));
      } else {
        console.error("Error deleting folder:", response?.error);
      }
    });
  };

  // Delete an item
  const handleDeleteItem = (cartId, itemId) => {

    const data = {
        email: userData.email,
        cartId: cartId,
        itemId: itemId,
      };

      chrome.runtime.sendMessage({action: "deleteItem", data: data}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          // Fetch the latest list after deletion
          //fetchFolderItems(cartId);
          //updateScreenSize();
          setItemsInFolder((prev) => prev.filter((section) => section.item_id !== itemId));
        } else {
          console.error("Error deleting item:", response?.error);
        }
      });
  }

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
