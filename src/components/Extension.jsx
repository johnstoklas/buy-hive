import React, { useState, useEffect } from "react";
import "../css/main.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import OrganizationSection from "./OrganizationSection.jsx";
import { LockedProvider } from "./LockedProvider.jsx";
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import SignInPage from "./SignInPage.jsx";


const Extension = () => {
  const [organizationSections, setOrganizationSections] = useState([]); // Store fetched sections
  const [fileName, setFileName] = useState(""); // Input for new folder
  const [userName, setUserName] = useState(null); // Store user info
  const [isLoading, setIsLoading] = useState(true); // Show loading state until data is fetched

  // Fetch user data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserName(JSON.parse(storedUser));
    }
  }, []);

  // Fetch organization sections when user data is available
  const fetchOrganizationSections = () => {
    if (userName?.email) {
      setIsLoading(true);
      chrome.runtime.sendMessage(
        { action: "fetchData", data: { email: userName.email } },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error communicating with background script:", chrome.runtime.lastError.message);
            setIsLoading(false);
            return;
          }

          if (response?.status === "success") {
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
  }, [userName]);

  const handleAddSection = (fileName) => {
    return new Promise((resolve, reject) => {
      if (!userName) {
        reject("User is not logged in.");
        return;
      }
  
      const trimmedFileName = fileName.trim();
      if (!trimmedFileName) {
        reject("File name cannot be empty.");
        return;
      }
  
      const isDuplicate = organizationSections.some((section) => section.cart_name === trimmedFileName);
      if (isDuplicate) {
        reject("A folder with this name already exists.");
        return;
      }
  
      const data = {
        email: userName.email,
        cartName: trimmedFileName,
      };
  
      chrome.runtime.sendMessage({ action: "addNewFolder", data }, (response) => {
        if (chrome.runtime.lastError) {
          const errorMsg = `Error communicating with background script: ${chrome.runtime.lastError.message}`;
          console.error(errorMsg);
          reject(errorMsg);
          return;
        }
  
        if (response?.status === "success" && response?.data) {
          console.log("Added file:", response.data);
          setOrganizationSections((prev) => [...prev, response.data]); 
          resolve(response.data); 
        } else {
          console.error("Error adding folder:", response?.error);
          reject(response?.error || "Unknown error occurred.");
        }
      });
    });
  };


  // Edits an existing folder
  const handleEditSection = (newFileName, cartId) => {
    return new Promise((resolve, reject) => {
      if (!userName) {
        console.error("User is not logged in.");
        reject("User is not logged in.");
        return;
      }
  
      if (!cartId) {
        console.error("Invalid cart ID.");
        reject("Invalid cart ID.");
        return;
      }
  
      if (!newFileName.trim()) {
        console.error("New folder name is empty.");
        reject("New folder name is empty.");
        return;
      }
  
      const isDuplicate = organizationSections.some(
        (section) => section.cart_name === newFileName.trim() && section.cart_id !== cartId
      );
  
      if (isDuplicate) {
        console.error("A folder with this name already exists.");
        reject("A folder with this name already exists.");
        return;
      }
  
      const data = {
        email: userName.email,
        newCartName: newFileName.trim(),
        cartId: cartId,
      };
  
      chrome.runtime.sendMessage({ action: "editFolder", data }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          setOrganizationSections((prev) =>
            prev.map((section) =>
              section.cart_id === cartId ? { ...section, cart_name: newFileName.trim() } : section
            )
          );
          resolve();
        } else {
          console.error("Error updating folder:", response?.error);
          reject(response?.error);
        }
      });
    });
  };

  // Deletes a folder
  const handleDeleteSection = (cartId) => {
    if (!userName) {
      console.error("User is not logged in.");
      return;
    }

    console.log("Attempting to delete cart with ID:", cartId); // Debugging step

    if (!cartId) {
      console.error("Invalid cart ID.");
      return;
    }

    const data = {
      email: userName.email,
      cartId: cartId,
    };

    chrome.runtime.sendMessage({ action: "deleteFolder", data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with background script:", chrome.runtime.lastError.message);
        return;
      }

      if (response?.status === "success") {
        // Fetch the latest list after deletion
        fetchOrganizationSections();
      } else {
        console.error("Error deleting folder:", response?.error);
      }
    });
  };

  // Edit item notes
  const handleEditNotes = (notes, cartId, itemId) => {
    return new Promise((resolve, reject) => {
      if(notes.trim()) {
        const data = {
          email: userName.email,
          notes: notes,
          cartId: cartId,
          itemId: itemId,
        };

        console.log(data);

        chrome.runtime.sendMessage({action: "editNotes", data: data}, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error communicating with background script:", chrome.runtime.lastError.message);
            return;
          }
    
          if (response?.status === "success") {
            // Fetch the latest list after deletion
            //fetchOrganizationSections();
            resolve();

          } else {
            console.error("Error editing notes:", response?.error);
          }
        });
      }
    });
  }

  // Delete an item
  const handleDeleteItem = (cartId, itemId) => {
    return new Promise((resolve, reject) => {
      const data = {
        email: userName.email,
        cartId: cartId,
        itemId: itemId,
      };

      console.log(data);

      chrome.runtime.sendMessage({action: "deleteItem", data: data}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          // Fetch the latest list after deletion
          fetchOrganizationSections();
          resolve();

        } else {
          console.error("Error deleting item:", response?.error);
        }
      });
    });
  }

  // Add item to cart
  const handleAddItem = (data) => {
    return new Promise((resolve, reject) => {
      const newData = {
        email: userName.email,
        itemData: data,
      }

      console.log(data);

      chrome.runtime.sendMessage({action: "addItem", data: newData}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          fetchOrganizationSections();
          resolve();
        } else {
          console.error("Error adding item:", response?.error);
        }
      });
    });
  }

  // Moves item to carts
  const handleMoveItem = (itemId, selectedCarts, unselectedCarts) => {
    return new Promise((resolve, reject) => {
      console.log("item id: ", itemId);
      const data = {
        email: userName.email,
        itemId: itemId,
        selectedCarts: selectedCarts,
        unselectedCarts: unselectedCarts,
      }

      console.log(data);

      chrome.runtime.sendMessage({action: "moveItem", data: data}, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }
  
        if (response?.status === "success") {
          //fetchOrganizationSections();
          resolve();
        } else {
          console.error("Error moving item:", response?.error);
        }
      });
    });
  }

  return (
    <LockedProvider>
      <Header />
      <section id="organization-section">
        {userName ? (
          isLoading ? (
            <div className="spinner-loader main-page-sl"></div>
          ) : organizationSections.length > 0 ? (
            organizationSections.map((section) => (
              <OrganizationSection
                sectionId={section.cart_id}
                title={section.cart_name}
                itemCount={section.item_count}
                items={section.items}
                createdAt={section.created_at}
                handleEditSection={handleEditSection}
                handleDeleteSection={handleDeleteSection}
                handleEditNotes={handleEditNotes}
                handleDeleteItem={handleDeleteItem}
                handleMoveItem={handleMoveItem}
                cartsArray={organizationSections}
              />
            ))
          ) : (
            <div className="organization-section-empty">
              <p>Looks like you have nothing here yet.</p>
              <p>Click <FontAwesomeIcon icon={faFolder} /> to get started!</p>
            </div>
          )
        ) : (
        <SignInPage 
          setUserName={setUserName}
          user={userName}
          homePage={true}
        /> )}
        </section>
        <Footer
          fileName={fileName}
          setFileName={setFileName}
          handleAddSection={handleAddSection}
          organizationSections={organizationSections}
          setUserName={setUserName}
          cartsArray={organizationSections}
          handleAddItem={handleAddItem}
          userName={userName}
        />
      </LockedProvider>
  );
};

export default Extension;
