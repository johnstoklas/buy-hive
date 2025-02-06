import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faShare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import EditNotes from './EditNotes.jsx';
import DeletePopup from './DeletePopup.jsx';

const ModifyItemSec = ({ 
    notesContent, 
    handleEditNotes, 
    cartId, 
    itemId, 
    setNotes,
    handleDeleteItem
 }) => {  
    
    const [editNotesVisible, setEditNotesVisible] = useState(false);
    const [deleteItemVisible, setDeleteItemVisible] = useState(false);
    
    const changeEditNotesVisible = () => {
        setEditNotesVisible(!editNotesVisible);
    }

    const changeDeleteItemVisible = () => {
        setDeleteItemVisible(!deleteItemVisible);
    }

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
            {deleteItemVisible && <DeletePopup 
                type="item"
                cartId={cartId}
                itemId={itemId}
                handleDeleteItem={handleDeleteItem}
                setIsVisible={setDeleteItemVisible}
            />}
            <div className="modify-org-sec modify-item-sec">
                <button onClick={changeEditNotesVisible}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <p> Edit </p>
                </button>
                <button>
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