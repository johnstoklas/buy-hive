import React, { useEffect, useState, useRef } from 'react';
import SelectFolders from './SelectFolders.jsx';
import { useLocked } from './contexts/LockedProvider.jsx';
import DeletePopup from './DeletePopup.jsx';
import { userDataContext } from './contexts/UserProvider.jsx';

const MoveItem = ({
    cartsArray,
    cartId,
    itemId,
    item,
    setMoveItemVisible,
    setSec,
    setSecHidden,
    setItemsInFolder,
}) => {

    const [selectedFolders, setSelectedFolders] = useState([]);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const { setIsLocked } = useLocked();

    const closeMoveItemPopup = () => {
        setMoveItemVisible(false);
        setSec(false);
        setSecHidden(false);
        setIsLocked(false);
    }

    const openDeletePopup = () => {
        setDeleteVisible(!deleteVisible);
    }

    // Moves item to carts
    const handleMoveItem = (itemId, selectedCarts, unselectedCarts) => {

        const data = {
        email: userData.email,
        itemId: itemId,
        selectedCarts: selectedCarts,
        unselectedCarts: unselectedCarts,
        }

        chrome.runtime.sendMessage({action: "moveItem", data: data}, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error communicating with background script:", chrome.runtime.lastError.message);
            return;
        }
    
        if (response?.status === "success") {
            //fetchOrganizationSections();
            const data = response.data;
            chrome.runtime.sendMessage({action: "updateItems", data: data});
        } else {
            console.error("Error moving item:", response?.error);
        }
        });
    }

    const submitMoveItem = () => {
        if(selectedFolders) {
            
            const unselectedFolders = [];
            console.log(cartsArray);

            cartsArray.forEach(cart => {
                if (cart.cart_id === cartId) {
                    cart.items.forEach(item => {
                        if (item.item_id === itemId) {
                            // Get all selected cart IDs where the item is present
                            const selectedCartIds = new Set(item.selected_cart_ids);
                            
                            // Collect carts where the item is NOT present
                            cartsArray.forEach(c => {
                                if (!selectedCartIds.has(c.cart_id)) {
                                    unselectedFolders.push(c.cart_id);
                                }
                            });
                        }
                    });
                }
            });
            
            handleMoveItem(itemId, selectedFolders, unselectedFolders);
            closeMoveItemPopup();
        }
    }
    
    return (
        <>
        {deleteVisible && <DeletePopup
            cartId={cartId}
            itemId={itemId}
            setIsVisible={setDeleteVisible}
            setSec={setSec}
            setSecHidden={setSecHidden}
            setIsLocked={setIsLocked}
            type="move"
            setItemsInFolder={setItemsInFolder}
        />}
        <section id="move-item-container">
            <div id="move-item-header">
                <h4> Move Item </h4>
                <p onClick={closeMoveItemPopup}> &#10005; </p>
            </div>
            <section class="expand-section-expanded-display move-item-container">
            <div class="shopping-item-container">
            <div class="shopping-item-image-container">
                <img src={item.image}></img>
            </div>
            <div class="shopping-item-information-container">
                <div className="shopping-item-header">
                <div className="shopping-item-header-text">
                    <h4 class="shopping-item-name"> {item.name} </h4>
                    <h4 class="shopping-item-price">  {item.price} </h4>
                </div>
                </div>
                    <div class="shopping-item-notes" style={{color: item.notes ? "black" : "gray"}}> {item.notes ? item.notes : "None"} </div>
                </div>
            </div>
        </section>
        <SelectFolders
            moveItem={true}
            select
            cartsArray={cartsArray}
            item={item}
            cartId={cartId}
            itemId={itemId}
            setSelectedCarts={setSelectedFolders}
        />
        {selectedFolders.length === 0 ? (
            <div id="move-button-container">
                <button id="move-item-button" className="move-item-delete" onClick={openDeletePopup}> Delete Item </button>
            </div>
        ) : (
            <div id="move-button-container">
                <button id="move-item-button" onClick={submitMoveItem}> Confirm Move </button>
            </div> 
        )}
    </section>
    </>
    )
};

export default MoveItem;