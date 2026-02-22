import { createContext } from "react";

type LockedContextType = {
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
  isScrollLocked: boolean;
  setIsScrollLocked: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LockedContext = createContext<LockedContextType | undefined>(undefined);