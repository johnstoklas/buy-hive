import { useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from 'react';

import useItemActions from '@/hooks/useItemActions';

import { useLocked } from '../context/LockedContext/useLocked';
import { useCarts } from '../context/CartContext/useCart';

import type { ItemType } from '@/types/ItemTypes';
import type { CartType } from '@/types/CartType';

import DeleteModal from './DeleteModal';

import Image from '../ui/itemUI/itemImage';
import ItemHeader from '../ui/itemUI/itemHeader';
import List from '../ui/list';
import Button from '../ui/button';
import CloseButton from '../ui/closeButton';
import ItemNote from '../ui/itemUI/itemNote';
import ContainerHeader from '../ui/containerUI/containerHeader';
import CenterContainer from '../ui/containerUI/centerContainer';
import Container from '../ui/containerUI/container';

interface MoveItemModalProps {
    cart: CartType;
    item: ItemType;
    setItemDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setItemDropdownVisible: Dispatch<SetStateAction<boolean>>;
    setMoveItemModal: Dispatch<SetStateAction<boolean>>;
    moveItemModalRef: RefObject<HTMLDivElement | null>;
    deleteItemAllModalRef: RefObject<HTMLDivElement | null>;
}
const MoveItemModal = ({
    cart,
    item,
    setItemDropdownHidden,
    setItemDropdownVisible,
    setMoveItemModal,
    moveItemModalRef,
    deleteItemAllModalRef,
} : MoveItemModalProps) => {
    const { carts } = useCarts();

    const [deleteItemAllModal, setDeleteItemAllModal] = useState(false);
    
    const selected_cart_ids = carts
          .filter(cart => cart.item_ids.includes(item.item_id))
          .map(cart => cart.cart_id);
    const [selectedCartIds, setSelectedCartIds] = useState<string[]>(selected_cart_ids ?? []);

    const { setIsLocked } = useLocked(); 

    const { moveItem } = useItemActions();

    useEffect(() => {
        setItemDropdownHidden(true);
    }, [setItemDropdownHidden]);

    const closePopup = () => {
        setItemDropdownVisible(false);
        setItemDropdownHidden(false);
        setIsLocked(false);
        setMoveItemModal(false);
    }

    const submitMoveItem = () => {
        if(!selectedCartIds) return;
        moveItem(item.item_id, selectedCartIds);
        closePopup();
    }
    
    return (
        <>
            <CenterContainer>
                <Container 
                    className="!flex-col flex-1 relative w-full shadow-bottom"
                    ref={moveItemModalRef}
                >
                    <div className="flex">
                        <ContainerHeader> Move Item </ContainerHeader>
                        <CloseButton onClick={closePopup} />
                    </div>
                    <div className="flex flex-row gap-2">
                        <Image 
                            item={item}
                        />

                        <div className='flex flex-1 flex-col overflow-hidden'>
                            <div className='flex flex-row gap-1 overflow-hidden'>
                                <ItemHeader
                                    item={item}
                                />
                            </div>
                            <ItemNote
                                noteValue={item.notes}
                            />
                        </div>
                            
                    </div>
                    <List 
                        item={item}
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
                </Container>
            </CenterContainer>
            {deleteItemAllModal && <DeleteModal
                cart={cart}
                item={item}
                setDropdownVisible={setItemDropdownVisible}
                setDropdownHidden={setItemDropdownHidden}
                setDeleteModal={setDeleteItemAllModal}
                deleteModalRef={deleteItemAllModalRef}
                type="item-all"
            />}
        </>
    )
};

export default MoveItemModal;