import React, { useState } from 'react';
import { userDataContext } from './contexts/UserProvider.jsx';
import { useLocked } from './contexts/LockedProvider.jsx';

const ShareFolder = ({
  setIsVisible,
  setSec,
  setSecHidden, 
  cartId,
  cartName, 
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
        email: userData.email,
        cartId: cartId,
        recipient: email,
      }

      setIsLoading(true);
      chrome.runtime.sendMessage({ action: "sendEmail", data }, (response) => {
        console.log(response);
        if (response?.status === "success") {
          setIsLoading(false);
          setSuccessMessage(
            <>
              Successfully shared <em>{cartName}</em>!
            </>
          );
                    
          setTimeout(() => {
            setSuccessMessage("");
            closePopup();  
          }, 500);
        } else {
          console.log("message: ", response);
          setIsLoading(false);
        }
      });
    } else {
      console.log("invalid email");
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendEmail();
    }
  };
  
  return (
    <>
      <section id="share-folder-section" className={(isLoading || successMessage) ? "center-items" : ""}> 
        {!isLoading && !successMessage ? (
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
        ) : isLoading ? (
          <div className="spinner-loader"></div>
        ) : (
            <div id="share-folder-success-message"> {successMessage} </div>
        )}
      </section>
    </>
  )
};

export default ShareFolder;
