import { CartsProvider } from "./CartsProvider";
import { useItems } from "./ItemsProvder";

export function CartsProviderWithItems({ children }: { children: React.ReactNode }) {
    const { deleteItem } = useItems();

    return (
        <CartsProvider onItemOrphaned={deleteItem}>
            {children}
        </CartsProvider>
    );
}