import React, { useState } from 'react';
import { userDataContext } from '../contexts/UserProvider.jsx';
import { useLocked } from '../contexts/LockedProvider.jsx';

const ShareFolder = ({
  setIsVisible,
  setSec,
  setSecHidden, 
  cartId,
  cartName, 
  showNotification,
}) => {

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");  // New state for success message

  const { setIsLocked } = useLocked();
  const { userData } = userDataContext();

  const closePopup = () => {
    setSec(false);
    setSecHidden(false);
    setIsLocked(false);
    setIsVisible(false);
  }

  const sendEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(email)) {

      const data = {
        accessToken: userData,
        cartId: cartId,
        recipient: email,
      }

      setIsLoading(true);
      chrome.runtime.sendMessage({ action: "sendEmail", data }, (response) => {
        console.log(response);
        if (response?.status === "success") {
          setIsLoading(false);
          closePopup();  
          showNotification("Email succesfully sent!", true);
        } else {
          console.error("message: ", response);
          setIsLoading(false);
          showNotification("Error sending email", false);
        }
      });
    } else {
      console.log("invalid email");
      showNotification("Invalid email", false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendEmail();
    }
  };
  
  return (
    <>
      <section id="share-folder-section" className={isLoading ? "center-items" : ""}> 
        {!isLoading ? (
          <>        
            <div id="share-folder-header-section">
              <p id="share-folder-header"> Share Folder </p>
              <p id="close-share-folder-button" onClick={closePopup} > &#10005; </p>
            </div>
            <p id="share-folder-description"> 
              Enter a valid email to share <em>{cartName}</em>
            </p>
            <input 
              type="text" 
              placeholder="Enter Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              onKeyDown={handleKeyDown}
            />
            <div id="share-folder-button-container">
              <button id="confirm-share-folder" className="share-folder-button" type="button" onClick={sendEmail}> Send </button>
              <button id="close-share-folder" className="share-folder-button" onClick={closePopup}> Cancel </button>
            </div>
          </>
        ) : (
          <div className="spinner-loader"></div>
        )}
        </section>
    </>
  )
};

export default ShareFolder;
