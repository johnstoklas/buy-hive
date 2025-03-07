import React, { useState, useEffect, useContext } from "react";
import "../css/main.css";
import Header from "./Header.jsx";
import Footer from "./footer/Footer.jsx";
import SignInPage from "./profile/SignInPage.jsx";
import OrganizationSection from "./folder/OrganizationSection.jsx";

import { LockedProvider } from "./contexts/LockedProvider.jsx";
import { userDataContext } from "./contexts/UserProvider.jsx"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const Extension = () => {
  const [organizationSections, setOrganizationSections] = useState([]);
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
          console.log("fetched data ", response.data.item);
          chrome.runtime.sendMessage({action: "updateItems", data: response.data.item});
        } else {
          console.error("Error adding item:", response?.message);
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
              organizationSections.map((cart) => (
                <OrganizationSection
                  cart={cart}
                  organizationSections={organizationSections}
                  setOrganizationSections={setOrganizationSections}
                  handleUpdateItem={handleUpdateItem}
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
