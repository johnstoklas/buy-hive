import { useContext } from "react";
import { CartsContext } from "./CartContext";

export function useCarts() {
    const context = useContext(CartsContext);
    if (!context) {
        throw new Error("useCarts must be used within CartsProvider");
    }
    return context;
}