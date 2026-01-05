// Point the dashboard to the site API (prefer explicit site URL)
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined) ||
  (typeof window !== "undefined" ? window.location.origin : (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://susan-makeup-artist-website.vercel.app"));

// When running on the client, use relative paths to avoid CORS issues and ensure we hit the same backend.
// When running on the server, use the absolute URL.
const API_ORIGIN = typeof window !== "undefined" ? "" : SITE_ORIGIN;

export const BASE = `${API_ORIGIN}/api/content`;
export const UPLOAD_BASE = `${API_ORIGIN}/api/upload`;

// Helper to prefix relative asset paths with the site origin
// MODIFIED: For local assets (starting with /), we keep them relative to allow next/image optimization to work best
// and avoid issues with loopback requests or mismatched origins in Vercel previews.
export function withSite(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}

export async function getSection(section: string) {
  const t = Date.now();
  const res = await fetch(`${BASE}/${section}?t=${t}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch section");
  return res.json();
}

export async function updateSection(section: string, data: any) {
  const res = await fetch(`${BASE}/${section}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let msg = "Failed to update section";
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
      if (body?.detail) msg += `: ${body.detail}`;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(UPLOAD_BASE, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Upload failed");
  }
  return res.json();
}
