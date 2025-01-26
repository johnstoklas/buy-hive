import React, { useState, useEffect, useRef } from 'react';
import EditPopup from './EditPopup.jsx';
import DeletePopup from './DeletePopup.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'


const ModifyOrgSec = ({ updateFileName, newFileName, setModifyOrgSec, modOrgHidden, setModOrgHidden, setIsLocked, position }) => {

  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const modifyOrgSec = useRef(null);

  // If the user clicks out of the modification pop-up it disappears
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modifyOrgSec.current && !modifyOrgSec.current.contains(event.target) && !editPopupVisible && !deletePopupVisible) {
        setModifyOrgSec(false); 
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setModifyOrgSec, editPopupVisible, deletePopupVisible]);

  // toggles edit title popup
  const toggleEditPopup = () => {
    setEditPopupVisible(!editPopupVisible);
    setIsLocked(editPopupVisible);
  }

  // toggles delete folder popup
  const toggleDeletePopup = () => {
    setDeletePopupVisible(!deletePopupVisible);
    setIsLocked(deletePopupVisible);
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
      setIsLocked={setIsLocked}
    />}
    {deletePopupVisible && <DeletePopup 
      setIsVisible={setDeletePopupVisible}
      setModifyOrgSec={setModifyOrgSec}
      setModOrgHidden={setModOrgHidden}
      setIsLocked={setIsLocked}
    />}
    <div className={`modify-org-sec ${modOrgHidden ? "hidden" : ""} ${position === 'above' ? "above" : "" }`} ref={modifyOrgSec} >
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
