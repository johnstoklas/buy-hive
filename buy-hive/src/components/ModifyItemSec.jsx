import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faShare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import EditNotes from './EditNotes.jsx';

const ModifyItemSec = ({ notesContent, handleEditNotes, cartId, itemId, setNotes }) => {  
    
    const [editNotesVisible, setEditNotesVisible] = useState(false);
    
    const changeEditNotesVisible = () => {
        setEditNotesVisible(!editNotesVisible);
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
            <div className="modify-org-sec modify-item-sec">
                <button onClick={changeEditNotesVisible}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <p> Edit </p>
                </button>
                <button>
                    <FontAwesomeIcon icon={faShare} />
                    <p> Move </p>
                </button>
                <button className="delete-button">
                    <FontAwesomeIcon icon={faTrashCan} />
                    <p> Delete </p>
                </button>
            </div>
        </>
    );
};

export default ModifyItemSec;