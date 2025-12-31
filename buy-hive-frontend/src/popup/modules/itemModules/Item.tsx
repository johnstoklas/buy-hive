import type { ItemType } from '@/types/ItemType';
import { useState, useEffect, useRef } from 'react';
// import ModifyItemSec from './ModifyItemSec.jsx';
// import { useLocked } from '../contexts/LockedProvider.jsx'
// import { userDataContext } from '../contexts/UserProvider.jsx';

interface ItemProp {
  item: ItemType
}
const Item = ({item} : ItemProp) => {

  const [modifyVisible, setModifyVisible] = useState(false);
  const [notes, setNotes] = useState(item.notes || "");
  const [isEditing, setIsEditing] = useState(false); // Track if editing

  const inputRef = useRef(null);
  const noteRef = useRef(notes || "");

  const isLocked = false;
  // const { isLocked } = useLocked();
  // const { userData } = userDataContext(); 

  useEffect(() => {
    console.log("item: ", item);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  // const openModifyItem = () => {
  //   if(!isLocked) {
  //     setModifyVisible(!modifyVisible);
  //   }
  // }

  // const handleNoteClick = () => {
  //   noteRef.current = notes; 
  //   setIsEditing(true);
  //   setModifyVisible(false);
  // };

  // const handleNoteChange = (e) => {
  //   setNotes(e.target.value);
  // };

  // Edit item notes
  // const handleEditNotes = (notes, cartId, itemId) => {
  //     const data = {
  //       accessToken: userData,
  //       notes: notes.trim(),
  //       cartId,
  //       itemId,
  //     };

  //     chrome.runtime.sendMessage(
  //       { action: "editItem", data: data },
  //       (response) => {
  //         if (chrome.runtime.lastError) {
  //           console.error("Error communicating with background script:", chrome.runtime.lastError.message);
  //           return;
  //         }

  //         if (response?.status === "success") {
  //           chrome.runtime.sendMessage({action: "editItem", data: response.data});
  //         } else {
  //           console.error("Error editing notes:", response?.message);
  //         }
  //       }
  //     );
  // };

  // useEffect(() => {
  //   if (isEditing && inputRef.current) {
  //     const length = inputRef.current.value.length;
  //     inputRef.current.setSelectionRange(length, length); // Move cursor to the end
  //     inputRef.current.focus();
  //   }
  // }, [isEditing]);

  // const handleOffNoteClick = () => {
  //   console.log("curr", notes);
  //   console.log("old", noteRef.current)
  //   if (notes.trim() !== noteRef.current.trim()) {
  //     handleEditNotes(notes, cartId, itemId);
  //   }
  //   setIsEditing(false);
  // };

  const imageContent = (
    <div className="w-20 h-20">
      <img 
        src={item.image} 
        alt="" 
        className="w-full h-full object-cover"
      />
    </div>
  );


  return (
    <div className="flex flex-row bg-[var(--seconday-background)] px-2 py-1 gap-2">
      {!isLocked ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {imageContent}
        </a>
      ) : (
        imageContent
      )}

      <div className='overflow-hidden'>
        <div className='overflow-hidden'>
          <div className="overflow-hidden">
            <h4 className="whitespace-nowrap text-ellipsis overflow-hidden"> {item.name} </h4>
            <h4 className="shopping-item-price">  {item.price} </h4>
          </div>
          <div className="shopping-item-button-container">
            {/* <button className={isLocked ? "disabled-hover-modify" : ""} onClick={openModifyItem}> &#8942; </button> */}
          </div>
        </div>
            {/* {modifyVisible && <ModifyItemSec 
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
                {(notes || (notes && notes.trim() !== "")) ? notes : "None"}
              </div>
            )} */}
        </div>
    </div>
  )
};

export default Item;
