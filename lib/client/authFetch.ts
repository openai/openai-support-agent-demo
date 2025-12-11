import { sessionStore } from "@/stores/useSessionStore";

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const csrf = sessionStore.getState().csrfToken;
  if (csrf) {
    headers.set("x-csrf-token", csrf);
  }

  const mergedInit: RequestInit = {
    ...init,
    headers,
  };

  return fetch(input, mergedInit);
}
