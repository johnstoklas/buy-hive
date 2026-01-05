import type { CartType } from "@/types/CartType";
import { createContext, useContext, useState } from "react";

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

const CartsContext = createContext<CartsContextType | undefined>(undefined);

export function CartsProvider({ 
    children, 
    onItemOrphaned 
} : { 
    children: React.ReactNode, 
    onItemOrphaned: (itemId: string) => void; 
}) {
    const [carts, setCarts] = useState<CartType[]>([]);

    const hydrateCartsUI = (apiCarts: CartType[]) => {
        setCarts(apiCarts);
    };

    const upsertCartUI = (newCart: CartType) => {
        setCarts(prev => {
            const exists = prev.some(cart => cart.cart_id === newCart.cart_id);

            if (exists) {
                return prev.map(cart =>
                    cart.cart_id === newCart.cart_id ? newCart : cart
                );
            }

            return [...prev, newCart];
        });
    };

    const renameCartUI = (cartId: string, newName: string) => {
        setCarts(prev =>
            prev.map(cart => {
                if (cart.cart_id === cartId) {
                    return {
                        ...cart,
                        cart_name: newName,
                    };
                }
                return cart;
            })
        );
    }

    const deleteCartUI = (cartId: string) => {
        let orphanedItemIds: string[] = [];
        setCarts(prev => {
            const cartToDelete = prev.find(c => c.cart_id === cartId);
            if (!cartToDelete) return prev;

            const newCarts = prev.filter(c => c.cart_id !== cartId);

            orphanedItemIds = cartToDelete.item_ids.filter(
                itemId => !newCarts.some(cart => cart.item_ids.includes(itemId))
            );

            return newCarts;
        });

        orphanedItemIds.forEach(id => onItemOrphaned(id));
    }

    const addItemToCartUI = (cartId: string, itemId: string) => {
        setCarts(prev =>
            prev.map(cart => {
                if (cart.cart_id === cartId) {
                    if (cart.item_ids.includes(itemId)) {
                        return cart;
                    }

                    const newItemIds = [...cart.item_ids, itemId];

                    return {
                        ...cart,
                        item_ids: newItemIds,
                        item_count: String(newItemIds.length),
                    };
                }
                return cart;
            })
        );
    }

    const removeItemFromCartUI = (cartId: string, itemId: string) => {
        let orphaned = false;

        setCarts(prev => {
            const newCarts = prev.map(cart => {
            if (cart.cart_id !== cartId) return cart;
            if (!cart.item_ids.includes(itemId)) return cart;

            const newItemIds = cart.item_ids.filter(id => id !== itemId);
            return {
                ...cart,
                item_ids: newItemIds,
                item_count: String(newItemIds.length),
            };
            });

            orphaned = !newCarts.some(cart => cart.item_ids.includes(itemId));
            return newCarts;
        });
        if (orphaned) onItemOrphaned(itemId);
    }

    const removeItemFromAllCartsUI = (itemId: string) => {
        setCarts(prev => 
            prev.map(cart => {
                if (!cart.item_ids.includes(itemId)) {
                    return cart;
                }

                const newItemIds = cart.item_ids.filter(id => id !== itemId);
                
                return {
                    ...cart,
                    item_ids: newItemIds,
                    item_count: String(newItemIds.length),
                };
            })
        );
        onItemOrphaned(itemId);
    };

    const moveItemBetweenCartsUI  = (itemId: string, selectedCartIds: string[]) => {
        setCarts(prev => 
            prev.map(cart => {
                const shouldHaveItem = selectedCartIds.includes(cart.cart_id);
                const currentlyHasItem = cart.item_ids.includes(itemId);

                if (shouldHaveItem === currentlyHasItem) {
                    return cart;
                }

                if (shouldHaveItem && !currentlyHasItem) {
                    const newItemIds = [...cart.item_ids, itemId];
                    return {
                        ...cart,
                        item_ids: newItemIds,
                        item_count: String(newItemIds.length),
                    };
                }

                const newItemIds = cart.item_ids.filter(id => id !== itemId);
                return {
                    ...cart,
                    item_ids: newItemIds,
                    item_count: String(newItemIds.length),
                };
            })
        );
    }

    return (
        <CartsContext.Provider value={{ 
            carts, 
            setCarts, 
            hydrateCartsUI,
            upsertCartUI,
            renameCartUI, 
            deleteCartUI, 
            addItemToCartUI, 
            removeItemFromCartUI,
            removeItemFromAllCartsUI,
            moveItemBetweenCartsUI,
        }}>
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

