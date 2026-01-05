import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verifySession, COOKIE_NAME } from "@/lib/auth"
import { sql } from "@/lib/db"
import { rateLimit } from "@/lib/rateLimit"
import { list } from "@vercel/blob"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD
const BLOB_BUCKET = process.env.BLOB_BUCKET || process.env.NEXT_PUBLIC_BLOB_BUCKET
const BLOB_BASE_URL =
  process.env.BLOB_BASE_URL ||
  process.env.NEXT_PUBLIC_BLOB_BASE_URL ||
  (BLOB_BUCKET ? `https://${BLOB_BUCKET}.public.blob.vercel-storage.com` : undefined);
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_RW_TOKEN ||
  process.env.BLOB_READ_WRITE_TOKEN

async function getBookingsBlobUrl() {
  if (BLOB_BASE_URL) return `${BLOB_BASE_URL}/bookings/bookings.json`;
  if (BLOB_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "bookings/bookings.json", limit: 1, token: BLOB_TOKEN });
      if (blobs.length > 0) return blobs[0].url;
    } catch { /* ignore */ }
  }
  return null;
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "admin:bookings", max: 20, windowMs: 60_000 })
  if (limited.blocked && limited.response) return limited.response
  const token = cookies().get(COOKIE_NAME)?.value
  const isSessionValid = await verifySession(token)
  
  const provided = request.headers.get("x-admin-key") || new URL(request.url).searchParams.get("key")
  
  if (!isSessionValid && (!ADMIN_PASSWORD || provided !== ADMIN_PASSWORD)) {
      return unauthorized()
  }

  const status = new URL(request.url).searchParams.get("status")

  try {
    const conn = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL
    if (!conn) {
      const bookingsUrl = await getBookingsBlobUrl();
      const existing = bookingsUrl ? await fetch(bookingsUrl, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []) : [];
      const list = Array.isArray(existing) ? existing : []
      const filtered = status ? list.filter((b: any) => b.status === status) : list
      return NextResponse.json({ bookings: filtered })
    }
    const bookings = status
      ? await sql`SELECT * FROM bookings WHERE status = ${status} ORDER BY created_at DESC LIMIT 200`
      : await sql`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200`
    return NextResponse.json({ bookings: bookings.rows })
  } catch (error) {
    console.error("Fetch bookings error", error)
    try {
      const bookingsUrl = await getBookingsBlobUrl();
      const existing = bookingsUrl ? await fetch(bookingsUrl, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []) : [];
      const list = Array.isArray(existing) ? existing : []
      const filtered = status ? list.filter((b: any) => b.status === status) : list
      return NextResponse.json({ bookings: filtered })
    } catch {
      return NextResponse.json({ bookings: [] })
    }
  }
}
