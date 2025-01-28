import React, { useState } from 'react';

const EditPopup = ({ 
  setIsVisible, 
  currFileName, 
  setModifyOrgSec, 
  setModOrgHidden, 
  setIsLocked, 
  handleEditSection,
  cartId
 }) => {
  const [tempFileName, setTempFileName] = useState(currFileName);
  
  // Update local state on input change
  const handleInputChange = (e) => {
    setTempFileName(e.target.value);
  };

  // Confirm changes and update the main file name
  const handleConfirmClick = () => {
    if(tempFileName.trim() && tempFileName !== currFileName) {
      console.log("success!")
      handleEditSection(tempFileName, cartId);
      setIsVisible(false); 
      setModifyOrgSec(false);
      setModOrgHidden(false);
      setIsLocked(true);

      //chrome.runtime.sendMessage({ action: "editFolder", data: tempFileName });
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
