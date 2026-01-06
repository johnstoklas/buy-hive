import { createContext } from "react";

type AlertContextType = {
    alertVisible: boolean;
    alertType: "success" | "error";
    alertMessage: string;
    notify: (
        type: "success" | "error",
        message: string,
    ) => void;
}

export const AlertContext = createContext<AlertContextType | null>(null);