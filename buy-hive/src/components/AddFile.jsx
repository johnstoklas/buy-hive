import React from 'react';

const AddFile = ({ onAddSection, setFileName, fileName, isVisible }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onAddSection(fileName);
    }
  };
  return (
  <>
    <section id="add-file-section" className={isVisible ? "slide-in" : "slide-out"}> 
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
            ✓ 
        </button>
    </section>
  </>
  )
};

export default AddFile;
