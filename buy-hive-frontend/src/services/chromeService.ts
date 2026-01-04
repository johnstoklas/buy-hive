export function sendChromeMessage<TResponse = any>(message: { action: string; data?: any }) {
    return new Promise<TResponse>((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
                return;
            }

            if (response.status === "success") {
                resolve(response.data as TResponse);
            } else {
                reject(new Error(response?.message));
            }
        });
    })
};