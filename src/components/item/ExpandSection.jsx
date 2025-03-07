import React, { useState, useEffect, useRef } from 'react';
import ModifyItemSec from './ModifyItemSec.jsx';
import { useLocked } from '../contexts/LockedProvider.jsx'
import { userDataContext } from '../contexts/UserProvider.jsx';

const ExpandSection = ({ 
  item, 
  cartId, 
  itemId,
  cartsArray,
  itemsInFolder,
  setItemsInFolder,
  showNotification,
}) => {

  const [modifyVisible, setModifyVisible] = useState(false);
  const [notes, setNotes] = useState(item.notes);
  const [isEditing, setIsEditing] = useState(false); // Track if editing

  const inputRef = useRef(null);
  const noteRef = useRef(notes);

  const { isLocked } = useLocked();
  const { userData } = userDataContext(); 

  useEffect(() => {
    console.log("item: ", item);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  const openModifyItem = () => {
    if(!isLocked) {
      setModifyVisible(!modifyVisible);
    }
  }

  const handleNoteClick = () => {
    noteRef.current = notes; 
    setIsEditing(true);
    setModifyVisible(false);
  };

  const handleNoteChange = (e) => {
    setNotes(e.target.value);
  };

  // Edit item notes
  const handleEditNotes = (notes, cartId, itemId) => {
      const data = {
        email: userData.email,
        notes: notes.trim(),
        cartId,
        itemId,
      };

      chrome.runtime.sendMessage(
        { action: "editNotes", data: data },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error communicating with background script:", chrome.runtime.lastError.message);
            return;
          }

          if (response?.status === "success") {
            chrome.runtime.sendMessage({action: "updateItems", data: response.data});
          } else {
            console.error("Error editing notes:", response?.message);
          }
        }
      );
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length); // Move cursor to the end
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleOffNoteClick = () => {
    if (notes.trim() !== noteRef.current.trim()) {
      handleEditNotes(notes, cartId, itemId);
    }
    setIsEditing(false);
  };

  return (
  <>
    <section class="expand-section-expanded-display">
        <div class="shopping-item-container">
          { !isLocked ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <div class="shopping-item-image-container-container"> 
                <div class="shopping-item-image-container">
                    <img src={item.image}></img>
                </div>
              </div>
            </a>
          ) : ( 
            <div class="shopping-item-image-container-container"> 
              <div class="shopping-item-image-container">
                  <img src={item.image}></img>
              </div>
            </div>
          )}
          <div class="shopping-item-information-container">
            <div className="shopping-item-header">
              <div className="shopping-item-header-text">
                <h4 class="shopping-item-name"> {item.name} </h4>
                <h4 class="shopping-item-price">  {item.price} </h4>
              </div>
              <div className="shopping-item-button-container">
                <button className={isLocked ? "disabled-hover-modify" : ""} onClick={openModifyItem}> &#8942; </button>
              </div>
            </div>
                {modifyVisible && <ModifyItemSec 
                  notesContent={notes}
                  setNotes={setNotes}
                  cartId={cartId}
                  itemId={itemId}
                  handleNoteClick={handleNoteClick}
                  setModifyItemSec={setModifyVisible}
                  cartsArray={cartsArray}
                  item={item}
                  itemsInFolder={itemsInFolder}
                  setItemsInFolder={setItemsInFolder}
                  showNotification={showNotification}
                />} 

                {isEditing ? (
                  <textarea
                    ref={inputRef}
                    className="shopping-item-notes"
                    value={notes}
                    onChange={handleNoteChange}
                    onBlur={handleOffNoteClick}
                  />              
                ) : (
                  <div 
                    className="shopping-item-notes" 
                    style={{ color: notes ? "black" : "gray" }}
                  >
                    {(notes || notes.trim() !== "") ? notes : "None"}
                  </div>
                )}
            </div>
        </div>
    </section>
  </>
  )
};

export default ExpandSection;
