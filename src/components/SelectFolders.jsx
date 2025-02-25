import React, { useState, useEffect } from 'react';

const SelectFolders = ({ 
  cartsArray, 
  setSelectedCarts,
  moveItem,
  cartId, 
  itemId
 }) => {
  const [allOptions, setAllOptions] = useState([]);
  const [organizationSections, setOrganizationSections] = useState([]);

  useEffect(() => {
    const array = [];
    cartsArray.forEach((section) => {
      array.push(section.cart_name); // Use push instead of add
    });
    setOrganizationSections(array); // Use the new array here, not cartsArray
  }, [cartsArray]);

  useEffect(() => {
    initializeSelectedFolders();
  }, [moveItem]);

  const initializeSelectedFolders = () => {
    const selectedFolders = [];
    const selectedFolderIds = [];
    
    cartsArray.forEach(cart => {
      if (cart.cart_id === cartId) {
        cart.items.forEach(item => {
          if (item.item_id === itemId) {
            item.selected_cart_ids.forEach(selectedCartId => {
              const selectedCart = cartsArray.find(c => c.cart_id === selectedCartId);
              if (selectedCart) {
                selectedFolders.push(selectedCart.cart_name);
                selectedFolderIds.push(selectedCart.cart_id);
              }
            });
          }
        });
      }
    });

    setAllOptions(selectedFolders);
    setSelectedCarts(selectedFolderIds);
  };

  const handleCheckboxChange = (option) => {
    console.log(cartsArray);

    console.log("options", option);

    if (allOptions.includes(option)) {
      setAllOptions(allOptions.filter((item) => item !== option));
    } else {
      setAllOptions([...allOptions, option]);
    }

    const selectedItems = [];
    cartsArray.forEach((cart) => {
      if (allOptions.includes(cart.cart_name)) {
        selectedItems.push(cart.cart_id);
      }
      else if(cart.cart_name === option) {
        selectedItems.push(cart.cart_id);
      }
    });
    
    console.log("selected items: ", selectedItems);
    setSelectedCarts(selectedItems);
  };

  return (
    <section id="select-folders-container">
        <div id="select-folders-header">
            <p> Select Folders </p>
            {moveItem ? (<></>) : (<button> New Folder </button>)}
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
                    checked={allOptions.includes(option)} // Check if the individual option is selected
                    onChange={() => handleCheckboxChange(option)} // Pass the individual option here
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
