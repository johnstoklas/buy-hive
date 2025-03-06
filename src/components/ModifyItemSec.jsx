import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faShare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import EditNotes from './EditNotes.jsx';
import DeletePopup from './DeletePopup.jsx';
import MoveItem from './MoveItem.jsx';
import { useLocked } from './contexts/LockedProvider.jsx';
import { userDataContext } from './contexts/UserProvider.jsx';

const ModifyItemSec = ({ 
    cartId, 
    itemId, 
    handleNoteClick,
    setModifyItemSec,
    cartsArray,
    item,
    itemsInFolder,
    setItemsInFolder,
 }) => {  
    
    const [deleteItemVisible, setDeleteItemVisible] = useState(false);
    const [moveItemVisible, setMoveItemVisible] = useState(false);

    const [modItemHidden, setModItemHidden] = useState(false);

    const { setIsLocked } = useLocked();
    const { userData } = userDataContext();

    const modifyItemSec = useRef(null);
    
    // If the user clicks out of the modification pop-up it disappears
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (modifyItemSec.current && !modifyItemSec.current.contains(event.target) && !deleteItemVisible && !moveItemVisible) {
        setModifyItemSec(false); 
        }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
        document.removeEventListener('click', handleClickOutside);
    };
    }, [setModifyItemSec, deleteItemVisible, moveItemVisible]);

    useEffect(() => {
        setIsLocked(deleteItemVisible || moveItemVisible);
      }, [deleteItemVisible, moveItemVisible]);
    
    const changeEditNotesVisible = () => {
        handleNoteClick();
    }

    const changeMoveItemVisible = () => {
        setMoveItemVisible(!moveItemVisible);
    }

    const changeDeleteItemVisible = () => {
        setDeleteItemVisible(!deleteItemVisible);
    }

   useEffect(() => {
         setModItemHidden(deleteItemVisible || moveItemVisible);
     }, [deleteItemVisible, moveItemVisible]);

    return (
        <>
            {moveItemVisible && <MoveItem
                cartsArray={cartsArray}
                cartId={cartId}
                itemId={itemId}
                item={item}
                setMoveItemVisible={setMoveItemVisible}
                setSec={setModifyItemSec}
                setSecHidden={setModItemHidden}
                setItemsInFolder={setItemsInFolder}
            />}
            {deleteItemVisible && <DeletePopup 
                type="item"
                cartId={cartId}
                itemId={itemId}
                item={item}
                setIsVisible={setDeleteItemVisible}
                setSec={setModifyItemSec}
                setSecHidden={setModItemHidden}
                itemInFolder={itemsInFolder}
                setItemsInFolder={setItemsInFolder}
            />}
            <div 
            className={`modify-org-sec modify-item-sec ${modItemHidden ? "hidden" : ""}`}
            ref={modifyItemSec}
            >
                <button onClick={changeEditNotesVisible}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <p> Edit </p>
                </button>
                <button onClick={changeMoveItemVisible}>
                    <FontAwesomeIcon icon={faShare} />
                    <p> Move </p>
                </button>
                <button onClick={changeDeleteItemVisible} className="delete-button">
                    <FontAwesomeIcon icon={faTrashCan} />
                    <p> Delete </p>
                </button>
            </div>
        </>
    );
};

export default ModifyItemSec;