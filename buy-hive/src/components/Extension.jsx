import React, { useState, useEffect } from 'react';
import '../css/main.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import OrganizationSection from './OrganizationSection.jsx';


const Extension = () => {

  const [isLocked, setIsLocked] = useState(false);
    
    const [organizationSections, setOrganizationSections] = useState([
      { id: 0, title: 'Test Section 1' },
      { id: 1, title: 'Test Section 2' },
      { id: 2, title: 'Test Section 3' },
      { id: 3, title: 'Test Section 4' },
      { id: 4, title: 'Test Section 5' },
      { id: 5, title: 'Test Section 6' },
      { id: 6, title: 'Test Section 7' },
      { id: 7, title: 'Test Section 8' }
    ]);
    const [fileName, setFileName] = useState('');
    const [userName, setUserName] = useState(null);

    useEffect(() => {
      const storedUser = localStorage.getItem("userName");
      if (storedUser) {
        setUserName(JSON.parse(storedUser));
      }
    }, []);

    // Adds new organization section on button click
    async function handleAddSection(newFileName) {
      const data = {
        email: userName.email, 
        cartName: newFileName
      }
      chrome.runtime.sendMessage({message: 'addNewFolder', data: data});
    };

    // Updates the organization section title
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
            <section id="organization-section">
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
                      setIsLocked={setIsLocked}
                    />
                ))
                )}
            </section>
            <Footer 
              fileName={fileName} 
              setFileName={setFileName}
              handleAddSection={handleAddSection}
              organizationSections={organizationSections}
              setUserName={setUserName}
              isLocked={isLocked}
            />
        </>
    );
};

export default Extension;
