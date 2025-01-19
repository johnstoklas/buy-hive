import React, { useState } from 'react';
import '../css/main.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import OrganizationSection from './OrganizationSection.jsx';
import AddFile from './AddFile.jsx';

const Extension = () => {
    const [organizationSections, setOrganizationSections] = useState([]); // Start with no sections
    const [fileName, setFileName] = useState('');

    // Function to add a new OrganizationSection when the button is clicked
    const handleAddSection = (newFileName) => {
      if (newFileName.trim()) {
          setOrganizationSections((prevSections) => [
              ...prevSections,
              <OrganizationSection key={prevSections.length} title={newFileName} />
          ]);
      }
      setFileName('');
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
                    organizationSections 
                )}
            </section>
            <Footer 
              fileName={fileName} 
              setFileName={setFileName}
              handleAddSection={handleAddSection}
            />
        </>
    );
};

export default Extension;
