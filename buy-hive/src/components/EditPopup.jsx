import React, { useState } from 'react';

const EditPopup = ({ setIsVisible, newFileName, updateFileName, setModifyOrgSec, setModOrgHidden}) => {
  const [tempFileName, setTempFileName] = useState(newFileName);
  
  // Update local state on input change
  const handleInputChange = (e) => {
    setTempFileName(e.target.value);
  };

  // Confirm changes and update the main file name
  const handleConfirmClick = () => {
    if(tempFileName.trim() && tempFileName !== newFileName) {
      updateFileName(tempFileName);
      setIsVisible(false); 
      setModifyOrgSec(false);
      setModOrgHidden(false);
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
        }}> Close </button>
    </section>
  </>
  )
};

export default EditPopup;
