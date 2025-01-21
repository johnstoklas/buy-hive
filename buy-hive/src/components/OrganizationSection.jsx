import React, { useState, useRef, useEffect } from 'react';
import ExpandSection from './ExpandSection.jsx';
import ModifyOrgSec from './ModifyOrgSec.jsx';

function OrganizationSection({ sectionId, title, newFileName, updateSectionTitle }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [sectionHeight, setSectionHeight] = useState('45px');
    const [expandSectionCount, setExpandSectionCount] = useState(0); // Initialize with a count of 2 for example
    const expandedSectionRef = useRef(null);
    const [modifyOrgSec, setModifyOrgSec] = useState(false);
    const [sectionTitle, setSectionTitle] = useState(title);

    const expandSectionClick = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if(newFileName) {
            setSectionTitle(newFileName);
            updateOrganizationSections(newFileName);
        }
    }, [newFileName]);

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

    const openModifySec = () => {
        setModifyOrgSec(!modifyOrgSec)
    }

    useEffect(() => {
        if (sectionTitle !== title) {
            updateSectionTitle(sectionTitle, sectionId); // Send section title up to parent
        }
    }, [sectionTitle, sectionId, updateSectionTitle]); // Update title in the parent on change


    return (
        <>
        <div
            className="expand-section-main-display section"
            style={{ height: sectionHeight, overflow: 'hidden', transition: 'height 0.3s ease' }}
            id={sectionId}
        >
            <section className="expand-section">
                <div className="expand-section-content">
                    <button
                        className={`expand-section-button ${isExpanded && (expandSectionCount > 0) ? 'rotate' : ''}`}
                        onClick={expandSectionClick}
                    >
                        ▶
                    </button>
                    <h4 className="expand-section-title"> { sectionTitle } </h4>
                    <h4 className="expand-section-items">{expandSectionCount}</h4> {/* Dynamically set the count */}
                    <button className="expand-section-share" onClick={openModifySec}> &#8942; </button>
                </div>
            </section>
            {modifyOrgSec && <ModifyOrgSec 
                newFileName={sectionTitle}
                updateFileName={setSectionTitle}
                />}
            {/*<ModifyOrgSec />*/}

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
