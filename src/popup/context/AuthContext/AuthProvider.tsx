import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { UserType } from "@/types/UserType";

export function AuthProvider({ children } : { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // const resolveUser = async () => {
    //     const { user } = await chrome.storage.session.get("user");
    //     if (user) return user;

    //     const fetchedUser = await sendChromeMessage({ action: "getUserData" });
    //     if (fetchedUser) {
    //         await chrome.storage.session.set({ user: fetchedUser });
    //     }

    //     return fetchedUser ?? null;
    // };

    useEffect(() => {
        const bootstrapAuth = async() => {
            setIsLoading(true);
            const { access_token } = await chrome.storage.local.get<{ access_token?: string }>("access_token");
            const { user } = await chrome.storage.local.get<{ user?: UserType }>("user");
            if (!access_token || !user) {
                setIsAuthenticated(false);
                return;
            }
            
            setUserData(user);
            setToken(access_token);
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        bootstrapAuth();
    }, []);

    const logout = () => {
        setIsLoading(true);
        chrome.storage.local.remove('access_token');
        chrome.storage.local.remove('user');
        chrome.tabs.create({
            url: "https://www.buyhive.dev/logout?source=extension"
        });
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, userData, token, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

