import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Dispatch, type SetStateAction } from "react";
import Cart from "../modules/cartModules/Cart";
import { useCarts } from "../context/CartsProvider";
import type { ItemType } from "@/types/ItemType";

interface HomePageProps {
    popupLoading: boolean;
    setPopupLoading: Dispatch<SetStateAction<boolean>>;
}

const HomePage = ({ popupLoading } : HomePageProps) => {

    const { carts, setCarts } = useCarts();
    // const { isLocked } = useLocked();

    const updateCarts = (newItem: ItemType) => {
        const cartIdSet = new Set(newItem.selected_cart_ids);
        const itemId = newItem.item_id;

        setCarts(prev =>
            prev.map(cart => {
                const shouldContainItem = cartIdSet.has(cart.cart_id);
                const currentlyHasItem = cart.item_ids.includes(itemId);

                if (shouldContainItem === currentlyHasItem) {
                    return cart;
                }

                const newItemIds = shouldContainItem ? [...cart.item_ids, itemId] : cart.item_ids.filter(id => id !== itemId);
                console.log(newItemIds)

                return {
                    ...cart,
                    item_ids: newItemIds,
                    item_count: String(newItemIds.length)
                };
            })
        );

        console.log(carts)
    };

    if (popupLoading) return (<div className="spinner-loader"></div>)
    return (
        <section 
            className="flex flex-col gap-2 w-full pt-2"
            id="organization-section" 
            // ref={organizationSectionRef}
        >
            {/* {isLocked && <div className="absolute inset-0 bg-black/50"/>} */}
            {carts.length > 0 ? (
                carts.map((cart) => (
                    <Cart
                        cart={cart}
                        updateCarts={updateCarts}
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