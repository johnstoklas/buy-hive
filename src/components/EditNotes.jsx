import React, { useState } from 'react';

const EditNotes = ({ notesContent, handleEditNotes, cartId, itemId, setNotesContent, setEditNotesVisible }) => {
    const [notes, setNotes] = useState(notesContent);

    const updateNotesContent = () => {
        handleEditNotes(notes, cartId, itemId)
          .then(() => {
            setNotesContent(notes)
            setEditNotesVisible(false)

          })
          .catch(() => {
            console.error("error editing notes");
          });
    }

    return (
        <div className="edit-notes-container">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button onClick={updateNotesContent}>Save</button>
        </div>
    );
};

export default EditNotes;
