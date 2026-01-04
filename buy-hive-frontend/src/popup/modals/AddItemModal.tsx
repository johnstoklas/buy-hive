import { useEffect, useState, useRef, type Dispatch, type SetStateAction } from 'react';
import { standardizePrice } from '../../utils/standardizePrice';
import { useClickOutside } from '../../hooks/useClickOutside';
import Button from '../ui/button';
import Container from '../ui/containerUI/container';
import CloseButton from '../ui/closeButton';
import ContainerHeader from '../ui/containerUI/containerHeader';
import Image from '../ui/itemUI/itemImage';
import ItemHeader from '../ui/itemUI/itemHeader';
import LoadingBar from '../ui/loadingBar';
import List from '../ui/list';
import type { ScrapedItemType } from '@/types/ItemTypes';
import ItemNote from '../ui/itemUI/itemNote';
import FixedContainer from '../ui/containerUI/fixedContainer';

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
    selected_cart_ids: [],
  });
  
  const addItemRef = useRef(null);

  // Handles if user clicks outside of the component
  useClickOutside(addItemRef, addItemVisible, setAddItemVisible, [addItemButtonRef]);

  // On mount set the cart to animating
  useEffect(() => {
      setAddItemAnimating(true);
  }, []);

  // Gathers price, title, image, and url data for current page
  useEffect(() => {
    const handleScrapePage = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) return;

            chrome.tabs.sendMessage(tabId, { action: "extractProduct" }, (response) => {
                if (response?.success) {
                    const res = response.data;
                    setScrapedItem(prev => ({
                      ...prev,
                      title: res.title,
                      price: standardizePrice(res.price),
                      url: res.url,
                      image: res.image,
                    }));

                    
                } else {
                    console.error(response?.error);
                }
            }
            );
        });
    }

    handleScrapePage();
  }, []);

  // handles adding an item to carts
  const handleAddItem = () => {
    if(!scrapedItem.name || !scrapedItem.price || !scrapedItem.image || !scrapedItem.url) return;

      chrome.runtime.sendMessage({action: "addItem", data: { scrapedItem }}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          console.log("fetched data ", response.data.item);
          // chrome.runtime.sendMessage({action: "updateItems", data: response.data.item});
          // showNotification("Succesfully added item!", true);
        } else if(response?.status === "error") {
          // showNotification("Error adding item", false);
          console.error("Error adding item:", response?.message);
        }
      });
  }

  return (
    <FixedContainer>
      <Container
        ref={addItemRef}
        className={`!flex-col relative ${addItemVisible ? "slide-in" : "slide-out"}`}
        onAnimationEnd={() => {
          if (!addItemVisible) setAddItemAnimating(false);
        }}
      >
            <div className="flex">
              <ContainerHeader> Add Item </ContainerHeader>
              <CloseButton onClick={() => setAddItemVisible(false)} />
            </div>
            <Container className="!gap-1 justify-center">
                  {scrapedItem.image ? (
                    <Image 
                      item={scrapedItem}
                    />
                  ) : (
                    <LoadingBar 
                      className="w-20 h-20"
                    />
                  )}
                  <Container className="!flex-col !p-0 !gap-1">
                      {scrapedItem.name && scrapedItem.price ? (
                          <ItemHeader
                              item={scrapedItem}
                          />
                      ) : (
                          <div className="flex flex-col gap-1">
                              <LoadingBar 
                                className="w-full h-4"
                              />
                              <LoadingBar 
                                className="w-[75%] h-4"
                              />
                          </div>
                      )}
                      <ItemNote
                        isEditing={true}
                        noteRef={null}
                        placeholder="Notes"
                        noteValue={scrapedItem.notes}
                        setNoteValue={(value) => setScrapedItem(prev => ({ ...prev, note: value }))}
                        onBlur={() => {}}
                        onKeyDown={() => {}}
                      />
                  </Container>
            </Container>
            <List
              item={scrapedItem}
              setSelectedCartIds={(value) => setScrapedItem(prev => ({ ...prev, note: value }))}
            /> 
            <Button onClick={() => handleAddItem}>
              Add Item
            </Button>
      </Container>
    </FixedContainer>
  )
};

export default AddItemModal;
