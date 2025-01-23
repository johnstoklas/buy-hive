import React, { useState, useEffect } from 'react';
import EditPopup from './EditPopup.jsx';

const ModifyOrgSec = ({ updateFileName, newFileName, setModifyOrgSec, modOrgHidden, setModOrgHidden }) => {
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  // toggles edit title popup
  const toggleEditPopup = () => {
    setEditPopupVisible(!editPopupVisible);
  }

  // Updates if modification screen should be visible when another popup appears
  useEffect(() => {
      setModOrgHidden(editPopupVisible)
  }, [editPopupVisible]);

  return (
  <>
    {editPopupVisible && <EditPopup 
      newFileName={newFileName}
      updateFileName={updateFileName}
      setIsVisible={setEditPopupVisible}
      setModifyOrgSec={setModifyOrgSec}
      setModOrgHidden={setModOrgHidden}
    />}
    <div className={`modify-org-sec ${modOrgHidden ? "hidden" : ""}`}>
        <button onClick={toggleEditPopup}>Edit</button>
        <button>Share</button>
        <button className="delete-button">Delete</button>
    </div>
  </>
  );
};

export default ModifyOrgSec;
