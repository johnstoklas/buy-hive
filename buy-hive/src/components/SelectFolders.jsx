import React from "react";

const SelectFolders = ({ cartsArray, selectedCarts, setSelectedCarts }) => {

  const handleCheckboxChange = (cartId) => {
    setSelectedCarts((prevSelected) =>
      prevSelected.includes(cartId)
        ? prevSelected.filter((id) => id !== cartId) // ✅ Remove if unchecked
        : [...prevSelected, cartId] // ✅ Add if checked
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
            {cartsArray.map((cart) => (
              <li key={cart.cart_id}>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    value={cart.cart_id}
                    checked={selectedCarts.includes(cart.cart_id)}
                    onChange={() => handleCheckboxChange(cart.cart_id)}
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
