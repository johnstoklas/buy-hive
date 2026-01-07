import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Dispatch, type SetStateAction } from "react";
import Cart from "../modules/cartModules/Cart";
import { useCarts } from "../context/CartContext/useCart";
import { useLocked } from "../context/LockedContext/useLocked";
import LoadingSpinner from "../ui/loadingUI/loadingSpinner";

interface HomePageProps {
    popupLoading: boolean;
    setPopupLoading: Dispatch<SetStateAction<boolean>>;
}

const HomePage = ({ popupLoading } : HomePageProps) => {

    const { carts } = useCarts();

    if (popupLoading) return (
        <div className="flex items-center justify-center w-full">
            <LoadingSpinner/>
        </div>
    )
    return (
        <div className="flex flex-1 gap-2 w-full shrink-0">
            
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