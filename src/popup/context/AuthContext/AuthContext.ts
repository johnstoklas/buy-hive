import type { UserType } from "@/types/UserType";
import { createContext } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    userData: UserType | null;
    token: string | null
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);