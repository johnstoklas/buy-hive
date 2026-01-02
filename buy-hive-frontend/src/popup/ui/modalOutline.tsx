import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneElement, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { faPenToSquare, faArrowUpFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useLocked } from '../context/LockedProvider';
import { useAuth0 } from '@auth0/auth0-react';
import type { CartType } from '@/types/CartType';
import { useCarts } from '../context/CartsProvider';
import Button from '../ui/button';

interface ModalOutlineProps {
    setCartDropdownHidden: Dispatch<SetStateAction<boolean>>;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    modalRef: React.RefObject<HTMLElement | null>;
    onSubmit;
    isDelete: boolean;
    questionText: string;
    submitText: string;
    cancelText: string;
}

const ModalOutline = ({ 
    setCartDropdownHidden, 
    setModalVisible, 
    modalRef, 
    onSubmit,
    isDelete,
    questionText,
    submitText,
    cancelText
} : ModalOutlineProps) => {

    const { setIsLocked } = useLocked();    

    useEffect(() => {
        setCartDropdownHidden(true);
    }, [setCartDropdownHidden]);

    const closePopup = () => {
        setCartDropdownHidden(false);
        setIsLocked(false);
        setModalVisible(false);
    }

    const handleSubmit = () => {
        onSubmit();
        closePopup();
    }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4">
        <div 
            className="flex flex-1 flex-col relative justify-center text-center py-3 gap-2 rounded-lg bg-[var(--secondary-background)] shadow-bottom"
            ref={modalRef}
        > 
            <p className="absolute right-3 top-2 hover:cursor-pointer hover:font-bold" onClick={closePopup}> &#10005; </p>
            {isDelete && <div className="mt-4 mb-2">
                <FontAwesomeIcon 
                    icon={faTrashCan} 
                    className="text-base"
                />
            </div>}
            {/* {type === "folder" ? (
            <p> Are you sure you want to delete this folder? </p>
            ) : type === "item" ? (
            <p> Are you sure you want to delete this item? </p>
            ) : (
            <p>Are you sure you want to delete this item permanently?</p>
            )} */}
            <p> {questionText} </p>
            <div className="flex gap-2 justify-center">
                <Button 
                    onClick={handleSubmit}
                    isDelete={isDelete}
                    isModal={true}
                > 
                    {submitText}
                </Button>
                <Button 
                    onClick={closePopup}
                    isModal={true}
                > 
                    {cancelText}
                </Button>
            </div>
        </div>
    </div> 
  )
};

export default ModalOutline;
