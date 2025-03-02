import React, { useState, useEffect, useRef } from 'react';
import ModifyItemSec from './ModifyItemSec.jsx';
import { useLocked } from './contexts/LockedProvider.jsx'
import { userDataContext } from './contexts/UserProvider.jsx';

const ExpandSection = ({ 
  item, 
  cartId, 
  itemId,
  cartsArray,
  itemsInFolder,
  setItemsInFolder,
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
    setIsEditing(true);
    setModifyVisible(false);
  };

  const handleNoteChange = (e) => {
    setNotes(e.target.value);
  };

  // Edit item notes
  const handleEditNotes = (notes, cartId, itemId) => {
      if (notes.trim()) {

        const data = {
          email: userData.email,
          notes,
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
              console.error("Error editing notes:", response?.error);
            }
          }
        );
      }
  };

  const handleNoteBlur = () => {
      if(notes) {
        noteRef.current = notes;
        handleEditNotes(notes, cartId, itemId);
      }
  };

  const handleNoteKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      if(notes) {
        noteRef.current = notes;
        handleEditNotes(notes, cartId, itemId);
      }
      else {
        setNotes(noteRef.current);
      }
    }
  };

  return (
  <>
    <section class="expand-section-expanded-display">
        <div class="shopping-item-container">
          { !isLocked ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <div class="shopping-item-image-container">
                  <img src={item.image}></img>
              </div>
            </a>
          ) : ( 
            <div class="shopping-item-image-container">
              <img src={item.image}></img>
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
                />} 

                {isEditing ? (
                  <input 
                    ref={inputRef}
                    type="textarea"
                    className="shopping-item-notes"
                    value={notes}
                    onChange={handleNoteChange}
                    onBlur={handleNoteBlur}
                    onKeyDown={handleNoteKeyDown}
                  />
                ) : (
                  <div class="shopping-item-notes" style={{color: notes ? "black" : "gray"}}> {notes ? notes : "None"} </div>
                )}
            </div>
        </div>
    </section>
  </>
  )
};

export default ExpandSection;
