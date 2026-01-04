import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Dispatch, type SetStateAction } from "react";
import Cart from "../modules/cartModules/Cart";
import { useCarts } from "../context/CartsProvider";
import { useLocked } from "../context/LockedProvider";

interface HomePageProps {
    popupLoading: boolean;
    setPopupLoading: Dispatch<SetStateAction<boolean>>;
}

const HomePage = ({ popupLoading } : HomePageProps) => {

    const { carts } = useCarts();
    const { isLocked } = useLocked();

    if (popupLoading) return (<div className="spinner-loader"></div>)
    return (
        <section 
            className="flex flex-col gap-2 w-full pt-2"
            // ref={organizationSectionRef}
        >
            {isLocked && <div className="absolute inset-0 bg-black/25 my-14"/>}
            {carts.length > 0 ? (
                carts.map((cart) => (
                    <Cart
                        cart={cart}
                    />
                ))
                ) : (
                <div className="organization-section-empty">
                    <p>Looks like you have nothing here yet.</p>
                    <p>Click <FontAwesomeIcon id="org-sec-empty-folder" icon={faFolder} /> to get started!</p>
                </div>
                )
            }
                {/* <UserNotification 
                    notificationVisible={notificationVisible}
                    notifStatus={notifStatus}
                    notifMessage={notifMessage}
                    addFileState={addFileState}
                /> */}
        </section>
    )
}

export default HomePage;