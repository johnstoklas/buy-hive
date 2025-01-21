import React from 'react';

const EditPopup = ({ setIsVisible, newFileName, updateFileName }) => (
  <>
    <section id="edit-popup-section"> 
        <input 
          type="text" 
          placeholder="Edit Folder Name" 
          maxLength="22" 
          value={newFileName}
          onChange={(e) => updateFileName(e.target.value)}
        />
        <button id="confirm-edit-popup"
            type="button" 
            onClick={() => {
                updateFileName(newFileName);
                setIsVisible(false);
            }}
        >
            Confirm Changes
        </button>
        <button id="close-edit-popup" onClick={() => setIsVisible(false)}> &#10005; </button>
    </section>
  </>
);

export default EditPopup;
