import React, { useState, useEffect } from "react";
import "../css/main.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import OrganizationSection from "./OrganizationSection.jsx";

const Extension = () => {
  const [isLocked, setIsLocked] = useState(false); // Locks the bottom buttons
  const [organizationSections, setOrganizationSections] = useState([]); // Store fetched sections
  const [fileName, setFileName] = useState(""); // Input for new folder
  const [userName, setUserName] = useState(null); // Store user info
  const [isLoading, setIsLoading] = useState(true); // Show loading state until data is fetched

  useEffect(() => {
    console.log("isLocked: ", isLocked);
  }, [isLocked]);

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

  // Adds a new folder to the database and updates the UI immediately
  const handleAddSection = (fileName) => {
    if (!userName) {
      console.error("User is not logged in.");
      return;
    }

    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) return;

    const isDuplicate = organizationSections.some((section) => section.cart_name === trimmedFileName);
    if (isDuplicate) {
      console.error("A folder with this name already exists.");
      return;
    }

    const data = {
      email: userName.email,
      cartName: trimmedFileName,
    };

    chrome.runtime.sendMessage({ action: "addNewFolder", data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with background script:", chrome.runtime.lastError.message);
        return;
      }

      if (response?.status === "success" && response?.data) {
        // Ensure we use the backend response, which contains the correct cart_id
        console.log("added file: ", response.data);
        setOrganizationSections((prev) => [...prev, response.data]); 
      } else {
        console.error("Error adding folder:", response?.error);
      }
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

  return (
    <>
      <Header />
      <section id="organization-section">
        {isLoading ? (
          <div className="spinner-loader main-page-sl"></div>
        ) : organizationSections.length > 0 ? (
          organizationSections.map((section) => (
            <OrganizationSection
              sectionId={section.cart_id}
              title={section.cart_name}
              itemCount={section.item_count}
              items={section.items}
              createdAt={section.created_at}
              setIsLocked={setIsLocked}
              handleEditSection={handleEditSection}
              handleDeleteSection={handleDeleteSection}
              handleEditNotes={handleEditNotes}
              handleDeleteItem={handleDeleteItem}
              cartsArray={organizationSections}
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
        cartsArray={organizationSections}
        handleAddItem={handleAddItem}
      />
    </>
  );
};

export default Extension;
