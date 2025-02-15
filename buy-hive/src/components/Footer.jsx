import React, { useState, useEffect } from 'react';
import { CSSTransition  } from 'react-transition-group';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'
import AddItem from './AddItem.jsx';
import AddFile from './AddFile.jsx';
import SignInPage from './SignInPage.jsx';

function Footer({ handleAddSection, setFileName, fileName, organizationSections, setUserName, isLocked, cartsArray }) {
    const [addItemState, setAddItemState] = useState(false);
    const [addFileState, setAddFileState] = useState(false);
    const [signInState, setSignInState] = useState(false);
    const [outerHtml, setOuterHtml] = useState('');

    const [scrapedData, setScrapedData] = useState(null);
    const [scrapedImage, setScrapedImage] = useState(null);
    const [currentUrl, setCurrentUrl] = useState(null);
    const [allImages, setAllImages] = useState(null);
    const [error, setError] = useState(null);

    const {user, isAuthenticated} = useAuth0();

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
            gatherImageData();
            gatherPriceTitleData();
                   
            // Updates footer visulization
            setAddItemState(!addItemState);
            setAddFileState(false);
            setSignInState(false);
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
                    console.log("did we get here?");
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

              console.log("Current URL:", url);

              const tabId = tabs[0].id;

              chrome.scripting.executeScript(
                {
                    target: { tabId: tabId },
                    func: () => {
                        return Array.from(document.querySelectorAll("img")).map(img => img.src);
                    },
                },
                (results) => {
                    if (results && results[0]?.result) {
                        const imageSources = results[0].result;
                        console.log("Images found:", imageSources);
                        let imagePlainText = "";
                        imageSources.map((element) => {
                            imagePlainText += element;
                            imagePlainText += ", ";
                        });
                        console.log(imagePlainText);
                        const data = {
                            imageData: imagePlainText,
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

    // I don't think this needs to be here
    /*
    // Handles response from background.js on scrape
    useEffect(() => {
        const messageListener = (message) => {
            if (message.action === 'scrapeComplete') {
                console.log()
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);
    
        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);
    */

    // Add File Button
    const handleFileClick = () => {
        console.log(isLocked)
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
            <CSSTransition
                in={addItemState}
                timeout={300}
                classNames={{
                    enter: 'slide-in',
                    enterActive: 'slide-in-active',
                    exit: 'slide-out',
                    exitActive: 'slide-out-active',
                }}
                unmountOnExit
            >
                <AddItem  
                    isVisible={addItemState}
                    organizationSections={organizationSections}
                    scrapedData={scrapedData}
                    errorData={error}
                    scrapedImage={scrapedImage}
                    setIsVisible={setAddItemState}
                    cartsArray={cartsArray}
                />
            </CSSTransition>
            <CSSTransition
                in={addFileState}
                timeout={300}
                classNames={{
                    enter: 'slide-in',
                    enterActive: 'slide-in-active',
                    exit: 'slide-out',
                    exitActive: 'slide-out-active',
                }}
                unmountOnExit
            >
                <AddFile 
                    onAddSection={handleAddSection}
                    setFileName={setFileName}
                    fileName={fileName} 
                    isVisible={addFileState}
                    setIsVisible={setAddFileState}
                />
            </CSSTransition>
            
            {signInState && <SignInPage 
                setUserName={setUserName}
                user={user}
            />}
            
            <footer className="extension-footer">
                <button id="scrape" onClick={handleScrapeClick}> 
                    <FontAwesomeIcon icon={faCartShopping} />    
                </button>
                <button id="section" onClick={handleFileClick}> 
                    <FontAwesomeIcon icon={faFolder} />
                </button>
                <button id="profile" onClick={signInClick}> 
                    <FontAwesomeIcon icon={faUser} />
                </button>
            </footer>
        </>
    );
}

export default Footer;
