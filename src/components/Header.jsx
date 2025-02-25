import React from 'react';
import '../css/base/header.css'

function Header() {

    // Handles closing the extension
    const handleCloseClick = () => {
        window.close(); // Close the extension window
    };

    return (
        <>
        <header class="extension-header">
            <h1>🐝BuyHive</h1>
                <div>
                {/*
                <button id="profile"> 👤 </button>
                <button id="settings"> ⚙️ </button>
                */}
                <button id="close-button" onClick={handleCloseClick}> &#10005; </button>
            </div>
        </header>
        </>
    );
}

export default Header;
