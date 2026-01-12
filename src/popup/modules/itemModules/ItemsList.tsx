import { useEffect, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

import type { ItemType } from "@/types/ItemTypes";
import type { CartType } from "@/types/CartType";

import Item from "./Item";
import { useItems } from "@/popup/context/ItemContext/useItem";
import LoadingSpinner from "@/popup/ui/loadingUI/loadingSpinner";

interface ItemsListProp {
    cart: CartType;
    isExpanded: boolean;
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
    isCartLoading: boolean;
}

const ItemsList = ({ cart, isExpanded, setIsExpanded, isCartLoading } : ItemsListProp) => {
    const { items } = useItems();

    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    const [height, setHeight] = useState(0);

    const cartItems = cart.item_ids
        .map(id => items.find(item => item.item_id === id))
        .filter((item): item is ItemType => item !== undefined);

    useLayoutEffect(() => {
        const inner = innerRef.current;
        if (!inner) return;

        if (isExpanded) setHeight(inner.scrollHeight);
        else {
            const currentHeight = inner.scrollHeight;

            setHeight(currentHeight);

            requestAnimationFrame(() => {
                setHeight(0);
            });
        }
    }, [isExpanded, cartItems.length]);

    useEffect(() => {
        if (!isExpanded) return;
        const inner = innerRef.current;
        if (!inner) return;

        const ro = new ResizeObserver(() => {
            setHeight(inner.scrollHeight);
        });

        ro.observe(inner);
        return () => ro.disconnect();
    }, [isExpanded, cartItems.length]);

    useEffect(() => {
        if (isCartLoading) return;
        if (cartItems.length === 0) setIsExpanded(false);
    }, [cartItems.length, isCartLoading])
    

    return (
        <div 
            ref={outerRef}
            style={{ height: `${height}px` }}
            className="overflow-hidden transition-[height] duration-300 ease-in-out"
        >
            <div 
                ref={innerRef}
                className="flex flex-col bg-[var(--secondary-background)] py-3 px-4 gap-2"
            >
                {!isCartLoading ? (
                    cartItems && cartItems.map(item => (
                        <Item
                            key={item.item_id}
                            cart={cart}
                            item={item}
                        />
                    ))
                ) : (
                    <div className="flex justify-center">
                        <LoadingSpinner/>
                    </div>
                )}
            </div> 
        </div>
    )
}

export default ItemsList;