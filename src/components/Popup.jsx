import React from "react";
import { UserProvider } from "./contexts/UserProvider.jsx";
import Extension from "./Extension.jsx";

const Popup = () => {
    return (
        <UserProvider>
            <Extension />
        </UserProvider>
    )
}

export default Popup;
