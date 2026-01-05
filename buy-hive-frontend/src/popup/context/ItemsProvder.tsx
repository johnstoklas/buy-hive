import type { ItemType } from "@/types/ItemTypes";
import { createContext, useContext, useState } from "react";

type ItemsContextType = {
  items: ItemType[];
  setItems: React.Dispatch<React.SetStateAction<ItemType[]>>;
  editNoteUI: (itemId: string, newNote: string) => void;
  deleteItemUI: (itemId: string) => void;
  upsertItemUI: (newItem: ItemType) => void;
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ItemType[]>([]);

    const editNoteUI = (itemId: string, newNote: string) => {
        setItems(prev =>
            prev.map(item => {
                if (item.item_id === itemId) {
                    return {
                        ...item,
                        notes: newNote
                    };
                }
            return item;
            })
        );
    };

    const deleteItemUI = (itemId: string) => {
        setItems(prev => prev.filter((item) => item.item_id !== itemId));
    }

    const upsertItemUI = (newItem: ItemType) => {
        setItems(prev => {
            const exists = prev.some(item => item.item_id === newItem.item_id);

            if (exists) {
                return prev.map(item =>
                    item.item_id === newItem.item_id ? newItem : item
                );
            }

            return [...prev, newItem];
        });
    }

    return (
            <ItemsContext.Provider value={{ items, setItems, editNoteUI, deleteItemUI, upsertItemUI }}>
                {children}
            </ItemsContext.Provider>
    );
}

export function useItems() {
    const context = useContext(ItemsContext);
    if (!context) {
        throw new Error("useItems must be used within ItemsProvider");
    }
    return context;
}

