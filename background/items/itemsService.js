const apiUrl = "https://buyhive-backend-production.up.railway.app"

export async function handleFetchData(message, sender, sendResponse) {
    const { accessToken } = message.data;
    if (!accessToken) {
        sendResponse({ status: "error", message: "User must be signed in"});
        return;
    }

    const endpoint = `${apiUrl}/carts`;
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        sendResponse({ status: "success", data }); 
    } catch (error) {
        console.error("Error fetching data:", error);
        sendResponse({ status: "error", message: error.message });
    }
};