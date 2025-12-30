import React, { useState, useEffect, useRef } from "react";
import "../css/main.css";
import Header from "./Header.jsx";
import Footer from "./footer/Footer.jsx";
import SignInPage from "./profile/SignInPage.jsx";
import OrganizationSection from "./folder/OrganizationSection.jsx";
import UserNotification from './UserNotification.jsx';

import { LockedProvider, useLocked } from "./contexts/LockedProvider.jsx";
import { userDataContext } from "./contexts/UserProvider.jsx"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

import { useAuth0 } from '@auth0/auth0-react';

const Extension = () => {
  const [organizationSections, setOrganizationSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [notificationVisible, setNotificationVisible] = useState(false); // toggles visiblity of user notificaton
  const [notifMessage, setNotifMessage] = useState(""); 
  const [notifStatus, setNotifStatus] = useState(true); // whether success or error

  const [addFileState, setAddFileState] = useState(false); // toggles visiblity for add folder

  const organizationSectionRef = useRef(null);

  const { userData, setUserData } = userDataContext();  
  const { setIsLocked } = useLocked();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
  const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;

  useEffect(() => {
    const restoreSession = async () => {
      const { accessToken, user } = await chrome.storage.session.get([
        "accessToken",
        "user"
      ]);

      console.log("session data", accessToken)
      console.log("user", user)

      if (accessToken && user) {
        await getAccessTokenSilently({
          authorizationParams: { audience: AUTH0_AUDIENCE }
        });
        console.log("authenticated?", isAuthenticated);
        setUserData(accessToken);
        return;
      }
    };

    restoreSession();
  }, []);


  const showNotification = (message, isSuccess) => {
    setNotifMessage(message);
    setNotifStatus(isSuccess);
    setNotificationVisible(true);

    // Optional: Auto-hide after a few seconds
    //1000
    setTimeout(() => setNotificationVisible(false), 1500);
  };

  // Add item to cart
  const handleAddItem = (data) => {
      const newData = {
        accessToken: userData,
        itemData: data,
      }

      chrome.runtime.sendMessage({action: "addItem", data: newData}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          console.log("Error adding item:", response?.message);
          return;
        }
  
        if (response?.status === "success") {
          console.log("fetched data ", response.data.item);
          chrome.runtime.sendMessage({action: "updateItems", data: response.data.item});
          showNotification("Succesfully added item!", true);
        } else if(response?.status === "error") {
          showNotification("Error adding item", false);
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
    if (userData) {
      setIsLoading(true);
      chrome.runtime.sendMessage(
        { action: "fetchCarts", data: { accessToken: userData } },
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
      <>
        <Header />
        <section id="organization-section" 
        style={{ overflowY: 'auto', maxHeight: '400px' }}
        ref={organizationSectionRef}>
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
                  showNotification={showNotification}
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
            <UserNotification 
                notificationVisible={notificationVisible}
                notifStatus={notifStatus}
                notifMessage={notifMessage}
                addFileState={addFileState}
            />
        </section>
        <Footer
          organizationSections={organizationSections}
          setOrganizationSections={setOrganizationSections}
          cartsArray={organizationSections}
          handleAddItem={handleAddItem}
          showNotification={showNotification}
          addFileState={addFileState}
          setAddFileState={setAddFileState}
          organizationSectionRef={organizationSectionRef}
        />
      </>
  );
};

export default Extension;
