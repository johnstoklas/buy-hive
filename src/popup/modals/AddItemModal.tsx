import { useEffect, useState, useRef, type Dispatch, type SetStateAction } from 'react';

import { useClickOutside } from '../../hooks/useClickOutside';
import useItemActions from '@/hooks/useItemActions';

import type { ScrapedItemType } from '@/types/ItemTypes';

import Button from '../ui/button';
import Container from '../ui/containerUI/container';
import ContainerHeader from '../ui/containerUI/containerHeader';
import List from '../ui/list';
import FixedContainer from '../ui/containerUI/fixedContainer';
import ItemUI from '../ui/itemUI/itemUI';

interface AddItemModalProps {
    addItemVisible: boolean;
    setAddItemVisible: Dispatch<SetStateAction<boolean>>;
    addItemButtonRef: React.RefObject<HTMLElement | null>;
    setAddItemAnimating: Dispatch<SetStateAction<boolean>>;
}

const AddItemModal = ({ 
  addItemVisible, 
  setAddItemVisible, 
  addItemButtonRef, 
  setAddItemAnimating
} : AddItemModalProps) => {
    const [scrapedItem, setScrapedItem] = useState<ScrapedItemType>({
        name: "",
        price: "",
        url: "",
        image: "",
        notes: "",
    });

    const [selectedCartIds, setSelectedCartIds] = useState<string[]>([]);
  
    const addItemRef = useRef(null);

    const { scrapeItem, addItem } = useItemActions({setScrapedItem});

    // Handles if user clicks outside of the component
    useClickOutside(addItemRef, addItemVisible, setAddItemVisible, [addItemButtonRef]);

    // On mount
    useEffect(() => {
        setAddItemAnimating(true);
        scrapeItem()
    }, []);

    return (
        <FixedContainer>
            <Container
                ref={addItemRef}
                className={`!flex-col relative ${addItemVisible ? "slide-in" : "slide-out"}`}
                onAnimationEnd={() => {
                    if (!addItemVisible) setAddItemAnimating(false);
                }}
            >
                    <ContainerHeader
                        titleText='Add Item'
                        closeButtonProps={{
                            onClick: () => setAddItemVisible(false)
                        }}
                    />
                    <ItemUI
                        item={scrapedItem}
                        isClickable={false}
                        hasDropdown={false}
                        isEditing={true}
                        noteRef={null}
                        placeholder="Notes"
                        noteValue={scrapedItem.notes}
                        setNoteValue={(value) => setScrapedItem(prev => ({ ...prev, note: value }))}
                        handleBlur={() => {}}
                        onKeyDown={() => {}}
                        handleNoteSelect={() => {}}
                    />
                    <List
                        item={scrapedItem}
                        addItem={true}
                        setSelectedCartIds={setSelectedCartIds}
                    /> 
                    <Button onClick={() => addItem(scrapedItem, selectedCartIds)}>
                        Add Item
                    </Button>
            </Container>
        </FixedContainer>
    )
};

export default AddItemModal;
