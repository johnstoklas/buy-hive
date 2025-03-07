import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'
import AddItem from './AddItem.jsx';
import AddFile from './AddFile.jsx';
import SignInPage from '../profile/SignInPage.jsx';
import { useLocked } from '../contexts/LockedProvider.jsx';
import { userDataContext } from '../contexts/UserProvider.jsx';
import UserNotification from '../UserNotification.jsx';

function Footer({ 
    organizationSections, 
    setOrganizationSections,
    cartsArray,
    handleAddItem,
 }) {
    const [addItemState, setAddItemState] = useState(false); // toggles visiblity for add item
    const [addFileState, setAddFileState] = useState(false); // toggles visiblity for add folder
    const [signInState, setSignInState] = useState(false); // toggles visiblity for profile page

    const [fileName, setFileName] = useState(""); // stores folder name data

    const [scrapedData, setScrapedData] = useState(null); // stores scraped price and title data
    const [scrapedImage, setScrapedImage] = useState(null); // stores scraped image data
    const [error, setError] = useState(null); // error if either scraping mechanism fails

    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notifMessage, setNotifMessage] = useState("");
    const [notifStatus, setNotifStatus] = useState(true);

    const { isLocked, setIsLocked } = useLocked();
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { userData, setUserData } = userDataContext();

    // Sends a notification to user after action
    const showNotification = (message, isSuccess) => {
        setNotifMessage(message);
        setNotifStatus(isSuccess);
        setNotificationVisible(true);
    
        // Optional: Auto-hide after a few seconds
        setTimeout(() => setNotificationVisible(false), 1000);
    };
    
    // Locks screen if user is not logged in
    useEffect(() => {
        setIsLocked(!isAuthenticated);
    }, [isAuthenticated]);

    // Sends user information to background.js for database managament
    useEffect(() => {
        if (user) {
            setUserData(user);
            chrome.runtime.sendMessage({ action: "sendUserInfo", data: user }, (response) => {
                console.log('Response from background.js:', response);
            });
        }
    }, [user]);

    // Gather text that is visible on the page for price and title
    const gatherPriceTitleData = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: getInnerText
            }, (results) => {
                const data = {
                    innerText: results[0].result,
                }
                chrome.runtime.sendMessage({ action: "scrapePage", data:data }, (response) => {
                    if(response?.status === 'success') {
                        console.log("title/price: (status)", response.data.cart_items);
                        setScrapedData(response.data.cart_items);
                    }
                    else if (response?.status === 'error') {
                        console.log(response?.message);
                    }
                });
            });
          });
          
          function getInnerText() {
            return document.body.innerText;
          }       
    }

    // Gathers all images from the page
    const gatherImageData = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              const currentTab = tabs[0];
              const url = currentTab.url

              const tabId = tabs[0].id;

              chrome.scripting.executeScript(
                {
                    target: { tabId: tabId },
                    func: () => {
                        return Array.from(document.querySelectorAll("img")).map(img => ({
                            src: img.src,
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        }));
                    },
                },
                (results) => {
                    if (results && results[0]?.result) {
                        const imageSources = results[0].result;
                        console.log("Images found, length of: ", imageSources.length, " , ", imageSources);

                        const imageSourcesLarge = [];

                        imageSources.forEach(img => {
                            console.log(img.width);
                            if (img.width > 20 && img.height > 20) { 
                                imageSourcesLarge.push(img);
                            }
                        });

                        console.log("filtered for size, length of:", imageSourcesLarge.length, " , ", imageSourcesLarge)

                        let imagePlainText = "";
                        imageSources.map((img) => {
                            imagePlainText += img.src;
                            imagePlainText += ", ";
                        });

                        console.log(imagePlainText)
                        const data = {
                            imageData: imagePlainText,
                            url: url,
                        }
                        chrome.runtime.sendMessage({action: "sendImageData", data:data }, (response) => {
                            if(response?.status === 'success') {
                                console.log("image data: ", response.data);
                                setScrapedImage(response.data);
                            }
                            else if (response?.status === 'error') {
                                console.log(response?.message);
                            }
                        })
                    } else {
                        console.error("Failed to get images or no images found.");
                    }
                }
            );
            } else {
              console.error("No active tab found.");
            }
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
  
        const data = { email: userData.email, cartName: trimmedFileName };
  
        chrome.runtime.sendMessage({ action: "addNewFolder", data }, (response) => {
          if (response?.status === "success" && response?.data) {
            setOrganizationSections((prev) => [...prev, response.data]);
            setFileName("");
            showNotification("Succesfully Added Folder!", true);
          } else {
            console.log(response?.message);
            showNotification("Error Adding Folder", false);
          }
        });
    };

    // Add Item Button
    const handleScrapeClick = () => {
        if(!isLocked) {
            setAddItemState(!addItemState);
            setAddFileState(false);
            setSignInState(false);
            if(!addItemState) {
                gatherPriceTitleData();
                gatherImageData();
            }
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
            {notificationVisible && <UserNotification 
                notificationVisible={notificationVisible}
                notifStatus={notifStatus}
                notifMessage={notifMessage}
            />}
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
                user={user}
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