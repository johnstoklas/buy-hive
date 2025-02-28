import React, { useState, useRef, useEffect } from "react";
import ExpandSection from "./ExpandSection.jsx";
import ModifyOrgSec from "./ModifyOrgSec.jsx";
import { useLocked } from './LockedProvider.jsx'


function OrganizationSection({
  sectionId,
  title,
  items,
  userName,
  handleEditSection,
  handleDeleteSection,
  cartsArray,
  handleUpdateItem,
  expandedFolders,
  setExpandedFolders,
  fetchOrganizationSections,
  isLoading,
  setIsLoading,
}) {
  const [sectionHeight, setSectionHeight] = useState("45px");
  const [sectionTitle, setSectionTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [modifyOrgSec, setModifyOrgSec] = useState(false);
  const [modOrgHidden, setModOrgHidden] = useState(false);
  const [modifyOrgSecPosition, setModifyOrgSecPosition] = useState("below");
  
  const [itemsInFolder, setItemsInFolder] = useState(items);
  const [folders, setFolders] = useState({});

  const expandedSectionRef = useRef(null);
  const folderRef = useRef(null);
  const inputRef = useRef(null);
  const folderTitleRef = useRef(title);

  const { isLocked } = useLocked();

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
  }, [isLoading, isExpanded]); // Trigger when loading or expanded state changes

  const fetchFolderItems = (cartId) => {
      if (!userName?.email) {
        console.error("User is not logged in.");
        return;
      }
  
      chrome.runtime.sendMessage({
          action: "fetchFolderItems",
          data: {
            email: userName.email,
            cartId: cartId,
          },
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(`Error communicating with background script: ${chrome.runtime.lastError.message}`);
            return;
          }
  
          if (response?.status === "success") {
            console.log("Updated carts:", response.data);
            setItemsInFolder(response.data.items);
            setIsExpanded(true);
          } else {
            console.error("Error fetching data:", (response?.message || "Unknown error occurred."));
          }
        }
      );
  };

  // Edit item notes
  const handleEditNotes = (notes, cartId, itemId) => {
    return new Promise((resolve, reject) => {
      if (notes.trim()) {
        // Send update request to background script
        const data = {
          email: userName.email,
          notes,
          cartId,
          itemId,
        };
  
        chrome.runtime.sendMessage(
          { action: "editNotes", data: data },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error communicating with background script:", chrome.runtime.lastError.message);
              return;
            }
  
            if (response?.status === "success") {
              fetchOrganizationSections();
              resolve();
            } else {
              console.error("Error editing notes:", response?.error);
            }
          }
        );
      }
    });
  };
  

  // Moves item to carts
  const handleMoveItem = (itemId, selectedCarts, unselectedCarts) => {
    return new Promise((resolve, reject) => {
      console.log("item id: ", itemId);
      const data = {
        email: userName.email,
        itemId: itemId,
        selectedCarts: selectedCarts,
        unselectedCarts: unselectedCarts,
      }

      console.log(data);

      chrome.runtime.sendMessage({action: "moveItem", data: data}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          //fetchOrganizationSections();
          fetchOrganizationSections();
          resolve();
        } else {
          console.error("Error moving item:", response?.error);
        }
      });
    });
  }

  // Delete an item
  const handleDeleteItem = (cartId, itemId) => {
    return new Promise((resolve, reject) => {
      const data = {
        email: userName.email,
        cartId: cartId,
        itemId: itemId,
      };

      console.log(data);

      chrome.runtime.sendMessage({action: "deleteItem", data: data}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          // Fetch the latest list after deletion
          //fetchFolderItems(cartId);
          fetchOrganizationSections();
          //updateScreenSize();
          resolve();

        } else {
          console.error("Error deleting item:", response?.error);
        }
      });
    });
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
  
    // Toggle the expanded state of the folder
    setIsExpanded((prev) => {
      const newExpandedState = !prev;
      
      // Update the expandedFolders state to persist the open folders
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
              isExpanded && itemsInFolder.length > 0 ? "rotate" : ""
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
            handleDeleteSection={handleDeleteSection}
            cartId={sectionId}
            handleTitleClick={handleTitleClick}
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
              handleEditNotes={handleEditNotes}
              handleDeleteItem={handleDeleteItem}
              cartId={sectionId}
              itemId={item.item_id}
              cartsArray={cartsArray}
              handleMoveItem={handleMoveItem}
            />
          ))
        )
      )}
      </div>
    </div>
  );
}

export default OrganizationSection;
