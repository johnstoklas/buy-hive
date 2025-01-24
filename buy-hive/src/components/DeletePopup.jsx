import React, { useState } from 'react';

const DeletePopup = ({ setIsVisible, setModifyOrgSec, setModOrgHidden}) => {
  const deleteFolder = () => {
    setIsVisible(false);
    setModifyOrgSec(false);
    setModOrgHidden(false);
  }
  return (
  <>
    <section id="delete-popup-section"> 
        <p> Are you sure you want to delete this folder? </p>
        <div id="dps-button-section">
          <button id="dps-delete-button" onClick={deleteFolder}> Yes, I'm sure </button>
          <button id="dps-cancel-button" onClick={() => {
            setIsVisible(false);
            setModifyOrgSec(false);
            setModOrgHidden(false);
          }}> No, cancel </button>
        </div>
    </section>
  </>
  )
};

export default DeletePopup;
