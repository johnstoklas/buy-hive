import { useContext } from "react";
import { LockedContext } from "./LockedContext";

export function useLocked() {
  const context = useContext(LockedContext);
  if (!context) {
    throw new Error("useLocked must be used within LockedProvider");
  }
  return context;
}