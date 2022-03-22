export async function saveTokenToLocalStorage(userToken) {
  localStorage.setItem("userToken", userToken);
  //getting expiresInTime
  const expiry = await JSON.parse(userToken.split(".")[1]).exp;
  setLogoutTimer(userToken, expiry * 1000);
}

export function setLogoutTimer(userToken, timer) {
  setTimeout(() => {
    localStorage.removeItem("userToken");
  }, timer);
}
