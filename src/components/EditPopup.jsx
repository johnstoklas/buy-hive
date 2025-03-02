import React, { useState } from 'react';
import { useLocked } from './contexts/LockedProvider.jsx';

const EditPopup = ({ 
  setIsVisible, 
  currFileName, 
  setModifyOrgSec, 
  setModOrgHidden, 
  handleEditSection,
  cartId
 }) => {
  const [tempFileName, setTempFileName] = useState(currFileName);

  const { isLocked, setIsLocked } = useLocked();
  
  // Update local state on input change
  const handleInputChange = (e) => {
    setTempFileName(e.target.value);
  };

  // Confirm changes and update the main file name
  const handleConfirmClick = async () => {
    if (tempFileName.trim() && tempFileName !== currFileName) {
      try {
        await handleEditSection(tempFileName, cartId);
        setIsVisible(false);
        setModifyOrgSec(false);
        setModOrgHidden(false);
        setIsLocked(true);
      } catch (error) {
        alert("Error updating folder. Please try again.");
      }
    } else if (!tempFileName.trim()) {
      alert("Folder name cannot be empty.");
    } else {
      alert("Folder name is unchanged.");
    }
  };
  
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConfirmClick();
    }
  };

  return (
  <>
    <section id="edit-popup-section"> 
      <div id="edit-popup-header-section">
        <p id="edit-popup-header"> Edit Folder Name </p>
        <p id="close-edit-popup-button" onClick={() => {
          setIsVisible(false);
          setModifyOrgSec(false);
          setModOrgHidden(false);
          setIsLocked(false);
        }}> &#10005; </p>
      </div>
        <input 
          type="text" 
          placeholder="Edit Folder Name" 
          maxLength="22" 
          value={tempFileName}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button id="confirm-edit-popup"
            type="button" 
            onClick={handleConfirmClick}
        >
            Confirm Changes
        </button>
        <button id="close-edit-popup" onClick={() => {
          setIsVisible(false);
          setModifyOrgSec(false);
          setModOrgHidden(false);
          setIsLocked(false);
        }}> Close </button>
    </section>
  </>
  )
};

export default EditPopup;
