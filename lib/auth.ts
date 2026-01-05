const COOKIE_NAME = "susan_dashboard_session";
const COOKIE_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "susan_dashboard_secret";

export { COOKIE_NAME, COOKIE_SECRET };

// Helper to get crypto key for HMAC signing
async function getKey() {
  const enc = new TextEncoder();
  const secret = String(COOKIE_SECRET); // Ensure it's a string
  
  if (!globalThis.crypto || !globalThis.crypto.subtle) {
    throw new Error("Web Crypto API is not available in this environment");
  }

  return globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a signed session token with UTC expiration.
 * Format: base64(username:expiry).base64(signature)
 */
export async function signSession(username: string): Promise<string> {
  // Set expiration to 10 minutes from now (UTC timestamp)
  const expiry = Date.now() + 10 * 60 * 1000;
  const data = `${username}:${expiry}`;
  
  const key = await getKey();
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(data)
  );
  
  const dataB64 = Buffer.from(data).toString("base64");
  const sigB64 = Buffer.from(signature).toString("base64");
  
  return `${dataB64}.${sigB64}`;
}

/**
 * Verifies session token and checks UTC expiration.
 */
export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  
  try {
    // Handle legacy tokens (simple base64) by failing gracefully
    if (!token.includes(".")) return false;

    const [dataB64, sigB64] = token.split(".");
    if (!dataB64 || !sigB64) return false;
    
    const data = Buffer.from(dataB64, "base64").toString("utf8");
    const [username, expiryStr] = data.split(":");
    
    // Parse expiry (UTC timestamp)
    const expiry = parseInt(expiryStr, 10);
    
    // Check if expired (Date.now() returns UTC timestamp)
    if (isNaN(expiry) || Date.now() > expiry) {
      return false;
    }
    
    // Verify signature to ensure expiry/username wasn't tampered with
    const key = await getKey();
    const enc = new TextEncoder();
    const sig = Buffer.from(sigB64, "base64");
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sig,
      enc.encode(data)
    );
    
    return isValid && Boolean(username);
  } catch (e) {
    return false;
  }
}
