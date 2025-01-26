import React, { useState, useEffect } from 'react';
import '../css/main.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import OrganizationSection from './OrganizationSection.jsx';

const Extension = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [organizationSections, setOrganizationSections] = useState([]);
  const [fileName, setFileName] = useState('');
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserName(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (userName?.email) {
      chrome.runtime.sendMessage(
        { action: "fetchData", data: { email: userName.email } },
        (response) => {
          console.log("Fetching data...");
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
            return;
          }

          if (response?.status === "success") {
            console.log("Data fetched successfully:", response.data);

            // Transform data into an array if it's not already
            const transformedData = Array.isArray(response.data)
              ? response.data
              : Object.entries(response.data).map(([key, value]) => ({
                  ...value, // Spread section data
                  id: key, // Add a unique key if needed
                }));

            setOrganizationSections(transformedData); // Populate state with transformed data
          } else {
            console.error("Error fetching data:", response?.message);
          }
        }
      );
    }
  }, [userName]);

  const handleAddSection = (newFileName) => {
    if (!userName) {
      console.error("User is not logged in.");
      return;
    }

    const data = {
      email: userName.email,
      cartName: newFileName,
    };

    if (newFileName.trim()) {
      chrome.runtime.sendMessage({ action: "addNewFolder", data: data }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
          return;
        }

        if (response?.success) {
          console.log("Folder added successfully:", response.data);
          // Refresh data or add the new folder to state manually
          setOrganizationSections((prev) => [
            ...prev,
            { cart_name: newFileName, item_count: 0, items: [], created_at: new Date().toISOString() },
          ]);
        } else {
          console.error("Error adding folder:", response?.error);
        }
      });
    }
  };

  return (
    <>
      <Header />
      <section id="organization-section">
        {organizationSections.length > 0 ? (
          organizationSections.map((section, index) => (
            <OrganizationSection
              key={index}
              sectionId={index}
              title={section.cart_name}
              itemCount={section.item_count}
              items={section.items}
              createdAt={section.created_at}
              setIsLocked={setIsLocked}
            />
          ))
        ) : (
          <div className="organization-section-empty">
            <p>Looks like you have nothing here yet.</p>
            <p>Click 📁 to get started!</p>
          </div>
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
