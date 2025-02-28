import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "../css/main.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import OrganizationSection from "./OrganizationSection.jsx";
import { LockedProvider } from "./LockedProvider.jsx";
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SignInPage from "./SignInPage.jsx";

const Extension = () => {
  const [organizationSections, setOrganizationSections] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [fileName, setFileName] = useState("");
  const [userName, setUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const organizationSectionRef = useRef(null);

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

  useLayoutEffect(() => {
    const storedScroll = localStorage.getItem("scrollPosition");

    console.log("Stored scroll position:", storedScroll);
  
    // Apply scroll position only after the content is rendered
    if (storedScroll && organizationSectionRef.current) {
      setTimeout(() => {
        organizationSectionRef.current.scrollTop = parseInt(storedScroll, 10);
        console.log("Scroll position applied:", organizationSectionRef.current.scrollTop);
      }, 50); // 50ms delay to allow DOM painting
    }
  }, [organizationSections]);  // Only trigger after organizationSections change

  useEffect(() => {
    localStorage.setItem('expandedFolders', JSON.stringify(expandedFolders));
  }, [expandedFolders]);

  const fetchOrganizationSections = () => {
    if (userName?.email) {
      setIsLoading(true);
      chrome.runtime.sendMessage(
        { action: "fetchData", data: { email: userName.email } },
        (response) => {
          if (response?.status === "success") {
            setOrganizationSections(response.data.carts || []);

            // Delay scroll restore to ensure DOM is updated
            setTimeout(() => {
              const storedScroll = localStorage.getItem("scrollPosition");
              if (storedScroll && organizationSectionRef.current) {
                organizationSectionRef.current.scrollTop = parseInt(storedScroll, 10);
                console.log("Scroll position applied after fetch:", organizationSectionRef.current.scrollTop);
              }
            }, 50); // 50ms delay
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

  // Track scroll position to persist
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (organizationSectionRef.current) {
        // Clear previous timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Set a timeout to store scroll position after user stops scrolling
        scrollTimeoutRef.current = setTimeout(() => {
          localStorage.setItem("scrollPosition", organizationSectionRef.current.scrollTop);
          console.log("Saved Scroll Position:", organizationSectionRef.current.scrollTop);
        }, 100); // Adjust delay as necessary
      }
    };

    const container = organizationSectionRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }

      // Clean up timeout on component unmount
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);  // Track scroll only once after component mounts

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

      const data = { email: userName.email, cartName: trimmedFileName };

      chrome.runtime.sendMessage({ action: "addNewFolder", data }, (response) => {
        if (response?.status === "success" && response?.data) {
          setOrganizationSections((prev) => [...prev, response.data]);
          resolve(response.data);
        } else {
          reject(response?.error || "Unknown error occurred.");
        }
      });
    });
  };

  const handleDeleteSection = (cartId) => {
    if (!userName) return;

    chrome.runtime.sendMessage({ action: "deleteFolder", data: { email: userName.email, cartId } }, (response) => {
      if (response?.status === "success") {
        fetchOrganizationSections();
      } else {
        console.error("Error deleting folder:", response?.error);
      }
    });
  };

  return (
    <LockedProvider>
      <Header />
      <section id="organization-section" ref={organizationSectionRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
        {userName ? (
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
                handleDeleteSection={handleDeleteSection}
                cartsArray={organizationSections}
                userName={userName}
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
              <p>Click <FontAwesomeIcon icon={faFolder} /> to get started!</p>
            </div>
          )
        ) : (
          <SignInPage setUserName={setUserName} user={userName} homePage={true} />
        )}
      </section>
      <Footer
        fileName={fileName}
        setFileName={setFileName}
        handleAddSection={handleAddSection}
        organizationSections={organizationSections}
        setUserName={setUserName}
        cartsArray={organizationSections}
      />
    </LockedProvider>
  );
};

export default Extension;
