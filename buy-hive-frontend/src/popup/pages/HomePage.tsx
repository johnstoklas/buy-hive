import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import Cart from "../modules/cartModules/Cart";
import { useCarts } from "../context/CartContext/useCart";
import { useLocked } from "../context/LockedContext/useLocked";

interface HomePageProps {
    popupLoading: boolean;
    setPopupLoading: Dispatch<SetStateAction<boolean>>;
}

const HomePage = ({ popupLoading } : HomePageProps) => {

    const { carts } = useCarts();
    const { isLocked } = useLocked();

    if (popupLoading) return (<div className="spinner-loader"></div>)
    return (
        <div 
            className="flex flex-col flex-1 gap-2 pt-2 w-full shrink-0"
            // ref={organizationSectionRef}
        >
            {isLocked && <div className="absolute inset-0 bg-black/25 my-14"/>}
            {carts.length > 0 ? (
                carts.map((cart) => (
                    <Cart
                        key={cart.cart_id}
                        cart={cart}
                    />
                ))
                ) : (
                <>
                    <p>Looks like you have nothing here yet.</p>
                    <p>Click <FontAwesomeIcon id="org-sec-empty-folder" icon={faFolder} /> to get started!</p>
                </>
                )
            }
                {/* <UserNotification 
                    notificationVisible={notificationVisible}
                    notifStatus={notifStatus}
                    notifMessage={notifMessage}
                    addFileState={addFileState}
                /> */}
        </div>
    )
}

export default HomePage;