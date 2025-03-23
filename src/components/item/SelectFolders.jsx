import React, { useState, useEffect } from 'react';

const SelectFolders = ({ 
  cartsArray, 
  setSelectedCarts,
  moveItem,
  cartId, 
  item,
  handleAddSection
}) => {
  const [selectedCartNames, setSelectedCartNames] = useState([]); // Store selected cart names
  const [isAddingFolder, setIsAddingFolder] = useState(false); // Whether the user is adding a new folder
  const [newFolderName, setNewFolderName] = useState(''); // New folder name input

  useEffect(() => {
    initializeSelectedFolders();
  }, [moveItem]);

  const initializeSelectedFolders = () => {
    if(item) {
      const selectedNames = [];
      const selectedIds = [];

      item.selected_cart_ids.forEach(selectedCartId => {
        const selectedCart = cartsArray.find(c => c.cart_id === selectedCartId);
        if(selectedCart) {
          selectedNames.push(selectedCart.cart_name);
          selectedIds.push(selectedCart.cart_id);
        }
      });

      setSelectedCartNames(selectedNames);
      setSelectedCarts(selectedIds);
    }
  };

  const handleCheckboxChange = (cartName) => {
    setSelectedCartNames((prevNames) => {
      const newSelectedNames = prevNames.includes(cartName)
        ? prevNames.filter(name => name !== cartName) // Remove if unchecked
        : [...prevNames, cartName]; // Add if checked

      // Map selected names to their respective cart IDs
      const selectedIds = cartsArray
        .filter(cart => newSelectedNames.includes(cart.cart_name))
        .map(cart => cart.cart_id);

      setSelectedCarts(selectedIds);
      return newSelectedNames;
    });
  };

  const handleInputChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddSection(newFolderName);
    }
  };

  const closeKeyDown = () => {
    setNewFolderName("");
    setIsAddingFolder(false);
  };

  return (
    <section id="select-folders-container">
      <div id="select-folders-header">
        <p>Select Folders</p>
        {!moveItem && (
          <button onClick={() => setIsAddingFolder(true)}>New Folder</button>
        )}
      </div>
      <hr id="sf-line-break" />
      <div id="select-folders-section">
        <div id="sf-dropdown">
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cartsArray.map((cart) => (
              <li key={cart.cart_id}>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    value={cart.cart_name}
                    checked={selectedCartNames.includes(cart.cart_name)}
                    onChange={() => handleCheckboxChange(cart.cart_name)}
                  />
                  <span className="checkmark"></span>
                  {cart.cart_name}
                </label>
              </li>
            ))}
            {isAddingFolder && (
              <li key="new-folder">
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={false}
                    disabled
                  />
                  <span className="checkmark"></span>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={closeKeyDown}
                    placeholder="Folder name"
                    id="add-folder-input"
                    autoFocus
                  />
                </label>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SelectFolders;
