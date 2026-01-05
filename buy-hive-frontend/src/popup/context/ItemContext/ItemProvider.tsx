import type { ItemType } from "@/types/ItemTypes";
import { useState } from "react";
import { ItemsContext } from "./ItemContext";

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