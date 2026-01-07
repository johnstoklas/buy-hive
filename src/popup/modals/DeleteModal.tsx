import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react';

import useCartActions from '@/hooks/useCartActions';
import useItemActions from '@/hooks/useItemActions';

import { useLocked } from '../context/LockedContext/useLocked';

import type { CartType } from '@/types/CartType';
import type { ItemType } from '@/types/ItemTypes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import Button from '../ui/button';
import Container from '../ui/containerUI/container';
import CenterContainer from '../ui/containerUI/centerContainer';
import ContainerHeader from '../ui/containerUI/containerHeader';
import ModalPortal from '../ui/ModalPortal';


interface DeleteModalProps {
    cart: CartType;
    item?: ItemType;
    
    setDropdownVisible: Dispatch<SetStateAction<boolean>>;
    setDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setDeleteModal: Dispatch<SetStateAction<boolean>>;

    deleteModalRef: RefObject<HTMLDivElement | null>;
    type: string;
}

const DeleteModal = ({ 
    cart, 
    item,
    setDropdownVisible, 
    setDropdownHidden, 
    setDeleteModal, 
    deleteModalRef, 
    type,
} : DeleteModalProps) => {

    const { cart_id: cartId } = cart;
    const { isLocked, setIsLocked } = useLocked();

    const { deleteCart } = useCartActions();
    const { deleteItem, deleteItemAll } = useItemActions();

    useEffect(() => {
        setDropdownHidden(true);
    }, [setDropdownHidden]);
    
    const closePopup = () => {
        setDropdownVisible(false);
        setDropdownHidden(false);
        setIsLocked(false);
        setDeleteModal(false);
    }
  
    const getDeleteMessage = () => {
        switch (type) {
            case "folder":
                return "Are you sure you want to delete this folder?";
            case "item":
                return "Are you sure you want to delete this item?";
            case "item-all":
                return "Are you sure you want to delete this item permanently?";
        }
    }

    const handleSubmit = () => {
        switch (type) {
            case "folder":
                deleteCart(cartId);
                break;
            case "item":
                if(!item) return;
                deleteItem(cartId, item.item_id);   
                break;
            case "item-all":
                if(!item) return;
                deleteItemAll(item.item_id);   
                break;            
        }
        closePopup();
    }

    return (
        <ModalPortal>
            {isLocked && <div className="flex fixed top-14 bottom-14 inset-0 bg-black/25"/>}
            <CenterContainer>
                <Container 
                    className="flex-1 !flex-col relative justify-center text-center gap-2 !rounded-lg shadow-bottom"
                    ref={deleteModalRef}
                > 
                    <ContainerHeader
                        closeButtonProps={{
                            onClick: closePopup 
                        }}
                    />
                    <div className="mb-2">
                        <FontAwesomeIcon 
                            icon={faTrashCan} 
                            className="text-base"
                        />
                    </div>
                    <p> {getDeleteMessage()} </p>
                    <div className="flex gap-2 justify-center">
                        <Button 
                            onClick={handleSubmit}
                            isDelete={true}
                            isModal={true}
                        > 
                            Yes, I'm sure 
                        </Button>
                        <Button 
                            onClick={closePopup}
                            isModal={true}
                        > 
                            No, cancel 
                        </Button>
                    </div>
                </Container>
            </CenterContainer> 
        </ModalPortal>
    )
};

export default DeleteModal;

