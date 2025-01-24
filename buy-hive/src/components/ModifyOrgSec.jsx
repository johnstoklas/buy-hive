import React, { useState, useEffect } from 'react';
import EditPopup from './EditPopup.jsx';
import DeletePopup from './DeletePopup.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'


const ModifyOrgSec = ({ updateFileName, newFileName, setModifyOrgSec, modOrgHidden, setModOrgHidden }) => {

  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  // toggles edit title popup
  const toggleEditPopup = () => {
    setEditPopupVisible(!editPopupVisible);
  }

  // toggles delete folder popup
  const toggleDeletePopup = () => {
    setDeletePopupVisible(!deletePopupVisible);
  }

  // Updates if modification screen should be visible when another popup appears
  useEffect(() => {
      setModOrgHidden(editPopupVisible || deletePopupVisible);
  }, [editPopupVisible, deletePopupVisible]);

  return (
  <>
    {editPopupVisible && <EditPopup 
      newFileName={newFileName}
      updateFileName={updateFileName}
      setIsVisible={setEditPopupVisible}
      setModifyOrgSec={setModifyOrgSec}
      setModOrgHidden={setModOrgHidden}
    />}
    {deletePopupVisible && <DeletePopup 
      setIsVisible={setDeletePopupVisible}
      setModifyOrgSec={setModifyOrgSec}
      setModOrgHidden={setModOrgHidden}
    />}
    <div className={`modify-org-sec ${modOrgHidden ? "hidden" : ""}`}>
        <button onClick={toggleEditPopup}>
          <FontAwesomeIcon icon={faPenToSquare} />
          <p> Edit </p>
        </button>
        <button>
          <FontAwesomeIcon icon={faArrowUpFromBracket} />
          <p> Share </p>
        </button>
        <button className="delete-button" onClick={toggleDeletePopup}>
          <FontAwesomeIcon icon={faTrashCan} />
          <p> Delete </p>
        </button>
    </div>
  </>
  );
};

export default ModifyOrgSec;
