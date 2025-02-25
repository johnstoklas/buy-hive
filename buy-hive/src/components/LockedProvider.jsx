import React, { createContext, useContext, useState } from "react";

const LockedContext = createContext();

export function LockedProvider({ children }) {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <LockedContext.Provider value={{ isLocked, setIsLocked }}>
      {children}
    </LockedContext.Provider>
  );
}

export function useLocked() {
  return useContext(LockedContext);
}
