import React, { useState } from 'react';
import '../css/base/footer.css'
import AddItem from './AddItem.jsx';
import AddFile from './AddFile.jsx';
import SignInPage from './SignInPage.jsx';

function Footer({handleAddSection, setFileName, fileName}) {

    const [addItemState, setAddItemState] = useState(false);
    const [addFileState, setAddFileState] = useState(false);
    const [signInState, setSignInState] = useState(false);

    const handleScrapeClick = () => {
        setAddItemState(!addItemState);
    };

    const handleFileClick = () => {
        setAddFileState(!addFileState);
    };

    const signInClick = () => {
        setSignInState(!signInState);
    };

    return (
        <>
        {addItemState && <AddItem />}
        {addFileState && <AddFile 
              onAddSection={handleAddSection}
              setFileName={setFileName}
              fileName={fileName} 
        /> }
        {signInState && <SignInPage />}
        <footer class="extension-footer"> 
            <button id="scrape" onClick={handleScrapeClick}> 🛒 </button>
            <button id="section" onClick={handleFileClick}> 📁 </button>
            <button id="profile" onClick={signInClick}> 👤 </button>
        </footer>
        </>
    );
}

export default Footer;
