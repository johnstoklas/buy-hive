import React, { useState } from 'react';
import EditPopup from './EditPopup.jsx';

const ModifyOrgSec = ({ updateFileName, newFileName }) => {
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  const toggleEditPopup = () => {
    console.log(!editPopupVisible);
    setEditPopupVisible(!editPopupVisible);
  }

  return (
  <>
    {editPopupVisible && <EditPopup 
      newFileName={newFileName}
      updateFileName={updateFileName}
      setIsVisible={setEditPopupVisible}
    />}
    <div className="modify-org-sec">
        <button onClick={toggleEditPopup}>Edit</button>
        <button>Share</button>
        <button className="delete-button">Delete</button>
    </div>
  </>
  );
};

export default ModifyOrgSec;
