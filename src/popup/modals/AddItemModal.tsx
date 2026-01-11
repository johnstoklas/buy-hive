import { useEffect, useState, useRef, type Dispatch, type SetStateAction } from 'react';

import { useClickOutside } from '../../hooks/useClickOutside';
import useItemActions from '@/hooks/useItemActions';

import type { ScrapedItemType } from '@/types/ItemTypes';

import Button from '../ui/button';
import Container from '../ui/containerUI/container';
import ContainerHeader from '../ui/containerUI/containerHeader';
import FixedContainer from '../ui/containerUI/fixedContainer';
import ItemUI from '../ui/itemUI/itemUI';
import List from '../ui/list';
import ItemNoteEditing from '../ui/itemUI/itemNoteUI/itemNoteEditing';

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

    const { scrapeItem, addItem } = useItemActions({setScrapedItem, setAddItemVisible});

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
                        noteSlot= {
                            <ItemNoteEditing
                                noteRef={null}
                                placeholder="Notes"
                                noteValue={scrapedItem.notes}
                                setNoteValue={(e) => setScrapedItem(prev => ({ ...prev, notes: e.target.value }))}
                                handleBlur={() => {}}
                                onKeyDown={() => {}}
                            />
                        }
                    />
                    {/* Display confidence levels if available */}
                    {(scrapedItem.nameConfidence || scrapedItem.priceConfidence || scrapedItem.imageConfidence) && (
                        <div className="text-xs text-gray-500 px-4 py-2 border-t border-[var(--secondary-background-hover)]">
                            <div className="flex flex-col gap-1">
                                {scrapedItem.nameConfidence && (
                                    <div>Name: {scrapedItem.nameConfidence}% confidence</div>
                                )}
                                {scrapedItem.priceConfidence && (
                                    <div>Price: {scrapedItem.priceConfidence}% confidence</div>
                                )}
                                {scrapedItem.imageConfidence && (
                                    <div>Image: {scrapedItem.imageConfidence}% confidence</div>
                                )}
                            </div>
                        </div>
                    )}
                    <List
                        item={scrapedItem}
                        addItem={true}
                        setSelectedCartIds={setSelectedCartIds}
                    /> 
                    <Button 
                        onClick={() => addItem(scrapedItem, selectedCartIds)}
                        isAccent={true}
                    >
                        Add Item
                    </Button>
            </Container>
        </FixedContainer>
    )
};

export default AddItemModal;
