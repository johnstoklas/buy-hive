import type { CartType } from "@/types/CartType";
import type { ItemType } from "@/types/ItemTypes";
import { createContext, useContext, useState } from "react";

type CartsContextType = {
  carts: CartType[];
  setCarts: React.Dispatch<React.SetStateAction<CartType[]>>;
  updateCarts: (newItem: ItemType) => void;
};

const CartsContext = createContext<CartsContextType | undefined>(undefined);

export function CartsProvider({ children }: { children: React.ReactNode }) {
  const [carts, setCarts] = useState<CartType[]>([]);

  const updateCarts = (newItem: ItemType) => {
    const cartIdSet = new Set(newItem.selected_cart_ids);
    const itemId = newItem.item_id;

    setCarts(prev =>
      prev.map(cart => {
        const shouldContainItem = cartIdSet.has(cart.cart_id);
        const currentlyHasItem = cart.item_ids.includes(itemId);

        if (shouldContainItem === currentlyHasItem) {
          return cart;
        }

        const newItemIds = shouldContainItem
          ? [...cart.item_ids, itemId]
          : cart.item_ids.filter(id => id !== itemId);

        return {
          ...cart,
          item_ids: newItemIds,
          item_count: String(newItemIds.length),
        };
      })
    );
  };

  return (
    <CartsContext.Provider value={{ carts, setCarts, updateCarts }}>
      {children}
    </CartsContext.Provider>
  );
}

export function useCarts() {
  const context = useContext(CartsContext);
  if (!context) {
    throw new Error("useCarts must be used within CartsProvider");
  }
  return context;
}

