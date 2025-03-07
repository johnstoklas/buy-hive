import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { cloneElement, useState } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from '../contexts/LockedProvider.jsx';
import { userDataContext } from '../contexts/UserProvider.jsx';


const DeletePopup = ({ 
  cartId, 
  itemId,
  item,
  setIsVisible, 
  setSec, 
  setSecHidden, 
  type,
  itemsInFolder,
  setItemsInFolder,
  setOrganizationSections,
  handleMoveItem,
}) => {

  const { setIsLocked } = useLocked();
  const { userData } = userDataContext();

  const handleDeleteSection = (cartId) => {
    if (!userData) return;

    chrome.runtime.sendMessage({ action: "deleteFolder", data: { email: userData.email, cartId } }, (response) => {
      if (response?.status === "success") {
        setOrganizationSections((prev) => prev.filter((section) => section.cart_id !== cartId));
        itemsInFolder.forEach((item) => {
          const newSelectedCarts = item.selected_cart_ids = item.selected_cart_ids.filter(id=> id !== cartId);
          const sentData = {
            image: item.image,
            item_id: item.item_id,
            name: item.name,
            notes: item.notes,
            price: item.price,
            selected_cart_ids: newSelectedCarts,
            url: item.url
          }
          //chrome.runtime.sendMessage({action: "updateItems", data: sentData});
        });
      } else {
        console.error("Error deleting folder:", response?.message);
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
        setItemsInFolder((prev) => prev.filter((section) => section.item_id !== itemId));
        const newSelectedCarts = item.selected_cart_ids = item.selected_cart_ids.filter(id=> id !== cartId);
        const sentData = {
          image: item.image,
          item_id: item.item_id,
          name: item.name,
          notes: item.notes,
          price: item.price,
          selected_cart_ids: newSelectedCarts,
          url: item.url
        }
        chrome.runtime.sendMessage({action: "updateItems", data: sentData});
      } else {
        console.error("Error deleting item:", response?.message);
      }
    });
  }

  // Deletes item from all carts
  const handleDeleteItemAll = (itemId) => {
    const data = {
      email: userData.email,
      itemId: itemId,
    };

    chrome.runtime.sendMessage({action: "deleteItemAll", data: data}, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with background script:", chrome.runtime.lastError.message);
        return;
      }

      if (response?.status === "success") {
        setItemsInFolder((prev) => prev.filter((section) => section.item_id !== itemId));
        //const newSelectedCarts = item.selected_cart_ids = item.selected_cart_ids.filter(id=> id !== cartId);
        const sentData = {
          item_id: itemId,
          selected_cart_ids: [],
        }
        chrome.runtime.sendMessage({action: "updateItems", data: sentData});
      } else {
        console.error("Error deleting item:", response?.message);
      }
    });
  }

  const closePopup = () => {
    setSec(false);
    setSecHidden(false);
    setIsLocked(false);
    setIsVisible(false);
  }

  const submitDelete = () => {
    if(type === "folder") {
      handleDeleteSection(cartId);
    }
    else if(type === "item") {
      handleDeleteItem(cartId, itemId);  
    }
    else if(type === "move") {
      handleDeleteItemAll(itemId);
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
        ) : type === "item" ? (
          <p> Are you sure you want to delete this item? </p>
        ) : (
          <p>Are you sure you want to delete this item permanently?</p>
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
