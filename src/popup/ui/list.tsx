import type { ItemType, ScrapedItemType } from '@/types/ItemTypes';
import{ useState, useEffect, type SetStateAction, type Dispatch } from 'react';
import { useCarts } from '../context/CartContext/useCart';
import CheckboxItem from './checboxItem';
import Button from './button';
import Checkbox from './checkbox';
import { onEnter } from '@/utils/keyboard';
import useCartActions from '@/hooks/useCartActions';

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
    const [isAddingCart, setIsAddingCart] = useState(false); 
    const [newCartName, setNewCartName] = useState(''); 

    const { carts } = useCarts();
    const { addCart } = useCartActions({setCartName: setNewCartName});

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

    const onSubmit = () => {
        addCart(newCartName)
        setIsAddingCart(false);
    }

    return (
        <div className="bg-[var(--input-color)] rounded-md p-2">
            <div className="flex flex-row justify-between items-center">
                <p>Select Carts</p>
                {addItem && (
                    <Button 
                        onClick={() => setIsAddingCart(true)}
                        isModal={true}
                    >
                        Add Cart
                    </Button>
                )}
            </div>
            <hr className="bg-[var(--input-color)] my-1" />
            <div className='overflow-y-auto h-[140px]'>
                <ul className="flex flex-col">
                    {carts.map((cart) => (
                        <li key={cart.cart_id}>
                            <CheckboxItem
                                label={cart.cart_name}
                                checked={selectedCarts.includes(cart.cart_name)}
                                onChange={() => handleCheckboxChange(cart.cart_name)}
                            />
                        </li>
                    ))}
                    {isAddingCart && (
                        <li key="new-folder">
                            <label className="flex items-center gap-1 rounded-md p-1 hover:cursor-pointer hover:bg-[#f0f0f0]">
                                <Checkbox 
                                    checked={false}
                                />
                                <input
                                    type="text"
                                    value={newCartName}
                                    onChange={(e) => setNewCartName(e.target.value)}
                                    onKeyDown={(e) => onEnter(e, () => onSubmit())}
                                    onBlur={() => setIsAddingCart(false)}
                                    placeholder="Cart name"
                                    autoFocus
                                />
                            </label>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default List;
