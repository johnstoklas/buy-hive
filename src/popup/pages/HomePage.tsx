import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import Cart from "../components/modules/cartModules/Cart";
import { useCarts } from "../context/CartContext/useCart";
import LoadingSpinner from "../components/ui/loadingUI/loadingSpinner";
import { useLocked } from "../context/LockedContext/useLocked";

interface HomePageProps {
    popupLoading: boolean;
    setPopupLoading: Dispatch<SetStateAction<boolean>>;
}

const HomePage = ({ popupLoading } : HomePageProps) => {

    const { carts } = useCarts();
    const { isScrollLocked } = useLocked();

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const preventScroll = (e: Event) => {
            e.preventDefault();
        };

        if (isScrollLocked) {
            container.addEventListener("wheel", preventScroll, { passive: false });
            container.addEventListener("touchmove", preventScroll, { passive: false });
        } else {
            container.removeEventListener("wheel", preventScroll);
            container.removeEventListener("touchmove", preventScroll);
        }

        return () => {
            container.removeEventListener("wheel", preventScroll);
            container.removeEventListener("touchmove", preventScroll);
        };
    }, [isScrollLocked]);

    if (popupLoading) return (
        <div className="flex items-center justify-center w-full">
            <LoadingSpinner/>
        </div>
    )

    return (
        <div 
            className="flex flex-1 gap-2 w-full shrink-0"
            ref={scrollContainerRef}
        >
            {carts.length > 0 ? (
                <div className="flex flex-col flex-1 gap-2 pt-2 w-full shrink-0">
                        {carts.map((cart) => (
                            <Cart
                                key={cart.cart_id}
                                cart={cart}
                            />
                        ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full">
                    <p>Looks like you have nothing here yet.</p>
                    <p>Click <FontAwesomeIcon id="org-sec-empty-folder" icon={faFolder} /> to get started!</p>
                </div>
            )}
        </div>
    )
}

export default HomePage;