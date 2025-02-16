import React, { useState, useEffect } from 'react';

const SelectFolders = ({ cartsArray }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [organizationSections, setOrganizationSections] = useState([]);

  useEffect(() => {
    const array = cartsArray.map((section) => section.cart_name);
    setOrganizationSections(array);
  }, [cartsArray]);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  };

  return (
    <section id="select-folders-container">
      <div id="select-folders-header">
        <p>Select Folders</p>
        <button>New Folder</button>
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
