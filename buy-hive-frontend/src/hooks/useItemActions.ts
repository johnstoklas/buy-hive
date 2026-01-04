import { useLocked } from "@/popup/context/LockedProvider";
import { sendChromeMessage } from "@/services/chromeService";
import { ItemType } from "@/types/ItemTypes";
import { useAuth0 } from "@auth0/auth0-react";

export function useItemActions({ isExpanded, setIsExpanded, setItems }) {
    const { isLoading, isAuthenticated } = useAuth0();
    const { isLocked } = useLocked();
    
    const handleGetItems = async({cartId}) => {

        if (isLocked || isLoading || !isAuthenticated) return;
        if (isExpanded) { setIsExpanded(false); return; }

        try {
            const data = { cartId }
            const res = await sendChromeMessage<{items: ItemType[]}>({action: "getItems", data});

            setItems(res.items);
            setIsExpanded(true);
        } catch (err) {
            console.error(err);
        }
    };

    return { handleGetItems };
}

export default useItemActions;