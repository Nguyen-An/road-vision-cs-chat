const KEY = "support_widget_session_id";
let memorySessionId = "";

const randomId = () => {
  const value = new Uint8Array(12);
  crypto.getRandomValues(value);
  return Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export function getSessionId() {
  try {
    const existing = sessionStorage.getItem(KEY);
    if (existing) return existing;
    const created = `session_${randomId()}`;
    sessionStorage.setItem(KEY, created);
    return created;
  } catch {
    if (!memorySessionId) memorySessionId = `session_${Math.random().toString(36).slice(2)}`;
    return memorySessionId;
  }
}
