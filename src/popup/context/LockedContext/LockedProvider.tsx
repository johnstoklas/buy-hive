import { useState } from "react";
import { LockedContext } from "./LockedContext";

export function LockedProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);

  return (
    <LockedContext.Provider value={{ isLocked, setIsLocked, isScrollLocked, setIsScrollLocked }}>
      {children}
    </LockedContext.Provider>
  );
}