import React, { useState, useEffect } from 'react';
import { CSSTransition  } from 'react-transition-group';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'
import AddItem from './AddItem.jsx';
import AddFile from './AddFile.jsx';
import SignInPage from './SignInPage.jsx';
import { useLocked } from './LockedProvider.jsx'

function Footer({ 
    handleAddSection, 
    setFileName, 
    fileName, 
    organizationSections, 
    setUserName, 
    cartsArray,
    handleAddItem,
    userName
 }) {
    const [addItemState, setAddItemState] = useState(false);
    const [addFileState, setAddFileState] = useState(false);
    const [signInState, setSignInState] = useState(false);
    const [outerHtml, setOuterHtml] = useState('');

    const [scrapedData, setScrapedData] = useState(null);
    const [scrapedImage, setScrapedImage] = useState(null);
    const [currentUrl, setCurrentUrl] = useState(null);
    const [allImages, setAllImages] = useState(null);
    const [error, setError] = useState(null);

    const { isLocked, setIsLocked } = useLocked();

    const {user, isAuthenticated, isLoading} = useAuth0();

    useEffect(() => {
        setIsLocked(!isAuthenticated);
    }, [isAuthenticated]);

    // Sends user information to background.js for database managament
    useEffect(() => {
        if (user) {
            setUserName(user);
            chrome.runtime.sendMessage({ action: "sendUserInfo", data: user }, (response) => {
                console.log('Response from background.js:', response);
            });
        }
    }, [user]);

    
    // Add Item Button
    const handleScrapeClick = () => {
        if(!isLocked) {
            setAddItemState(!addItemState);
            console.log(addItemState)
            setAddFileState(false);
            setSignInState(false);
            if(!addItemState) {
                gatherPriceTitleData();
                gatherImageData();
            }
            // Updates footer visulization
        }
    };

    const gatherPriceTitleData = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: getInnerText
            }, (results) => {
                const data = {
                    innerText: results[0].result,
                }
                console.log(data);
                chrome.runtime.sendMessage({ action: "scrapePage", data:data }, (response) => {
                    if(response?.status === 'success') {
                        console.log("title/price: (status)", response.data.cart_items);
                        setScrapedData(response.data.cart_items);
                    }
                    else if (response?.status === 'error') {
                        setError(response.error);
                    }
                });
            });
          });
          
          function getInnerText() {
            console.log(document.body.innerText)
            return document.body.innerText;
          }       
    }

    const gatherImageData = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
              // Grabs the current URL
              const currentTab = tabs[0];
              const url = currentTab.url
              setCurrentUrl(url);

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
                            if (img.width > 20 && img.height > 20) {  // Adjust threshold as needed
                                imageSourcesLarge.push(img);
                            }
                        });

                        console.log("filtered for size, length of:", imageSourcesLarge.length, " , ", imageSourcesLarge)

                        /*const imageSourcesPos = [];

                        imageSources.forEach(img => {
                            let rect = img.src.getBoundingClientRect();
                            if (rect.width > 200 && rect.height > 200 && rect.top > 100) { // Adjust as needed
                                imageSourcesPos.push(img);
                            }
                        });

                        console.log("filtered for size, length of:", imageSourcesPos.length, " , ", imageSourcesPos)
*/

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
                                setError(response.error);
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
            />
            <AddFile 
                onAddSection={handleAddSection}
                setFileName={setFileName}
                fileName={fileName} 
                isVisible={addFileState}
                setIsVisible={setAddFileState}
            />
            
            {signInState && <SignInPage 
                setUserName={setUserName}
                user={user}
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