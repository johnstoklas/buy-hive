import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
// import ExpandSection from "../item/ExpandSection.jsx";
// import ModifyOrgSec from "./ModifyOrgSec.jsx";
// import { useLocked } from '../contexts/LockedProvider.jsx'
// import { userDataContext } from "../contexts/UserProvider.jsx";
import type { CartType } from "@/types/CartType.js";
import { useAuth0 } from "@auth0/auth0-react";
import CartTitle from "./CartTitle";
import ItemsList from "../itemModules/ItemsList";
import { useLocked } from "@/popup/context/LockedProvider";
import CartDropdown from "./CartDropdown";
import type { ItemType } from "@/types/ItemTypes";
import { useCarts } from "@/popup/context/CartsProvider";

interface CartProps {
  cart: CartType;
}

const Cart = ({cart} : CartProps) => {

    const [items, setItems] = useState<ItemType[]>([]);
  
    const [sectionHeight, setSectionHeight] = useState("45px");
    const [modOrgHidden, setModOrgHidden] = useState(false);
    const [modifyOrgSecPosition, setModifyOrgSecPosition] = useState("below");
    const [isLoading, setIsLoading] = useState(false);
    

    const expandedSectionRef = useRef(null);
    const folderRef = useRef(null);
    const inputRef = useRef(null);
    // const folderTitleRef = useRef(title);

    const { isLocked } = useLocked();

    const [isExpanded, setIsExpanded] = useState(false);

    const updateScreenSize = () => {
      if (expandedSectionRef.current) {
        const expandedDisplayHeight = expandedSectionRef.current.scrollHeight;
        setSectionHeight(
          isExpanded && expandedDisplayHeight
            ? `${expandedDisplayHeight + 60}px`
            : "45px"
        );
      }
      if(items && items.length == 0 ) setIsExpanded(false); 
    };

    useEffect(() => {
      // Allow animation only after loading is done
      if(!isLoading) {
        updateScreenSize();
      }
    }, [isLoading, isExpanded, items]); // Trigger when loading or expanded state changes

    useEffect(() => {
      const itemIds = new Set(cart.item_ids);
      setItems((prev) => prev.filter((item) => itemIds.has(item.item_id)));
    }, [cart]);

  return (
      <div className="bg-[var(--seconday-background)]">
        <CartTitle 
          cart={cart}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isLocked={isLocked}
          setItems={setItems}
          folderRef={folderRef}
        />
        {isExpanded && <ItemsList 
          cart={cart}
          items={items}
        />}
      </div>
    );
}

export default Cart;
