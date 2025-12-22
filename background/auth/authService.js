export async function getAccessToken() {
  const { accessToken } = await chrome.storage.session.get("accessToken");
  return accessToken;
}
