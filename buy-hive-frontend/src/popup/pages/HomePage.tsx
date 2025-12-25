import type { Cart } from "@/types/Carts";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Dispatch, type SetStateAction } from "react";

interface HomePageProps {
    carts: Cart[];
    setCarts: Dispatch<SetStateAction<Cart[]>>;
    popupLoading: boolean;
    setPopupLoading: Dispatch<SetStateAction<boolean>>;
}

const HomePage = ({ carts, popupLoading } : HomePageProps) => {

    if (popupLoading) return (<div className="spinner-loader"></div>)
    return (
        <section 
            id="organization-section" 
            // style={{ overflowY: 'auto', maxHeight: '400px' }}
            // ref={organizationSectionRef}
        >
            {carts.length > 0 ? (
                carts.map((cart) => (
                    cart.name
                    // <
                    // cart={cart}
                    // organizationSections={organizationSections}
                    // setOrganizationSections={setOrganizationSections}
                    // handleUpdateItem={handleUpdateItem}
                    // fetchOrganizationSections={fetchOrganizationSections}
                    // isLoading={isLoading}
                    // setIsLoading={setIsLoading}
                    // showNotification={showNotification}
                    // />
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