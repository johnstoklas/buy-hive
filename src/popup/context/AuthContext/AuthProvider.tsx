import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { UserType } from "@/types/UserType";
import { sendChromeMessage } from "@/services/chromeService";

export type AuthStateResponse =
    | { authorized: true; user: UserType }
    | { authorized: false };


export function AuthProvider({ children } : { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const bootstrapAuth = async() => {
            setIsLoading(true);
            const res = await sendChromeMessage<AuthStateResponse>({action: "getAuthState"});

            if(!res.authorized) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }
            
            setUserData(res.user);
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        bootstrapAuth();
    }, []);

    const logout = async() => {
        setIsLoading(true);

        await sendChromeMessage({action: "logout"});
        
        chrome.tabs.create({
            url: `${import.meta.env.VITE_WEBSITE}/logout?source=extension`
        });
        setIsLoading(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, userData, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

