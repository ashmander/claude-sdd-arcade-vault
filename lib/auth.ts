// ===== lib/auth.ts — sesión mock vía localStorage =====

export interface AvUser {
  name: string;
}

const KEY = "av_user";
const EVENT = "av-user-changed";

let cachedRaw: string | null = null;
let cachedUser: AvUser | null = null;

export function getStoredUser(): AvUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? JSON.parse(raw) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

export function setStoredUser(user: AvUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(EVENT));
}

export function clearStoredUser() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeToUser(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}
