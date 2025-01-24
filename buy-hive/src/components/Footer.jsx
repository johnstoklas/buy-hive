import React, { useState, useEffect } from 'react';
import { CSSTransition  } from 'react-transition-group';
import '../css/base/footer.css';
import AddItem from './AddItem.jsx';
import AddFile from './AddFile.jsx';
import SignInPage from './SignInPage.jsx';

function Footer({ handleAddSection, setFileName, fileName, organizationSections }) {
    const [addItemState, setAddItemState] = useState(false);
    const [addFileState, setAddFileState] = useState(false);
    const [signInState, setSignInState] = useState(false);
    const [outerHtml, setOuterHtml] = useState('');

    const [scrapedData, setScrapedData] = useState(null);
    const [currentUrl, setCurrentUrl] = useState(null);
    const [allImages, setAllImages] = useState(null);
    const [error, setError] = useState(null);
    
    // Add Item Button
    const handleScrapeClick = () => {
        gatherData();
        
        chrome.runtime.sendMessage({ action: "scrapePage" }, (response) => {
            if(response?.action === 'scrapeComplete') {
                setScrapedData(response.result);
            }
            else if (response?.action === 'scrapeFailed') {
                setError(response.error);
            }
        });

        // Updates footer visulization
        setAddItemState(!addItemState);
        setAddFileState(false);
        setSignInState(false);
    };

    const gatherData = () => {
        
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
                        setAllImages(imageSources);
                        console.log("Images found:", imageSources);
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
        // Updates footer visulization
        setAddFileState(!addFileState);
        setAddItemState(false);
        setSignInState(false);
    };

    // Profile Button
    const signInClick = () => {
        // Updates footer visulization
        setSignInState(!signInState);
        setAddFileState(false);
        setAddItemState(false);
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
                />
            </CSSTransition>
            
            {signInState && <SignInPage />}
            
            <footer className="extension-footer">
                <button id="scrape" onClick={handleScrapeClick}> 🛒 </button>
                <button id="section" onClick={handleFileClick}> 📁 </button>
                <button id="profile" onClick={signInClick}> 👤 </button>
            </footer>
        </>
    );
}

export default Footer;
