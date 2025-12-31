import type { CartType } from "@/types/CartType";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Dispatch, type SetStateAction } from "react";
import Cart from "../modules/cartModules/Cart";

interface HomePageProps {
    carts: CartType[];
    setCarts: Dispatch<SetStateAction<CartType[]>>;
    popupLoading: boolean;
    setPopupLoading: Dispatch<SetStateAction<boolean>>;
}

const HomePage = ({ carts, popupLoading } : HomePageProps) => {

    if (popupLoading) return (<div className="spinner-loader"></div>)
    return (
        <section 
            className="flex flex-col gap-2 w-full px-4 pt-2"
            id="organization-section" 
            // style={{ overflowY: 'auto', maxHeight: '400px' }}
            // ref={organizationSectionRef}
        >
            {carts.length > 0 ? (
                carts.map((cart) => (
                    <Cart
                        cart={cart}
                        // organizationSections={organizationSections}
                        // setOrganizationSections={setOrganizationSections}
                        // handleUpdateItem={handleUpdateItem}
                        // fetchOrganizationSections={fetchOrganizationSections}
                        // isLoading={isLoading}
                        // setIsLoading={setIsLoading}
                        // showNotification={showNotification}
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