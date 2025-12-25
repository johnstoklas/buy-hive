export async function getAccessToken() {
  chrome.runtime.sendMessage({ action: "requestAccessToken" }, (response) => {
    if (response?.status === "success" && response?.data) {
      console.log(response.data);
      return response.data;
    } else {
      console.error(response?.message);
    }
  })
}

