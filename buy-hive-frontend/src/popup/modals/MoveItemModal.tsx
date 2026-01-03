import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useLocked } from '../context/LockedProvider';
import type { ItemType } from '@/types/ItemType';
import Image from '../ui/image';
import ItemHeader from '../ui/itemHeader';
import List from '../ui/list';
import Button from '../ui/button';

interface MoveItemModalProps {
    item: ItemType;
    setDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setDropdownVisible: Dispatch<SetStateAction<boolean>>;
    moveItemModal: boolean;
    setMoveItemModal: Dispatch<SetStateAction<boolean>>;
    moveItemModalRef: React.RefObject<HTMLElement | null>;
}
const MoveItemModal = ({
    item,
    setDropdownHidden,
    setDropdownVisible,
    moveItemModal, 
    setMoveItemModal,
    moveItemModalRef,
} : MoveItemModalProps) => {

    const [selectedCarts, setSelectedCarts] = useState<string[]>([]);
    const [deleteVisible, setDeleteVisible] = useState(false);


    const { setIsLocked } = useLocked();    

    useEffect(() => {
        setDropdownHidden(true);
    }, [setDropdownHidden]);
    
    // Moves item to carts
    const handleMoveItem = () => {
        const data = {
            itemId: item.item_id,
            selectedCarts: selectedCarts,
        }

        chrome.runtime.sendMessage({action: "moveItem", data: data}, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error communicating with background script:", chrome.runtime.lastError.message);
            return;
        }
    
        if (response?.status === "success") {
            const data = response.data;
            chrome.runtime.sendMessage({action: "updateItems", data: data});
            // showNotification("Item succesfully moved!", true);
        } else {
            // showNotification("Failed to move item", false);
            console.error("Error moving item:", response?.message);
        }
        });
    }

    const closePopup = () => {
        setDropdownVisible(false);
        setDropdownHidden(false);
        setIsLocked(false);
        setMoveItemModal(false);
    }

    const submitMoveItem = () => {
        if(selectedCarts) {
            handleMoveItem();
            closePopup();
        }
    }
    
    return (
        <>
        {/* {deleteVisible && <DeletePopup
            cartId={cartId}
            itemId={itemId}
            setIsVisible={setDeleteVisible}
            setSec={setSec}
            setSecHidden={setSecHidden}
            setIsLocked={setIsLocked}
            type="move"
            setItemsInFolder={setItemsInFolder}
            showNotification={showNotification}
        />} */}
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
                    selectedCarts={selectedCarts}
                    setSelectedCarts={setSelectedCarts}
                />
                {selectedCarts.length === 0 ? (
                    <Button 
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
    </>
    )
};

export default MoveItemModal;