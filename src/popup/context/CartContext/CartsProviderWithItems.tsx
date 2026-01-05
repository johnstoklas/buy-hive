import { useItems } from "../ItemContext/useItem";
import { CartsProvider } from "./CartsProvider";

export function CartsProviderWithItems({ children }: { children: React.ReactNode }) {
    const { deleteItemUI } = useItems();

    return (
        <CartsProvider onItemOrphaned={deleteItemUI}>
            {children}
        </CartsProvider>
    );
}