import React, { useState, useRef, useEffect } from 'react';
import ExpandSection from './ExpandSection.jsx';

function OrganizationSection({ title }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [sectionHeight, setSectionHeight] = useState('45px');
    const [expandSectionCount, setExpandSectionCount] = useState(0); // Initialize with a count of 2 for example
    const expandedSectionRef = useRef(null);

    const expandSectionClick = () => {
        setIsExpanded((prevState) => !prevState);
    };

    useEffect(() => {
        if (expandedSectionRef.current) {
            const expandedDisplayHeight = expandedSectionRef.current.scrollHeight; 
            if (isExpanded) {
                setSectionHeight(`${expandedDisplayHeight + 60}px`);
            } else {
                setSectionHeight('45px');
            }
        }
    }, [isExpanded]); 

    return (
        <div
            className="expand-section-main-display section"
            style={{ height: sectionHeight, overflow: 'hidden', transition: 'height 0.3s ease' }}
        >
            <section className="expand-section">
                <button
                    className={`expand-section-button ${isExpanded ? 'rotate' : ''}`}
                    onClick={expandSectionClick}
                >
                    ▶
                </button>
                <h4 className="expand-section-title"> { title } </h4>
                <h4 className="expand-section-items">{expandSectionCount}</h4> {/* Dynamically set the count */}
                <button className="expand-section-share"> &#8942; </button>
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
    );
}

export default OrganizationSection;
