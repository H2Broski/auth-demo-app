export function saveToken(token: string) {
  console.log("saveToken called with:", token);
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
    console.log("Token saved to localStorage");
  } else {
    console.log("Window is undefined, can't save token");
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    console.log("getToken returning:", token);
    return token;
  }
  console.log("Window is undefined, can't get token");
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    console.log("Token removed from localStorage");
  }
}
