import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useLocked } from '../context/LockedProvider';
import type { ItemType } from '@/types/ItemTypes';
import Image from '../ui/itemUI/itemImage';
import ItemHeader from '../ui/itemUI/itemHeader';
import List from '../ui/list';
import Button from '../ui/button';
import DeleteModal from './DeleteModal';
import type { CartType } from '@/types/CartType';
import CloseButton from '../ui/closeButton';
import ItemNote from '../ui/itemUI/itemNote';
import ContainerHeader from '../ui/containerUI/containerHeader';
import CenterContainer from '../ui/containerUI/centerContainer';
import Container from '../ui/containerUI/container';
import { useCarts } from '../context/CartsProvider';
import useItemActions from '@/hooks/useItemActions';

interface MoveItemModalProps {
    cart: CartType;
    item: ItemType;
    setItemDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setItemDropdownVisible: Dispatch<SetStateAction<boolean>>;
    moveItemModal: boolean;
    setMoveItemModal: Dispatch<SetStateAction<boolean>>;
    moveItemModalRef: React.RefObject<HTMLElement | null>;
    deleteItemAllModalRef: React.RefObject<HTMLElement | null>;
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
} : MoveItemModalProps) => {

    const [deleteItemAllModal, setDeleteItemAllModal] = useState(false);
    const [selectedCartIds, setSelectedCartIds] = useState<string[]>(item.selected_cart_ids ?? []);

    const { setIsLocked } = useLocked(); 
    const { updateCarts } = useCarts();   

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
        if(selectedCartIds) return;
        moveItem(item, selectedCartIds);
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

                        <div className='flex flex-col overflow-hidden'>
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
                updateCarts={updateCarts}
            />}
        </>
    )
};

export default MoveItemModal;