import {
    handleGetUserData,
    handleStoreUserData,
    handleGetAuthState,
    handleLogout,
} from "./authService.js";

export const authRouter = {
    getUserData: handleGetUserData,
    storeUserData: handleStoreUserData,
    getAuthState: handleGetAuthState,
    logout: handleLogout,
};
