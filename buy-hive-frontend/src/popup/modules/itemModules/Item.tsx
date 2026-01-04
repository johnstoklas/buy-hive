import { useLocked } from '@/popup/context/LockedProvider';
import DropdownButton from '@/popup/ui/dropdownButton';
import type { ItemType } from '@/types/ItemType';
import { useState, useEffect, useRef } from 'react';
import ItemDropdown from './ItemDropdown';
import type { CartType } from '@/types/CartType';
import Image from '@/popup/ui/image';
import ItemHeader from '@/popup/ui/itemHeader';
// import ModifyItemSec from './ModifyItemSec.jsx';
// import { useLocked } from '../contexts/LockedProvider.jsx'
// import { userDataContext } from '../contexts/UserProvider.jsx';

interface ItemProp {
  cart: CartType;
  item: ItemType;
  updateCarts;
}

const Item = ({ cart, item, updateCarts } : ItemProp) => {

  const [itemDropdownVisible, setItemDropdownVisible] = useState(false);
  const [itemNote, setItemNote] = useState(item.notes || "");
  const [isEditing, setIsEditing] = useState(false); // Track if editing

  const itemNoteRef = useRef(null);
  const prevNoteRef = useRef(item.notes || "");
  const itemDropdownButtonRef = useRef(null);

  const { isLocked } = useLocked();

  useEffect(() => {
    if (isEditing && itemNoteRef.current) {
      itemNoteRef.current.focus();
    }
  }, [isEditing]);

  const handleItemNoteSelect = () => {
    if (isLocked) return;
    setIsEditing(true);
    // setModifyOrgSec(false);
  };
  
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

  // Edit item notes
  const handleEditNotes = () => {
      const data = {
        notes: itemNote.trim(),
        itemId: item.item_id,
      };

      chrome.runtime.sendMessage({ action: "editItem", data: data }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error communicating with background script:", chrome.runtime.lastError.message);
            return;
          }

          if (response?.status === "success") {
            // showNotification("Item succesfully moved!", true);
          } else {
            console.error("Error editing notes:", response?.message);
            // showNotification("Item succesfully moved!", true);
          }
        }
      );
  };

  // useEffect(() => {
  //   if (isEditing && inputRef.current) {
  //     const length = inputRef.current.value.length;
  //     inputRef.current.setSelectionRange(length, length); // Move cursor to the end
  //     inputRef.current.focus();
  //   }
  // }, [isEditing]);

  const handleNoteBlur = () => {
    if (itemNote.trim() === prevNoteRef.current.trim()) return;
    handleEditNotes();
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (itemNote.trim() === prevNoteRef.current.trim()) return;
      e.preventDefault();   
      handleEditNotes();    
      setIsEditing(false);
    }
  };


  return (
    <div className="flex flex-row px-2 py-2 gap-2 border border-[var(--secondary-background-hover)] rounded-md">
      {!isLocked ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {<Image 
            item={item}
          />}
        </a>
      ) : (
        <Image 
          item={item}
        />
      )}

      <div className='overflow-hidden'>
        <div className='flex flex-row gap-1'>
          <ItemHeader
            item={item}
          />
          <DropdownButton
            dropdownVisible={itemDropdownVisible}
            setDropdownVisible={setItemDropdownVisible}
            buttonRef={itemDropdownButtonRef}
          />
        </div>
            {isEditing ? (
              <textarea
                ref={itemNoteRef}
                className="shopping-item-notes"
                value={itemNote}
                onChange={(e) => {setItemNote(e.target.value)}}
                onBlur={handleNoteBlur}
                onKeyDown={handleKeyDown}
              />              
            ) : (
              <div 
                className="flex flex-1 px-1 py-1 bg-[var(--input-color)] rounded-md text-xs"
                onDoubleClick={handleItemNoteSelect} 
              >
                {(itemNote || (itemNote && itemNote.trim() !== "")) ? itemNote : "None"}
              </div>
            )}
        </div>
        {itemDropdownVisible && <ItemDropdown 
          cart={cart}
          item={item}
          itemDropdownVisible={itemDropdownVisible}
          setItemDropdownVisible={setItemDropdownVisible}
          itemDropdownButtonRef={itemDropdownButtonRef}
          handleItemNoteSelect={handleItemNoteSelect}
          updateCarts={updateCarts}
        />}
    </div>
  )
};

export default Item;
