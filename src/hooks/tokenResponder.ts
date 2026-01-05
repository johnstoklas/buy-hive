import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

type RequestAccessTokenMessage = {
    action: "requestAccessToken";
};

type TokenResponse =
    | { status: "success"; data: string }
    | { status: "error"; message: string };

export function useTokenResponder() {
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const handler = (
            message: RequestAccessTokenMessage,
            sender: chrome.runtime.MessageSender,
            sendResponse: (response: TokenResponse
        ) => boolean | void) => {
            if (sender.id !== chrome.runtime.id) {
                sendResponse({ status: "error", message: "Unauthorized sender" });
                return;
            }

            if (message.action !== "requestAccessToken") return;

            (async () => {
                try {
                    const token = await getAccessTokenSilently({
                        authorizationParams: {
                        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                        },
                    });

                    sendResponse({ status: "success", data: token });
                } catch {
                    sendResponse({ status: "error", message: "Token failed" });
                }
            })();

            return true;
        };

        chrome.runtime.onMessage.addListener(handler);
        return () => chrome.runtime.onMessage.removeListener(handler);
    }, [getAccessTokenSilently]); 
}
