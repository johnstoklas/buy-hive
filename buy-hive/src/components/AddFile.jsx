import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const AddFile = ({ onAddSection, setFileName, fileName, isVisible, setIsVisible }) => {

  const addFile = useRef(null);
    {/*
    // If the user clicks out of the add item pop-up it disappears
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (addFile.current && !addFile.current.contains(event.target)) {
          setIsVisible(false); 
        }
      };
  
      document.addEventListener('click', handleClickOutside);
  
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [setIsVisible]);*/}
    
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onAddSection(fileName);
    }
  };
  
  return (
  <>
    <section id="add-file-section" className={isVisible ? "slide-in" : "slide-out"} ref={addFile}> 
        <input 
          type="text" 
          id="file-title" 
          placeholder="Folder Name" 
          maxLength="22" 
          value={fileName} 
          onChange={(e) => setFileName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
            type="button" 
            id="submit-file" 
            onClick={() => onAddSection(fileName)} 
        >
            <FontAwesomeIcon icon={faCheck} />
        </button>
    </section>
  </>
  )
};

export default AddFile;
