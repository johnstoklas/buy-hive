import React from 'react';

const AddFile = ({ onAddSection, setFileName, fileName, isVisible }) => (
  <>
    <section id="add-file-section" className={isVisible ? "slide-in" : "slide-out"}> 
        <input 
          type="text" 
          id="file-title" 
          placeholder="Folder Name" 
          maxLength="22" 
          value={fileName} 
          onChange={(e) => setFileName(e.target.value)}
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
);

export default AddFile;
