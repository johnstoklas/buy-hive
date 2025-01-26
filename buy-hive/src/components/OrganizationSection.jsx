import React, { useState, useRef, useEffect } from "react";
import ExpandSection from "./ExpandSection.jsx";
import ModifyOrgSec from "./ModifyOrgSec.jsx";

function OrganizationSection({
  sectionId,
  title,
  items = [],
  updateSectionTitle,
  setIsLocked,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sectionHeight, setSectionHeight] = useState("45px");
  const [sectionTitle, setSectionTitle] = useState(title);
  const [modifyOrgSec, setModifyOrgSec] = useState(false);
  const [modOrgHidden, setModOrgHidden] = useState(false);
  const [modifyOrgSecPosition, setModifyOrgSecPosition] = useState("below");

  const expandedSectionRef = useRef(null);
  const folderRef = useRef(null);

  // Sync section title with props
  useEffect(() => {
    setSectionTitle(title);
  }, [title]);

  // Dynamically adjust height when expanded
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

  // Send updated title to the parent component
  useEffect(() => {
    if (sectionTitle !== title) {
      updateSectionTitle(sectionTitle, sectionId);
    }
  }, [sectionTitle, sectionId, title, updateSectionTitle]);

  // Handle expanding/collapsing the section
  const handleExpandClick = () => {
    setIsExpanded((prev) => !prev);
  };

  // Handle opening the modification screen
  const handleModifyClick = () => {
    if (!modOrgHidden) {
      setModifyOrgSec((prev) => !prev);
      if (folderRef.current) {
        const parentRect = folderRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - parentRect.bottom;

        setModifyOrgSecPosition(spaceBelow < 150 ? "above" : "below");
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
      <section className="expand-section">
        <div className="expand-section-content" ref={folderRef}>
          <button
            className={`expand-section-button ${
              isExpanded && items.length > 0 ? "rotate" : ""
            }`}
            onClick={handleExpandClick}
          >
            ▶
          </button>
          <h4 className="expand-section-title">{sectionTitle}</h4>
          <h4 className="expand-section-items">{items.length}</h4>
          <button className="expand-section-share" onClick={handleModifyClick}>
            &#8942;
          </button>
        </div>
        {modifyOrgSec && (
          <ModifyOrgSec
            newFileName={sectionTitle}
            updateFileName={setSectionTitle}
            setModifyOrgSec={setModifyOrgSec}
            modOrgHidden={modOrgHidden}
            setModOrgHidden={setModOrgHidden}
            setIsLocked={setIsLocked}
            position={modifyOrgSecPosition}
            ref={folderRef}
          />
        )}
      </section>
      <div
        className="expand-section-expanded-display"
        ref={expandedSectionRef}
      >
        {isExpanded &&
          items.map((item, index) => (
            <ExpandSection key={index} item={item} />
          ))}
        {isExpanded && items.length === 0 && (
          <p className="no-items-text">No items available in this section.</p>
        )}
      </div>
    </div>
  );
}

export default OrganizationSection;
