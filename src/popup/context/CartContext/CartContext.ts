import { createContext } from "react";
import type { CartType } from "@/types/CartType";

type CartsContextType = {
    carts: CartType[];
    setCarts: React.Dispatch<React.SetStateAction<CartType[]>>;
    hydrateCartsUI: (apiCarts: CartType[]) => void;
    upsertCartUI: (newCart: CartType) => void;
    renameCartUI: (cartId: string, newName: string) => void;
    deleteCartUI: (cartId: string) => void;
    addItemToCartUI: (cartId: string, itemId: string) => void;
    removeItemFromCartUI: (cartId: string, itemId: string) => void;
    removeItemFromAllCartsUI: (itemId: string) => void;
    moveItemBetweenCartsUI: (itemId: string, selectedCartIds: string[]) => void;
    onItemOrphaned?: (itemId: string) => void;
};

export const CartsContext = createContext<CartsContextType | undefined>(undefined);
