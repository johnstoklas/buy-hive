import React, { useState } from 'react';
import '../css/main.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import OrganizationSection from './OrganizationSection.jsx';

const Extension = () => {
    const [organizationSections, setOrganizationSections] = useState([
      { id: 0, title: 'Test Section 1' }
    ]); // Start with no sections
    const [fileName, setFileName] = useState('');

    // Function to add a new OrganizationSection when the button is clicked
    const handleAddSection = (newFileName) => {
      if (newFileName.trim()) {
        setOrganizationSections((prevSections) => [
          ...prevSections,
          { id: prevSections.length, title: newFileName } // Store only the data
        ]);
      }
      setFileName(''); // Reset fileName after adding
    };

    const updateSectionTitle = (updatedTitle, sectionId) => {
      setOrganizationSections(prevSections =>
          prevSections.map(section =>
              section.id === sectionId
                  ? { ...section, title: updatedTitle }
                  : section
          )
      );
    };
  
    return (
        <>
            <Header />
            <section id="organization-section" className="section">
                {organizationSections.length === 0 ? (
                  <div class="organization-section-empty">
                    <p> Looks like you have nothing here yet. </p>
                    <p> Click 📁 to get started! </p>  
                  </div>
                ) : (
                  organizationSections.map((section) => (
                    <OrganizationSection 
                      sectionId={section.id} 
                      title={section.title} 
                      sectionTitle={section.title}
                      updateSectionTitle={updateSectionTitle}
                    />
                ))
                )}
            </section>
            <Footer 
              fileName={fileName} 
              setFileName={setFileName}
              handleAddSection={handleAddSection}
              organizationSections={organizationSections}
            />
        </>
    );
};

export default Extension;
