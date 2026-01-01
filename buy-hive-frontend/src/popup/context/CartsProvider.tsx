import type { CartType } from "@/types/CartType";
import { createContext, useContext, useState } from "react";

type CartsContextType = {
  carts: CartType[];
  setCarts: React.Dispatch<React.SetStateAction<CartType[]>>;
};

const CartsContext = createContext<CartsContextType | undefined>(undefined);

export function CartsProvider({ children }: { children: React.ReactNode }) {
  const [carts, setCarts] = useState<CartType[]>([]);

  return (
    <CartsContext.Provider value={{ carts, setCarts }}>
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

