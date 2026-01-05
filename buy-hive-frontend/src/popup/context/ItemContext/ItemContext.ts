import { createContext } from "react";
import type { ItemType } from "@/types/ItemTypes";

type ItemsContextType = {
  items: ItemType[];
  setItems: React.Dispatch<React.SetStateAction<ItemType[]>>;
  editNoteUI: (itemId: string, newNote: string) => void;
  deleteItemUI: (itemId: string) => void;
  upsertItemUI: (newItem: ItemType) => void;
};

export const ItemsContext = createContext<ItemsContextType | undefined>(undefined);