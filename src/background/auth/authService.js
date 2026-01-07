export function getAccessToken() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "requestAccessToken" }, (response) => {
            if (response?.status === "success") {
                resolve(response.data);
            } else {
                resolve(null);
            }
        }
        );
    });
}
