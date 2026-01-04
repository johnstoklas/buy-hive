import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useLocked } from '../context/LockedProvider';
import type { ItemType } from '@/types/ItemType';
import Image from '../ui/image';
import ItemHeader from '../ui/itemHeader';
import List from '../ui/list';
import Button from '../ui/button';
import DeleteModal from './DeleteModal';
import type { CartType } from '@/types/CartType';

interface MoveItemModalProps {
    cart: CartType;
    item: ItemType;
    setItemDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setItemDropdownVisible: Dispatch<SetStateAction<boolean>>;
    moveItemModal: boolean;
    setMoveItemModal: Dispatch<SetStateAction<boolean>>;
    moveItemModalRef: React.RefObject<HTMLElement | null>;
    deleteItemAllModalRef: React.RefObject<HTMLElement | null>;
    updateCarts;
}
const MoveItemModal = ({
    cart,
    item,
    setItemDropdownHidden,
    setItemDropdownVisible,
    moveItemModal, 
    setMoveItemModal,
    moveItemModalRef,
    deleteItemAllModalRef,
    updateCarts,
} : MoveItemModalProps) => {

    const [deleteItemAllModal, setDeleteItemAllModal] = useState(false);
    const [selectedCartIds, setSelectedCartIds] = useState<string[]>(item.selected_cart_ids ?? []);

    const { setIsLocked } = useLocked();    

    useEffect(() => {
        setItemDropdownHidden(true);
    }, [setItemDropdownHidden]);
    
    // Moves item to carts
    const handleMoveItem = () => {
        const data = {
            itemId: item.item_id,
            selectedCarts: selectedCartIds,
        }

        chrome.runtime.sendMessage({action: "moveItem", data: data}, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error communicating with background script:", chrome.runtime.lastError.message);
            return;
        }
    
        if (response?.status === "success") {
            const updatedItem = {
                image: item.image,
                item_id: item.item_id,
                name: item.name,
                notes: item.notes,
                price: item.price,
                selected_cart_ids: selectedCartIds,
                url: item.url
            };
            updateCarts(updatedItem);
            // showNotification("Item succesfully moved!", true);
        } else {
            // showNotification("Failed to move item", false);
            console.error("Error moving item:", response?.message);
        }
        });
    }

    const closePopup = () => {
        setItemDropdownVisible(false);
        setItemDropdownHidden(false);
        setIsLocked(false);
        setMoveItemModal(false);
    }

    const submitMoveItem = () => {
        if(selectedCartIds) {
            handleMoveItem();
            closePopup();
        }
    }
    
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center px-4">
                <div 
                    className="flex flex-col flex-1 relative w-full bg-[var(--secondary-background)] px-2 py-2 rounded-md gap-2"
                    ref={moveItemModalRef}
                >
                    <p className="absolute right-3 top-2 hover:cursor-pointer hover:font-bold" onClick={closePopup}> &#10005; </p>
                    <div className="flex flex-row gap-2 pt-4">
                        <Image 
                            item={item}
                        />

                        <div className='overflow-hidden'>
                            <div className='flex flex-row gap-1 overflow-hidden'>
                                <ItemHeader
                                    item={item}
                                />
                            </div>
                            <div className="flex flex-1 px-1 py-1 bg-[var(--input-color)] rounded-md text-xs">
                                {(item.notes || (item.notes && item.notes.trim() !== "")) ? item.notes : "None"}
                            </div>
                        </div>
                            
                    </div>
                    <List 
                        item={item}
                        // selectedCarts={selectedCarts}
                        // setSelectedCarts={setSelectedCarts}
                        // selectedCartIds={selectedCartIds}
                        setSelectedCartIds={setSelectedCartIds}
                    />
                    {selectedCartIds.length === 0 ? (
                        <Button 
                            onClick={() => setDeleteItemAllModal(true)}
                            isModal={true}
                            isDelete={true}
                        > 
                            Delete Item 
                        </Button>
                    ) : (
                        <Button
                            onClick={submitMoveItem}
                            isModal={true}
                        > 
                            Confirm Move 
                        </Button>
                    )}
                </div>
            </div>
            {deleteItemAllModal && <DeleteModal
                cart={cart}
                item={item}
                setDropdownVisible={setItemDropdownVisible}
                setDropdownHidden={setItemDropdownHidden}
                setDeleteModal={setDeleteItemAllModal}
                deleteModalRef={deleteItemAllModalRef}
                type="item-all"
                updateCarts={updateCarts}
            />}
        </>
    )
};

export default MoveItemModal;