export type ContextTokenRequest = {
  tenantId: string;
  sessionId: string;
  userId?: string;
  sourceUrl: string;
};

export async function createContextToken(payload: ContextTokenRequest, apiBaseUrl = "") {
  const response = await fetch(`${apiBaseUrl}/api/widget/context-token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "omit",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Unable to create support widget context token.");
  }

  return (await response.json()) as { token: string; expiresIn: number };
}
