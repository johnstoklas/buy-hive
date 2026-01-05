import type { ItemType, ScrapedItemType } from '@/types/ItemTypes';
import{ useState, useEffect, type SetStateAction, type Dispatch } from 'react';
import { useCarts } from '../context/CartContext/useCart';

type ListProps =
    | {
        item: ScrapedItemType;
        addItem: true;
        setSelectedCartIds: Dispatch<SetStateAction<string[]>>;
      }
    | {
        item: ItemType;
        addItem?: false;
        setSelectedCartIds: Dispatch<SetStateAction<string[]>>;
    };
    
const List = ({ item, addItem, setSelectedCartIds } : ListProps) => {
    
    const [selectedCarts, setSelectedCarts] = useState<string[]>([]);
    // const [isAddingFolder, setIsAddingFolder] = useState(false); 
    // const [newFolderName, setNewFolderName] = useState(''); 

    const { carts } = useCarts();

    useEffect(() => {
        if (addItem) {
          setSelectedCarts([]);
          setSelectedCartIds([]);
          return;
        }
        const selectedNames: string[] = [];
        const selectedIds: string[] = [];

        const selected_cart_ids = carts
          .filter(cart => cart.item_ids.includes(item.item_id))
          .map(cart => cart.cart_id);

        selected_cart_ids.forEach(selectedCartId => {
            const selectedCart = carts.find(c => c.cart_id === selectedCartId);
            if(selectedCart) {
                selectedNames.push(selectedCart.cart_name);
                selectedIds.push(selectedCart.cart_id);
            }
        });

        setSelectedCarts(selectedNames);
        setSelectedCartIds(selectedIds);
    }, []);

    const handleCheckboxChange = (cartName: string) => {
        setSelectedCarts((prev) => {
        const newSelectedNames = prev.includes(cartName)
            ? prev.filter(name => name !== cartName) 
            : [...prev, cartName];

        const selectedIds = carts
            .filter(cart => newSelectedNames.includes(cart.cart_name))
            .map(cart => cart.cart_id);

        setSelectedCarts(newSelectedNames);
        setSelectedCartIds(selectedIds);
        return newSelectedNames;
        });
    };

  // const handleInputChange = (e) => {
  //   setNewFolderName(e.target.value);
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleAddSection(newFolderName);
  //   }
  // };

  // const closeKeyDown = () => {
  //   setNewFolderName("");
  //   setIsAddingFolder(false);
  // };

  return (
    <div className="bg-[var(--input-color)] rounded-md p-2">
      <div>
        <p>Select Folders</p>
        {/* {!moveItem && (
          <button onClick={() => setIsAddingFolder(true)}>New Folder</button>
        )} */}
      </div>
      <hr className="bg-[var(--input-color)] mt-1 mb-2" />
      <div id="select-folders-section">
        <div id="sf-dropdown">
          <ul className="flex flex-col gap-1">
            {carts.map((cart) => (
              <li key={cart.cart_id}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    value={cart.cart_name}
                    checked={selectedCarts.includes(cart.cart_name)}
                    onChange={() => handleCheckboxChange(cart.cart_name)}
                  />
                  {/* <span className="checkmark">
                    <FontAwesomeIcon icon={faCheck} />
                  </span> */}
                  {cart.cart_name}
                </label>
              </li>
            ))}
            {/* {isAddingFolder && (
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
            )} */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default List;
