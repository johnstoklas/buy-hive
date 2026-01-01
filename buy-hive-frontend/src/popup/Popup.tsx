import Header from "./modules/Header";
import Footer from "./modules/Footer";
import "../styles/main.css"
import AccountPage from "./pages/AccountPage";
import { useEffect, useRef, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import HomePage from "./pages/HomePage";
import AddCart from "./modals/AddCartModal";
import { useTokenResponder } from "./hooks/tokenResponder";
import type { Cart } from "@/types/CartType";
import { useCarts } from "./context/CartsProvider";

const Popup = () => {
  useTokenResponder();
  const [accountPageVisible, setAccountPageVisible] = useState(true);
  const [addCartVisible, setAddCartVisible] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);

  const { setCarts } = useCarts();

  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

  const addCartButtonRef = useRef(null);

  useEffect(() => {
    const getUser = async() => {
      const { user } = await chrome.storage.session.get("user");
      if (!user) return;

      await getAccessTokenSilently({
          authorizationParams: {
              audience: AUTH0_AUDIENCE,
          }
      });

      console.log("user", user);

    }

    getUser();
  }, []);

  // const [organizationSections, setOrganizationSections] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  // const [notificationVisible, setNotificationVisible] = useState(false); // toggles visiblity of user notificaton
  // const [notifMessage, setNotifMessage] = useState(""); 
  // const [notifStatus, setNotifStatus] = useState(true); // whether success or error

  // const [addFileState, setAddFileState] = useState(false); // toggles visiblity for add folder

  // const organizationSectionRef = useRef(null);

  // const { userData } = userDataContext();  

  // const showNotification = (message, isSuccess) => {
  //   setNotifMessage(message);
  //   setNotifStatus(isSuccess);
  //   setNotificationVisible(true);

  //   // Optional: Auto-hide after a few seconds
  //   //1000
  //   setTimeout(() => setNotificationVisible(false), 1500);
  // };

  // // Add item to cart
  // const handleAddItem = (data) => {
  //     const newData = {
  //       accessToken: userData,
  //       itemData: data,
  //     }

  //     chrome.runtime.sendMessage({action: "addItem", data: newData}, (response) => {
  //       if (chrome.runtime.lastError) {
  //         console.error("Error communicating with background script:", chrome.runtime.lastError.message);
  //         console.log("Error adding item:", response?.message);
  //         return;
  //       }
  
  //       if (response?.status === "success") {
  //         console.log("fetched data ", response.data.item);
  //         chrome.runtime.sendMessage({action: "updateItems", data: response.data.item});
  //         showNotification("Succesfully added item!", true);
  //       } else if(response?.status === "error") {
  //         showNotification("Error adding item", false);
  //         console.error("Error adding item:", response?.message);
  //       }
  //     });
  // }

  // const handleUpdateItem = (updatedItem) => {
  //   setOrganizationSections((prevSections) =>
  //     prevSections.map((section) => ({
  //       ...section,
  //       items: section.items.map((item) =>
  //         item.item_id === updatedItem.item_id ? updatedItem : item
  //       ),
  //     }))
  //   );
  // };

  
  
  useEffect(() => {
    const handleGetCarts = () => {
      if (isLoading || !isAuthenticated) return;
      setPopupLoading(true);
      chrome.runtime.sendMessage({ action: "getCarts" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }

        if (response.status === "success") {
          console.log(response.data);
          setCarts(response.data.carts || []);
          // if (organizationSectionRef.current) {
          //     organizationSectionRef.current.scrollTo({
          //         top: organizationSectionRef.current.scrollHeight,
          //         behavior: 'smooth'
          //     });
          // }
        } else {
          console.error(response.message);
          // showNotification("Error Loading Data", false);
        }
        setPopupLoading(false);
      });
    };
    
    handleGetCarts();
  }, [isLoading, isAuthenticated]);

  

  // useEffect(() => {
  //   fetchOrganizationSections();
  // }, [userData]);

  return (
      // <LockedProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 justify-center pt-14 pb-14 px-4">
          {accountPageVisible && <AccountPage
            setAccountPageVisible={setAccountPageVisible}
          />}
          {!accountPageVisible && <HomePage 
            popupLoading={popupLoading}
            setPopupLoading={setPopupLoading}
          />}
          {addCartVisible && <AddCart 
            addCartVisible={addCartVisible}
            setAddCartVisibile={setAddCartVisible}
            addCartButtonRef={addCartButtonRef}
          />}
        </div>
        
        {/* <section id="organization-section" 
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
        </section> */}
        <Footer
          accountPageVisible={accountPageVisible}
          setAccountPageVisible={setAccountPageVisible}
          addCartVisible={addCartVisible}
          setAddCartVisible={setAddCartVisible}
          addCartButtonRef={addCartButtonRef}
          // organizationSections={organizationSections}
          // setOrganizationSections={setOrganizationSections}
          // cartsArray={organizationSections}
          // handleAddItem={handleAddItem}
          // showNotification={showNotification}
          // addFileState={addFileState}
          // setAddFileState={setAddFileState}
          // organizationSectionRef={organizationSectionRef}
        />
        </div>
      // </LockedProvider>
  );
};

export default Popup;
