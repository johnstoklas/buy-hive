import React, { useState, useEffect } from 'react';

const SelectFolders = ({ cartsArray }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [organizationSections, setOrganizationSections] = useState([]);

  useEffect(() => {
    const array = [];
    cartsArray.forEach((section) => {
      array.push(section.cart_name); // Use push instead of add
    });
    setOrganizationSections(array); // Use the new array here, not cartsArray
  }, [cartsArray]);
  

  //const options = ["Option 1", "Option 2", "Option 3", "Option 4", "5", "6", "7", "8"];

  const handleCheckboxChange = (organizationSections) => {
    if (selectedOptions.includes(organizationSections)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, organizationSections]);
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
            {organizationSections.map((option) => (
                <li key={option}>
                <label className="custom-checkbox">
                    <input
                    type="checkbox"
                    value={option}
                    checked={selectedOptions.includes(organizationSections)}
                    onChange={() => handleCheckboxChange(organizationSections)}
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
