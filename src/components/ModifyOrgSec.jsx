import React, { useState, useEffect, useRef } from 'react';
import EditPopup from './EditPopup.jsx';
import DeletePopup from './DeletePopup.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from './LockedProvider.jsx';

const ModifyOrgSec = ({ 
  setModifyOrgSec, 
  modOrgHidden, 
  setModOrgHidden, 
  position, 
  handleDeleteSection,
  cartId,
  handleTitleClick
}) => {

  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const { setIsLocked } = useLocked();

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
    handleTitleClick();
  }

  // toggles delete folder popup
  const toggleDeletePopup = () => {
    setDeletePopupVisible(!deletePopupVisible);
  }

  useEffect(() => {
    setIsLocked(editPopupVisible || deletePopupVisible);
  }, [editPopupVisible, deletePopupVisible]);
  

  // Updates if modification screen should be visible when another popup appears
  useEffect(() => {
      setModOrgHidden(editPopupVisible || deletePopupVisible);
  }, [editPopupVisible, deletePopupVisible]);

  return (
  <>
    {deletePopupVisible && <DeletePopup 
      setIsVisible={setDeletePopupVisible}
      setSec={setModifyOrgSec}
      setSecHidden={setModOrgHidden}
      handleDeleteSection={handleDeleteSection}
      cartId={cartId}
      type={"folder"}
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
