import React, { useState, useRef, useEffect } from "react";
import ExpandSection from "./ExpandSection.jsx";
import ModifyOrgSec from "./ModifyOrgSec.jsx";
import { useLocked } from './contexts/LockedProvider.jsx'
import { userDataContext } from "./contexts/UserProvider.jsx";


function OrganizationSection({
  sectionId,
  title,
  items,
  organizationSections,
  setOrganizationSections,
  expandedFolders,
  setExpandedFolders,
  fetchOrganizationSections,
  isLoading,
}) {
  const [sectionHeight, setSectionHeight] = useState("45px");
  const [sectionTitle, setSectionTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [modifyOrgSec, setModifyOrgSec] = useState(false);
  const [modOrgHidden, setModOrgHidden] = useState(false);
  const [modifyOrgSecPosition, setModifyOrgSecPosition] = useState("below");
  
  const [itemsInFolder, setItemsInFolder] = useState(items);

  const expandedSectionRef = useRef(null);
  const folderRef = useRef(null);
  const inputRef = useRef(null);
  const folderTitleRef = useRef(title);

  const { isLocked } = useLocked();
  const { userData } = userDataContext();

  const [isExpanded, setIsExpanded] = useState(expandedFolders[sectionId] || false);

  // Ensure that the state is updated when the parent changes
  useEffect(() => {
    setIsExpanded(expandedFolders[sectionId] || false);
  }, [expandedFolders, sectionId]);

  useEffect(() => {
    if (!isLoading) {
      // Allow animation only after loading is done
      updateScreenSize();
    }
  }, [isLoading, isExpanded, itemsInFolder]); // Trigger when loading or expanded state changes

  const updateItem = (data, message) => {
    chrome.runtime.sendMessage({message, data});
  }

  useEffect(() => {
    setSectionTitle(title);
  }, [title]);

  const updateScreenSize = () => {
    if (expandedSectionRef.current) {
      const expandedDisplayHeight = expandedSectionRef.current.scrollHeight;
      setSectionHeight(
        isExpanded && expandedDisplayHeight
          ? `${expandedDisplayHeight + 60}px`
          : "45px"
      );
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleExpandClick = () => {
    if (isLocked) return;

    setIsExpanded((prev) => {
      const newExpandedState = !prev;
      
      setExpandedFolders(prevState => ({
        ...prevState,
        [sectionId]: newExpandedState
      }));
  
      return newExpandedState;
    });
  };
  
  const handleModifyClick = () => {
    if (!modOrgHidden && !isLocked) {
      setModifyOrgSec((prev) => !prev);
      if (folderRef.current) {
        const parentRect = folderRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - parentRect.bottom;

        setModifyOrgSecPosition(spaceBelow < 150 ? "above" : "below");
      }
    }
  };

  //handles editing name of a folder
  const handleTitleClick = () => {
    if(!isLocked) {
      setIsEditing(true);
      setModifyOrgSec(false);
    }
  };

  const handleTitleChange = (e) => {
    setSectionTitle(e.target.value);
  };

  // Edits an existing folder
  const handleEditSection = (newFileName, cartId) => {
      if (!userData) return;
      if (!cartId) return; 
      if (!newFileName.trim()) return;
  
      const isDuplicate = organizationSections.some(
        (section) => section.cart_name === newFileName.trim() && section.cart_id !== cartId
      );
  
      if (isDuplicate) {
        return;
      }
  
      const data = {
        email: userData.email,
        newCartName: newFileName.trim(),
        cartId: cartId,
      };
  
      chrome.runtime.sendMessage({ action: "editFolder", data }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          setOrganizationSections((prev) =>
            prev.map((section) =>
              section.cart_id === cartId ? { ...section, cart_name: newFileName.trim() } : section
            )
          );
        } else {
          console.error("Error updating folder:", response?.error);
        }
      });
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if(sectionTitle) {
      folderTitleRef.current = sectionTitle;
      handleEditSection(sectionTitle, sectionId);
    }
    else {
      setSectionTitle(folderTitleRef.current);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      if(sectionTitle) {
        folderTitleRef.current = sectionTitle;
        handleEditSection(sectionTitle, sectionId);
      }
      else {
        setSectionTitle(folderTitleRef.current);
      }
    }
  };

  useEffect(() => {
    const listener = (message) => {
        if (message.action === "cartUpdate") {
            const data = message.data;

            setItemsInFolder((prevItems) => {
                const existingItem = prevItems.find(item => item.item_id === data.item_id);
                const isInSelectedCarts = data.selected_cart_ids.includes(sectionId);

                let updatedItems;

                if (isInSelectedCarts) {
                    if (existingItem) {
                        // Update the item if it already exists
                        updatedItems = prevItems.map(item =>
                            item.item_id === data.item_id ? { ...item, ...data } : item
                        );
                    } else {
                        // Add the item if it doesn't exist
                        updatedItems = [...prevItems, data];
                    }
                } else {
                    // Remove the item if the cart is no longer selected
                    updatedItems = prevItems.filter(item => item.item_id !== data.item_id);
                }

                // After updating itemsInFolder, update organizationSections
                setOrganizationSections((prevSections) =>
                    prevSections.map(section =>
                        section.cart_id === sectionId
                            ? { ...section, items: updatedItems }
                            : section
                    )
                );

                return updatedItems;  // Return for setItemsInFolder
            });
        }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  useEffect(() => {
    const currentSection = organizationSections.find(section => section.cart_id === sectionId);
    setItemsInFolder(currentSection?.items || []);
  }, [organizationSections, sectionId]);


  
  

  return (
    <div
      className="expand-section-main-display section"
      style={{
        height: sectionHeight,
        overflow: "hidden",
        transition: "height 0.3s ease",
      }}
      id={sectionId}
    >
      <section className="expand-section" key={sectionId}>
        <div className="expand-section-content" ref={folderRef}>
          <button
            className={`expand-section-button ${
              itemsInFolder && isExpanded && itemsInFolder.length > 0 ? "rotate" : ""
          } ${isLocked ? "disabled-hover-modify" : ""}`}          
            onClick={handleExpandClick}
          >
            ▶
          </button>

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="expand-section-title-input"
              value={sectionTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
            />
          ) : (
            <h4 className="expand-section-title" onDoubleClick={handleTitleClick}>
              {sectionTitle}
            </h4>
          )}

          <h4 className="expand-section-items">{itemsInFolder ? itemsInFolder.length : 0}</h4>
          <button 
            className={!isLocked ? "expand-section-modify" : "expand-section-modify disabled-hover-modify"} 
            onClick={handleModifyClick}>
            &#8942;
          </button>
        </div>
        {modifyOrgSec && (
          <ModifyOrgSec
            newFileName={sectionTitle}
            setModifyOrgSec={setModifyOrgSec}
            modOrgHidden={modOrgHidden}
            setModOrgHidden={setModOrgHidden}
            position={modifyOrgSecPosition}
            ref={folderRef}
            handleEditSection={handleEditSection}
            cartId={sectionId}
            handleTitleClick={handleTitleClick}
            setOrganizationSections={setOrganizationSections}
          />
        )}
      </section>
      <div className="expand-section-expanded-display" ref={expandedSectionRef}>
      {isExpanded && (
        isLoading ? [] : (
          itemsInFolder.map((item) => (
            <ExpandSection
              key={item.item_id}
              item={item}
              cartId={sectionId}
              itemId={item.item_id}
              cartsArray={organizationSections}
              setItemsInFolder={setItemsInFolder}
            />
          ))
        )
      )}
      </div>
    </div>
  );
}

export default OrganizationSection;
