import { paths } from "@/paths";

let loggingOut = false;

export function logout(): void {
  if (loggingOut || typeof window === "undefined") {
    return;
  }
  loggingOut = true;

  try {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
  } finally {
    window.location.href = paths.auth.signIn;
  }
}
