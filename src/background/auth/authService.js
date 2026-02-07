const apiUrl = "https://buyhive-backend-production.up.railway.app"

export async function handleGetUserData(message, sender, sendResponse) {
    const { access_token } = await chrome.storage.local.get("access_token");

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
