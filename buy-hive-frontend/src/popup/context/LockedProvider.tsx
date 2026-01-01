import { createContext, useContext, useState } from "react";

type LockedContextType = {
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
};

const LockedContext = createContext<LockedContextType | undefined>(undefined);

export function LockedProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <LockedContext.Provider value={{ isLocked, setIsLocked }}>
      {children}
    </LockedContext.Provider>
  );
}

export function useLocked() {
  const context = useContext(LockedContext);
  if (!context) {
    throw new Error("useLocked must be used within LockedProvider");
  }
  return context;
}

