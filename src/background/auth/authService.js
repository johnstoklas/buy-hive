const apiUrl = "https://buyhive-backend-production.up.railway.app";
const EXPIRY_BUFFER_MS = 60_000;

export async function handleGetUserData(message, sender, sendResponse) {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in" });
        return;
    }

    const endpoint = `${apiUrl}/auth/me`;
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        sendResponse({ status: "success", data }); 
    } catch (error) {
        console.error("Error fetching data:", error);
        sendResponse({ status: "error", message: error.message });
    }
};

function isExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.exp) return true;

        return payload.exp * 1000 < Date.now() + EXPIRY_BUFFER_MS;
    } catch {
        return true;
    }
}

async function refreshAccessToken() {
    const { refresh_token } = await chrome.storage.local.get("refresh_token");
    if (!refresh_token) return null;

    try {
        const res = await fetch(`${apiUrl}/auth/refresh`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${refresh_token}`,
            },
        });

        if (!res.ok) return null;

        const { access_token, refresh_token: newRefreshToken } = await res.json();
        if (!access_token || !newRefreshToken) return null;
        
        await Promise.all([
            chrome.storage.session.set({ access_token }),
            chrome.storage.local.set({ refresh_token: newRefreshToken }),
        ]);
        return access_token;
    } catch {
        return null;
    }
}

export async function getValidAccessToken() {
    const { access_token } = await chrome.storage.session.get("access_token");

    if (access_token && !isExpired(access_token)) {
        return access_token;
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
        throw new Error("AUTH_REQUIRED");
    }

    return refreshed;
}


export async function handleStoreUserData(message, sender, sendResponse) {
    await chrome.storage.session.set({
        access_token: message.access_token,
    });

    await chrome.storage.local.set({
        refresh_token: message.refresh_token,
        user: {
            name: message.user.name,
            email: message.user.email,
            picture: message.user.picture,
        },
    });
}

export async function handleGetAuthState(message, sender, sendResponse) {
    try {
        await getValidAccessToken();

        const { user } = await chrome.storage.local.get("user");

        if (!user) {
            throw new Error("User data does not exist");
        }

        sendResponse({ status: "success", data: { authorized: true, user }}); 
    } catch {
        await chrome.storage.session.clear();
        await chrome.storage.local.remove(["refresh_token", "user"]);

        sendResponse({ status: "success", data: { authorized: false } }); 
    }
}

export async function handleLogout(message, sender, sendResponse) {
    await chrome.storage.session.clear();
    await chrome.storage.local.remove(["refresh_token", "user"]);

    sendResponse({ status: "success" }); 
}

