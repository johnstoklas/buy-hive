import React, { useState, useEffect, useContext } from "react";
import "../css/main.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import SignInPage from "./SignInPage.jsx";
import OrganizationSection from "./OrganizationSection.jsx";

import { LockedProvider } from "./contexts/LockedProvider.jsx";
import { userDataContext } from "./contexts/UserProvider.jsx"
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Extension = () => {
  const [organizationSections, setOrganizationSections] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { userData } = userDataContext();  

  // Add item to cart
  const handleAddItem = (data) => {
      const newData = {
        email: userData.email,
        itemData: data,
      }

      chrome.runtime.sendMessage({action: "addItem", data: newData}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          fetchOrganizationSections();
        } else {
          console.error("Error adding item:", response?.error);
        }
      });
  }

  const handleUpdateItem = (updatedItem) => {
    setOrganizationSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.item_id === updatedItem.item_id ? updatedItem : item
        ),
      }))
    );
  };

  useEffect(() => {
    localStorage.setItem('expandedFolders', JSON.stringify(expandedFolders));
  }, [expandedFolders]);

  const fetchOrganizationSections = () => {
    if (userData?.email) {
      setIsLoading(true);
      chrome.runtime.sendMessage(
        { action: "fetchData", data: { email: userData.email } },
        (response) => {
          if (response?.status === "success") {
            console.log(response.data);
            setOrganizationSections(response.data.carts || []);
          } else {
            console.error("Error fetching data:", response?.message);
          }
          setIsLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    fetchOrganizationSections();
  }, [userData]);

  return (
      <LockedProvider>
        <Header />
        <section id="organization-section" style={{ overflowY: 'auto', maxHeight: '400px' }}>
          {userData ? (
            isLoading ? (
              <div className="spinner-loader main-page-sl"></div>
            ) : organizationSections.length > 0 ? (
              organizationSections.map((section) => (
                <OrganizationSection
                  key={section.cart_id}
                  sectionId={section.cart_id}
                  title={section.cart_name}
                  itemCount={section.item_count}
                  items={section.items}
                  createdAt={section.created_at}
                  organizationSections={organizationSections}
                  setOrganizationSections={setOrganizationSections}
                  handleUpdateItem={handleUpdateItem}
                  expandedFolders={expandedFolders}
                  setExpandedFolders={setExpandedFolders}
                  fetchOrganizationSections={fetchOrganizationSections}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              ))
            ) : (
              <div className="organization-section-empty">
                <p>Looks like you have nothing here yet.</p>
                <p>Click <FontAwesomeIcon id="org-sec-empty-folder" icon={faFolder} /> to get started!</p>
              </div>
            )
          ) : (
            <SignInPage homePage={true} />
          )}
        </section>
        <Footer
          organizationSections={organizationSections}
          setOrganizationSections={setOrganizationSections}
          cartsArray={organizationSections}
          handleAddItem={handleAddItem}
        />
      </LockedProvider>
  );
};

export default Extension;
