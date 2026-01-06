import { useState } from "react";
import { AlertContext } from "./AlertContext";

export function AlertProvider({ children } : { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState<"success" | "error">("success");
    const [message, setMessage] = useState("");
    
    const notify = (type: "success" | "error", message: string) => {
        setType(type);
        setMessage(message);
        setVisible(true);

        window.setTimeout(() => {
            setVisible(false);
        }, 3000);
    };

    return (
        <AlertContext.Provider value={{ alertVisible: visible, alertType: type, alertMessage: message, notify }}>
            {children}
        </AlertContext.Provider>
    );
}

