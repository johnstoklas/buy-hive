import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { userDataContext } from './contexts/UserProvider.jsx';

const AddFile = ({ 
  setFileName, 
  fileName, 
  isVisible, 
  setIsVisible,
  organizationSections,
  setOrganizationSections
 }) => {
  const addFile = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const {userData} = userDataContext();

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleClickOutside = (event) => {
    if (isVisible && addFile.current && !addFile.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible]);

  const handleAddSection = (fileName) => {
      if (!userData) return;

      const trimmedFileName = fileName.trim();
      if (!trimmedFileName) return;

      const isDuplicate = organizationSections.some((section) => section.cart_name === trimmedFileName);
      if (isDuplicate) return;

      const data = { email: userData.email, cartName: trimmedFileName };

      chrome.runtime.sendMessage({ action: "addNewFolder", data }, (response) => {
        if (response?.status === "success" && response?.data) {
          setOrganizationSections((prev) => [...prev, response.data]);
          setFileName("");
        } else {
          console.log(error);
        }
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddSection(fileName)
    }
  };
  
  return (isVisible || isAnimating) ? (
    <section 
      id="add-file-section"
      className={isVisible ? "slide-in-add-file" : "slide-out-add-file"} 
      ref={addFile}
      onAnimationEnd={() => {
        if (!isVisible) setIsAnimating(false);
      }}
    > 
      <input 
        type="text" 
        id="file-title" 
        placeholder="Folder Name" 
        value={fileName} 
        onChange={(e) => setFileName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button 
        type="button" 
        id="submit-file" 
        onClick={() => handleAddSection(fileName)} 
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>
    </section>
  ) : null;
};

export default AddFile;
