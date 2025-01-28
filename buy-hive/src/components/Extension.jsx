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

  // Fetch user data from localStorage on initial load
  // I don't know if this function does anything
  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserName(JSON.parse(storedUser));
    }
  }, []);

  // Fetch organization sections when user data is available
  useEffect(() => {
    if (userName?.email) {
      setIsLoading(true); 
      chrome.runtime.sendMessage({ action: "fetchData", data: { email: userName.email } }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error communicating with background script:",
              chrome.runtime.lastError.message
            );
            setIsLoading(false);
            return;
          }

          if (response?.status === "success") {
            console.log("Data fetched successfully:", response.data);
            const cartsArray = response.data.carts;
            console.log("array? ", cartsArray)
            setOrganizationSections(cartsArray || []);
          } else {
            console.error("Error fetching data:", response?.message);
          }
          setIsLoading(false); 
        }
      );
    }
  }, [userName]);

  // Adds a new folder to the database and updates the UI immediately
  const handleAddSection = (fileName) => {
    if (!userName) {
      console.error("User is not logged in.");
      return;
    }

    const data = {
      email: userName.email,
      cartName: fileName,
    };

    if (fileName.trim()) {
      chrome.runtime.sendMessage({ action: "addNewFolder", data }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }

        if (response?.status === "success") {
          console.log("Folder added successfully:", response.data);

          // Add new folder to state directly
          // I need to make sure that you can't add duplicates and that the date is not new but the original date from the database
          setOrganizationSections((prev) => [
            ...prev,
            { cart_name: fileName, item_count: 0, items: [], created_at: new Date().toISOString() },
          ]);
        } else {
          console.error("Error adding folder:", response?.error);
        }
      });
    }
  };

  // Edits an existing folder and crashes for now
  const handleEditSection = (newFileName, cartId) => {
    if (!userName) {
      console.error("User is not logged in.");
      return;
    }

    const data = {
      email: userName.email,
      newCartName: newFileName,
      cartId: cartId,
    };

    if (newFileName.trim()) {
      chrome.runtime.sendMessage({ action: "editFolder", data }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError.message);
          return;
        }

        if (response?.status === "success") {
          console.log("Folder updated successfully:", response.data);

          // Add new folder to state directly
          // I need to make sure that you can't add duplicates and that the date is not new but the original date from the database
          setOrganizationSections((prev) => [
            ...prev,
            { cart_name: fileName }, 
          ]);
        } else {
          console.error("Error updating folder:", response?.error);
        }
      });
    }
  };

  // Edits an existing folder and crashes for now
  const handleDeleteSection = (cartId) => {
    if (!userName) {
      console.error("User is not logged in.");
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
        console.log("Folder deleted successfully:", response.data);

        // Add new folder to state directly
        // I need to make sure that you can't add duplicates and that the date is not new but the original date from the database
        setOrganizationSections((prev) => [
          ...prev,
          { cart_name: fileName }, 
        ]);
      } else {
        console.error("Error deleting folder:", response?.error);
      }
    });
  };

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
      />
    </>
  );
};

export default Extension;
