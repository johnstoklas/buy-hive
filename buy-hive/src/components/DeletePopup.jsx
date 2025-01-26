import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'


const DeletePopup = ({ setIsVisible, setModifyOrgSec, setModOrgHidden, setIsLocked}) => {

  const deleteFolder = () => {
    setIsVisible(false);
    setModifyOrgSec(false);
    setModOrgHidden(false);
    setIsLocked(false);
  }
  
  return (
  <>
    <section id="delete-popup-section"> 
        <p id="close-delete-popup" onClick={() => {
          setIsVisible(false);
          setModifyOrgSec(false);
          setModOrgHidden(false);
          setIsLocked(false);
        }}> &#10005; </p>
        <FontAwesomeIcon icon={faTrashCan} id="trash-icon" />
        <p> Are you sure you want to delete this folder? </p>
        <div id="dps-button-section">
          <button id="dps-delete-button" onClick={deleteFolder}> Yes, I'm sure </button>
          <button id="dps-cancel-button" onClick={() => {
            setIsVisible(false);
            setModifyOrgSec(false);
            setModOrgHidden(false);
            setIsLocked(false);
          }}> No, cancel </button>
        </div>
    </section>
  </>
  )
};

export default DeletePopup;
