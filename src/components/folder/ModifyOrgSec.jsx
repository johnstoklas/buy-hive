import React, { useState, useEffect, useRef } from 'react';
import DeletePopup from './DeletePopup.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from '../contexts/LockedProvider.jsx';
import ShareFolder from './ShareFolder.jsx';

const ModifyOrgSec = ({ 
  setModifyOrgSec, 
  modOrgHidden, 
  setModOrgHidden, 
  position, 
  cartId,
  handleTitleClick,
  setOrganizationSections,
  cartName,
  updateItems,
}) => {

  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [sharePopupVisible, setSharePopupVisible] = useState(false);

  const { setIsLocked } = useLocked();

  const modifyOrgSec = useRef(null);

  // If the user clicks out of the modification pop-up it disappears
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modifyOrgSec.current && !modifyOrgSec.current.contains(event.target) && !deletePopupVisible && !sharePopupVisible) {
        setModifyOrgSec(false); 
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setModifyOrgSec, deletePopupVisible, sharePopupVisible]);

  // toggles edit title popup
  const toggleEdit = () => {
    handleTitleClick();
  }

  // toggles delete folder popup
  const toggleDeletePopup = () => {
    setDeletePopupVisible(!deletePopupVisible);
  }

  const toggleSharePopup = () => {
    setSharePopupVisible(!sharePopupVisible);
  }

  useEffect(() => {
    setIsLocked(deletePopupVisible || sharePopupVisible);
  }, [deletePopupVisible, sharePopupVisible]);
  

  // Updates if modification screen should be visible when another popup appears
  useEffect(() => {
      setModOrgHidden(deletePopupVisible || sharePopupVisible);
  }, [deletePopupVisible, sharePopupVisible]);

  return (
  <>
    {sharePopupVisible && <ShareFolder 
      setIsVisible={setSharePopupVisible}
      setSec={setModifyOrgSec}
      setSecHidden={setModOrgHidden}
      cartId={cartId}
      cartName={cartName}
    />}
    {deletePopupVisible && <DeletePopup 
      setIsVisible={setDeletePopupVisible}
      setSec={setModifyOrgSec}
      setSecHidden={setModOrgHidden}
      cartId={cartId}
      type={"folder"}
      setOrganizationSections={setOrganizationSections}
      updateItems={updateItems}
    />}

    <div className={`modify-org-sec ${modOrgHidden ? "hidden" : ""} ${position === 'above' ? "above" : "" }`} ref={modifyOrgSec} >
        <button onClick={toggleEdit}>
          <FontAwesomeIcon icon={faPenToSquare} />
          <p> Edit </p>
        </button>
        <button onClick={toggleSharePopup}>
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
