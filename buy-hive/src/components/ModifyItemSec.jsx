import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faShare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import EditNotes from './EditNotes.jsx';
import DeletePopup from './DeletePopup.jsx';
import MoveItem from './MoveItem.jsx';

const ModifyItemSec = ({ 
    notesContent, 
    handleEditNotes, 
    cartId, 
    itemId, 
    setNotes,
    handleDeleteItem,
    handleNoteClick,
    modifyItemSec,
    cartsArray,
    item
 }) => {  
    
    const [editNotesVisible, setEditNotesVisible] = useState(false);
    const [deleteItemVisible, setDeleteItemVisible] = useState(false);
    const [moveItemVisible, setMoveItemVisible] = useState(false);

    const [modItemHidden, setModItemHidden] = useState(false);
    
    const changeEditNotesVisible = () => {
        handleNoteClick();
        //setEditNotesVisible(!editNotesVisible);
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
            {editNotesVisible && <EditNotes 
                notesContent={notesContent}
                handleEditNotes={handleEditNotes}
                cartId={cartId}
                itemId={itemId}
                setNotesContent={setNotes}
                setEditNotesVisible={setEditNotesVisible}
            />}
            {moveItemVisible && <MoveItem
                cartsArray={cartsArray}
                cartId={cartId}
                itemId={itemId}
                item={item}
            />}
            {deleteItemVisible && <DeletePopup 
                type="item"
                cartId={cartId}
                itemId={itemId}
                handleDeleteItem={handleDeleteItem}
                setIsVisible={setDeleteItemVisible}
                setSec={modifyItemSec}
                setSecHidden={setModItemHidden}
            />}
            <div className={`modify-org-sec modify-item-sec ${modItemHidden ? "hidden" : ""}`}>
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