import React, { useState } from 'react';

const SelectFolders = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = ["Option 1", "Option 2", "Option 3", "Option 4", "5", "6", "7", "8"];

  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <section id="select-folders-container">
        <div id="select-folders-header">
            <p> Select Folders </p>
            <button> New Folder </button>
        </div>
        <hr id="sf-line-break"></hr>
        <div id="select-folders-section">
        <div id="sf-dropdown">
            <ul style={{ listStyle: "none", padding: 0 }}>
            {options.map((option) => (
                <li key={option}>
                <label className="custom-checkbox">
                    <input
                    type="checkbox"
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    />
                    <span className="checkmark"></span>
                    {option}
                </label>
                </li>
            ))}
            </ul>
        </div>
        </div>
    </section>
  );
};

export default SelectFolders;
