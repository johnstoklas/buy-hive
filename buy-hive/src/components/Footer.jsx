import React, { useState, useEffect } from 'react';
import '../css/base/footer.css';
import AddItem from './AddItem.jsx';
import AddFile from './AddFile.jsx';
import SignInPage from './SignInPage.jsx';

function Footer({ handleAddSection, setFileName, fileName, organizationSections }) {
    const [addItemState, setAddItemState] = useState(false);
    const [addFileState, setAddFileState] = useState(false);
    const [signInState, setSignInState] = useState(false);
    const [outerHtml, setOuterHtml] = useState(''); // Store the text content here

    useEffect(() => {
        const messageListener = (message) => {
            if (message.action === 'scrapeComplete') {
                setOuterHtml(message.textContent);  // Update the state with scraped content
            }
        };
    
        chrome.runtime.onMessage.addListener(messageListener);
    
        // Cleanup listener when the component is unmounted
        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);
    

    const handleScrapeClick = () => {
        // Send a message to the background script to scrape the page
        chrome.runtime.sendMessage({ action: "scrapePage" });
        setAddItemState(!addItemState);  // Toggle the state for rendering AddItem component
    };

    const handleFileClick = () => {
        setAddFileState((prevState) => {
            // Force a reflow before toggling the state
            setTimeout(() => {
                const addFileSection = document.getElementById('add-file-section');
                addFileSection.offsetHeight; // Trigger reflow
            }, 0);

            return !prevState;
        });
    };

    const signInClick = () => {
        setSignInState(!signInState);
    };

    return (
        <>
            {addItemState && <AddItem  
                isVisible={addItemState}
                organizationSections={organizationSections}
            />}
            {addFileState && <AddFile 
                onAddSection={handleAddSection}
                setFileName={setFileName}
                fileName={fileName} 
                isVisible={addFileState}
            />}
            {signInState && <SignInPage />}
            
            <footer className="extension-footer">
                <button id="scrape" onClick={handleScrapeClick}> 🛒 </button>
                <button id="section" onClick={handleFileClick}> 📁 </button>
                <button id="profile" onClick={signInClick}> 👤 </button>
            </footer>

            {/* Display the scraped content */}
            {outerHtml && <div>{outerHtml}</div>}
        </>
    );
}

export default Footer;
