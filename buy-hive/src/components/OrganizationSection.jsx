import React, { useState, useRef, useEffect } from 'react';
import ExpandSection from './ExpandSection.jsx';
import ModifyOrgSec from './ModifyOrgSec.jsx';

function OrganizationSection({ sectionId, title, newFileName, updateSectionTitle, setIsLocked}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [sectionHeight, setSectionHeight] = useState('45px');
    const [expandSectionCount, setExpandSectionCount] = useState(0); 
    const expandedSectionRef = useRef(null);
    const [modifyOrgSec, setModifyOrgSec] = useState(false);
    const [modOrgHidden, setModOrgHidden] = useState(false);
    const [sectionTitle, setSectionTitle] = useState(title);
    const [modifyOrgSecPostion, setModifyOrgSecPosition] = useState('below');

    const modifyOrgSecRef = useRef(null);
    const folderRef = useRef(null);

    // Dynamically updates the file name 
    useEffect(() => {
        if(newFileName) {
            setSectionTitle(newFileName);
            updateOrganizationSections(newFileName);
        }
    }, [newFileName]);

    // Sends modified title so that it can be updated elsewhere in the extension
    useEffect(() => {
        if (sectionTitle !== title) {
            updateSectionTitle(sectionTitle, sectionId); 
        }
    }, [sectionTitle, sectionId, updateSectionTitle]); 

    // When a file is opened the file expands to show contents
    useEffect(() => {
        if (expandedSectionRef.current) {
            const expandedDisplayHeight = expandedSectionRef.current.scrollHeight; 
            if (isExpanded && expandedDisplayHeight != 0) {
                setSectionHeight(`${expandedDisplayHeight + 60}px`);
            } else {
                setSectionHeight('45px');
            }
        }
    }, [isExpanded]); 

    const expandSectionClick = () => {
        setIsExpanded(!isExpanded);
    };

    // Opens modification screen when three circle button is pressed
    const openModifySec = () => {
        if (!modOrgHidden) {
            setModifyOrgSec(!modifyOrgSec);
            if (folderRef.current) {
                const parentRect = folderRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - parentRect.bottom;
                const spaceAbove = parentRect.top;

                if (spaceBelow < 150) {
                    setModifyOrgSecPosition('above');
                } else {
                    setModifyOrgSecPosition('below');
                }
            }
        }
    };

    return (
        <>
        <div
            className="expand-section-main-display section"
            style={{ height: sectionHeight, overflow: 'hidden', transition: 'height 0.3s ease' }}
            id={sectionId}
        >
            <section className="expand-section">
                <div className="expand-section-content" ref={folderRef}>
                    <button
                        className={`expand-section-button ${isExpanded && (expandSectionCount > 0) ? 'rotate' : ''}`}
                        onClick={expandSectionClick}
                    >
                        ▶
                    </button>
                    <h4 className="expand-section-title"> { sectionTitle } </h4>
                    <h4 className="expand-section-items">{expandSectionCount}</h4> 
                    <button className="expand-section-share" onClick={openModifySec}> &#8942; </button>
                </div>
                {modifyOrgSec && <ModifyOrgSec 
                newFileName={sectionTitle}
                updateFileName={setSectionTitle}
                setModifyOrgSec={setModifyOrgSec}
                modOrgHidden={modOrgHidden}
                setModOrgHidden={setModOrgHidden}
                setIsLocked={setIsLocked}
                position={modifyOrgSecPostion}
                ref={modifyOrgSecRef}
                />}
            </section>
            <div
                className="expand-section-expanded-display"
                ref={expandedSectionRef}
            >
                {isExpanded && (
                    [...Array(expandSectionCount)].map((_, index) => (
                        <ExpandSection key={index} />
                    ))
                )}
            </div>
        </div>
        </>
    );
}

export default OrganizationSection;
