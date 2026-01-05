import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'
import AddItem from './AddItem.jsx';
import AddFile from './AddFile.jsx';
import SignInPage from '../profile/SignInPage.jsx';
import { useLocked } from '../contexts/LockedProvider.jsx';
import { userDataContext } from '../contexts/UserProvider.jsx';

function Footer({ 
    organizationSections, 
    setOrganizationSections,
    cartsArray,
    handleAddItem,
    showNotification,
    addFileState,
    setAddFileState,
    organizationSectionRef
 }) {
    const [addItemState, setAddItemState] = useState(false); // toggles visiblity for add item
    const [signInState, setSignInState] = useState(false); // toggles visiblity for profile page

    const [fileName, setFileName] = useState(""); // stores folder name data

    const [scrapedData, setScrapedData] = useState(null); // stores scraped price and title data
    const [scrapedImage, setScrapedImage] = useState(null); // stores scraped image data
    const [currentUrl, setCurrentUrl] = useState(null);
    const [tabId, setTabId] = useState(null)
    const [error, setError] = useState(null); // error if either scraping mechanism fails

    const { isLocked, setIsLocked } = useLocked();
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { userData, setUserData } = userDataContext();
    
    // Locks screen if user is not logged in
    useEffect(() => {
        setIsLocked(!isAuthenticated);
    }, [isAuthenticated]);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              const currentTab = tabs[0];
              const url = currentTab.url
              const tab = tabs[0].id;

              setCurrentUrl(url);
              setTabId(tab);
            } else {
            console.error("No active tab found.");
          }
        });
    }, []);

    // Gather text that is visible on the page for price and title
    const gatherPriceTitleData = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0]?.id;
            if (!tabId) return;
        
            const url = tabs[0]?.url || '';
            if (url.startsWith('chrome://') || 
                url.startsWith('chrome-extension://') || 
                url.startsWith('edge://') || 
                url.startsWith('about:') ||
                url.startsWith('moz-extension://')) {
                return;
            }
        
            const sendMessage = () => {
                chrome.tabs.sendMessage(tabId, { action: "extractProduct" }, (response) => {
                    if (chrome.runtime.lastError) {
                        // Content script not ready - inject it automatically
                        console.log("Content script not ready, injecting...");
                        
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            files: ['dist/content/index.bundle.js']
                        }, (injectionResult) => {
                            if (chrome.runtime.lastError) {
                                console.error("Failed to inject content script:", chrome.runtime.lastError.message);
                                return;
                            }
                            
                            // Wait a bit for the script to initialize, then retry
                            setTimeout(() => {
                                chrome.tabs.sendMessage(tabId, { action: "extractProduct" }, (response) => {
                                    if (chrome.runtime.lastError) {
                                        console.error("Error after injection:", chrome.runtime.lastError.message);
                                        return;
                                    }
                                    
                                    if (response?.success) {
                                        const res = response.data;
                                        console.log("=== EXTRACTION DEBUG ===");
                                        console.log("Full response:", res);
                                        console.log("Image URL:", res.image);
                                        console.log("Image URL type:", typeof res.image);
                                        console.log("Image URL length:", res.image?.length);
                                        console.log("========================");
                                        
                                        const scraped_data = {
                                            product_name: res.name,
                                            price: res.price,
                                        }
                                        setScrapedData(scraped_data);
                                        setScrapedImage(res.image);
                                        
                                        console.log("scrapedImage state set to:", res.image);
                                    } else {
                                        console.error("Extraction failed:", response?.error);
                                    }
                                });
                            }, 200); // Wait 200ms for script to initialize
                        });
                        return;
                    }
                    
                    // Normal flow - content script is ready
                    if (response?.success) {
                        const res = response.data;
                        console.log("=== EXTRACTION DEBUG ===");
                        console.log("Full response:", res);
                        console.log("Image URL:", res.image);
                        console.log("Image URL type:", typeof res.image);
                        console.log("Image URL length:", res.image?.length);
                        console.log("========================");
                        
                        const scraped_data = {
                            product_name: res.name,
                            price: res.price,
                        }
                        setScrapedData(scraped_data);
                        setScrapedImage(res.image);
                        
                        console.log("scrapedImage state set to:", res.image);
                    } else {
                        console.error("Extraction failed:", response?.error);
                    }
                });
            };
        
            sendMessage();
        });
    }

    // Handles adding a new folder
    const handleAddSection = (fileName) => {  
        if(!userData) {
            showNotification("Error Adding Folder", false);
            return;
        } 
        const trimmedFileName = fileName.trim();
        const isDuplicate = organizationSections.some((section) => section.cart_name === trimmedFileName);
        
        if (isDuplicate || !trimmedFileName) {
            showNotification("Invalid Folder Name!", false);
            return;
        }
  
        const data = { accessToken: userData, cartName: trimmedFileName };
        console.log("sending message to background", data);
  
        chrome.runtime.sendMessage({ action: "addNewCart", data }, (response) => {
          if (response?.status === "success" && response?.data) {
            setOrganizationSections((prev) => [...prev, response.data]);
            setFileName("");
            showNotification("Succesfully Added Cart", true);

            if (organizationSectionRef.current) {
                organizationSectionRef.current.scrollTo({
                    top: organizationSectionRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
          } else {
            console.error(response?.message);
            showNotification("Error Adding Folder", false);
          }
        });
    };

    // Add Item Button
    const handleScrapeClick = () => {  
        // var alreadyIn = false;
        // console.log("org secs", organizationSections);
        // if (organizationSections.length !== 0) {
        //     const allUrls = organizationSections.flatMap(section => 
        //         section.items.map(item => item.url)
        //     );
        //     alreadyIn = allUrls.includes(currentUrl);   
        // }

        if(!isLocked && !error) {
            setAddItemState(!addItemState);
            setAddFileState(false);
            setSignInState(false);
            if(!addItemState) {
                gatherPriceTitleData();
            }
        }
        // else if(!isLocked && error && !alreadyIn) {
        //     showNotification("Invalid website", false);
        // }
        else if(!isLocked && !error && alreadyIn) {
            showNotification("Item has already been added", false);
        }
    };

    // Add File Button
    const handleFileClick = () => {
        if(!isLocked) {
            // Updates footer visulization
            setAddFileState(!addFileState);
            setAddItemState(false);
            setSignInState(false);
        }
    };

    // Profile Button
    const signInClick = () => {
        if(!isLocked) {
            // Updates footer visulization
            setSignInState(!signInState);
            setAddFileState(false);
            setAddItemState(false);
        }
    };

    return (
        <>
            <AddItem  
                isVisible={addItemState}
                organizationSections={organizationSections}
                scrapedData={scrapedData}
                errorData={error}
                scrapedImage={scrapedImage}
                setIsVisible={setAddItemState}
                cartsArray={cartsArray}
                handleAddItem={handleAddItem}
                handleAddSection={handleAddSection}
                showNotification={showNotification}
            />
            <AddFile 
                setFileName={setFileName}
                fileName={fileName} 
                isVisible={addFileState}
                setIsVisible={setAddFileState}
                organizationSections={organizationSections}
                setOrganizationSections={setOrganizationSections}
                handleAddSection={handleAddSection}
            />
            
            {signInState && <SignInPage 
                setIsVisible={setSignInState}
            />}
            
            <footer className="extension-footer">
                <button id="scrape" 
                        className={`${addItemState ? "extension-footer-active-button" : ""} 
                                    ${isLocked ? "extension-footer-button-disabled" : ""}`} 
                        onClick={handleScrapeClick}> 
                    <FontAwesomeIcon icon={faCartShopping} />    
                </button>
                <button id="section" 
                        className={`${addFileState ? "extension-footer-active-button" : ""} 
                                    ${isLocked ? "extension-footer-button-disabled" : ""}`} 
                        onClick={handleFileClick}> 
                    <FontAwesomeIcon icon={faFolder} />
                </button>
                <button id="profile" 
                        className={`${(signInState || (!isAuthenticated && !isLoading)) ? "extension-footer-active-button" : ""}
                                    ${isLocked ? "extension-footer-button-disabled" : ""}`} 
                        onClick={signInClick}> 
                    <FontAwesomeIcon icon={faUser} />
                </button>
            </footer>
        </>
    );
}

export default Footer;