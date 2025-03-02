import React, { useState, useEffect } from 'react';

const SelectFolders = ({ 
  cartsArray, 
  setSelectedCarts,
  moveItem,
  cartId, 
  item
}) => {
  const [selectedCartNames, setSelectedCartNames] = useState([]); // Store selected cart names

  useEffect(() => {
    initializeSelectedFolders();
  }, []);

  const initializeSelectedFolders = () => {
    const selectedNames = [];
    const selectedIds = [];


    cartsArray.forEach(cart => {
      if (cart.cart_id === cartId) {
        cart.items.forEach(i => {
          if (i.item_id === item.item_id) {
            item.selected_cart_ids.forEach(selectedCartId => {
              const selectedCart = cartsArray.find(c => c.cart_id === selectedCartId);
              selectedNames.push(selectedCart.cart_name);
              selectedIds.push(selectedCart.cart_id);
            });
          }
        });
      }
    });

    setSelectedCartNames(selectedNames);
    setSelectedCarts(selectedIds);
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

        console.log(selectedIds);
      setSelectedCarts(selectedIds);
      return newSelectedNames;
    });
  };

  return (
    <section id="select-folders-container">
      <div id="select-folders-header">
        <p>Select Folders</p>
        {!moveItem && <button>New Folder</button>}
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
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SelectFolders;
