import React from 'react';

const AddFile = ({ onAddSection, setFileName, fileName }) => (
  <>
    <section id="add-file-section"> 
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
