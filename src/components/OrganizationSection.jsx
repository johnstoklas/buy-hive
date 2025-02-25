import React, { useState, useRef, useEffect } from "react";
import ExpandSection from "./ExpandSection.jsx";
import ModifyOrgSec from "./ModifyOrgSec.jsx";
import { useLocked } from './LockedProvider.jsx'

function OrganizationSection({
  sectionId,
  title,
  items,
  handleEditSection,
  handleDeleteSection,
  handleEditNotes,
  handleDeleteItem,
  cartsArray,
  handleMoveItem,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sectionHeight, setSectionHeight] = useState("45px");
  const [sectionTitle, setSectionTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [modifyOrgSec, setModifyOrgSec] = useState(false);
  const [modOrgHidden, setModOrgHidden] = useState(false);
  const [modifyOrgSecPosition, setModifyOrgSecPosition] = useState("below");

  const expandedSectionRef = useRef(null);
  const folderRef = useRef(null);
  const inputRef = useRef(null);
  const folderTitleRef = useRef(title);

      const { isLocked } = useLocked();
  

  useEffect(() => {
    setSectionTitle(title);
  }, [title]);

  useEffect(() => {
    if (expandedSectionRef.current) {
      const expandedDisplayHeight = expandedSectionRef.current.scrollHeight;
      setSectionHeight(
        isExpanded && expandedDisplayHeight
          ? `${expandedDisplayHeight + 60}px`
          : "45px"
      );
    }
  }, [isExpanded, items]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleExpandClick = () => {
    if(!isLocked) {
      setIsExpanded((prev) => !prev);
    }
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
              isExpanded && items.length > 0 ? "rotate" : ""
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

          <h4 className="expand-section-items">{items ? items.length : 0}</h4>
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
        {isExpanded &&
          items.map((item) => (
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
          ))}
      </div>
    </div>
  );
}

export default OrganizationSection;
