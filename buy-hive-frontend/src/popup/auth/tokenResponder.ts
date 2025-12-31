import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export function useTokenResponder() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const handler = (msg, sender, sendResponse) => {
      if (msg.action !== "requestAccessToken") return;

      (async () => {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });

          sendResponse({ status: "success", data: token });
        } catch (e) {
          sendResponse({ status: "error", message: "Token failed" });
        }
      })();

      return true;
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, [getAccessTokenSilently]); }
