import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export function useTokenResponder() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const handler = async (
      msg: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (res?: any) => void
    ) => {
      if (msg.action === "requestAccessToken" && sender.id === chrome.runtime.id) {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          }
        });
        sendResponse({ status: "success", data: accessToken });
        return true;
      }
      else {
        sendResponse({ status: "error", message: "Invalid request" });
        return false;
      }
    };


    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, [getAccessTokenSilently]);
}
