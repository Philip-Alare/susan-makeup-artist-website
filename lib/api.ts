// Point the dashboard to the local API
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || 
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const BASE = `${SITE_ORIGIN}/api/content`;
export const UPLOAD_BASE = `${SITE_ORIGIN}/api/upload`;

// Helper to prefix relative asset paths with the site origin
export function withSite(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) return `${SITE_ORIGIN}/${path}`;
  return `${SITE_ORIGIN}${path}`;
}

export async function getSection(section: string) {
  const res = await fetch(`${BASE}/${section}`, { cache: "no-store" });
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
