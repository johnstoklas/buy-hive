import React from "react";
import { UserProvider } from "./contexts/UserProvider.jsx";
import Extension from "./Extension.jsx";
import { LockedProvider } from "./contexts/LockedProvider.jsx";

const Popup = () => {
    return (
        <LockedProvider>
            <UserProvider>
                <Extension />
            </UserProvider>
        </LockedProvider>
    )
}

export default Popup;
