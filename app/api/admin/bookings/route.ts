import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verifySession, COOKIE_NAME } from "@/lib/auth"
import { sql } from "@/lib/db"
import { rateLimit } from "@/lib/rateLimit"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD

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
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }
    const bookings = status
      ? await sql`SELECT * FROM bookings WHERE status = ${status} ORDER BY created_at DESC LIMIT 200`
      : await sql`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200`
    return NextResponse.json({ bookings: bookings.rows })
  } catch (error) {
    console.error("Fetch bookings error", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request, { key: "admin:bookings:update", max: 10, windowMs: 60_000 })
  if (limited.blocked && limited.response) return limited.response
  
  const token = cookies().get(COOKIE_NAME)?.value
  const isSessionValid = await verifySession(token)
  
  const provided = request.headers.get("x-admin-key") || new URL(request.url).searchParams.get("key")
  
  if (!isSessionValid && (!ADMIN_PASSWORD || provided !== ADMIN_PASSWORD)) {
      return unauthorized()
  }

  try {
    const { reference, status } = await request.json()
    if (!reference || !status) {
      return NextResponse.json({ error: "Missing reference or status" }, { status: 400 })
    }

    const conn = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL
    if (!conn) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    await sql`UPDATE bookings SET status = ${status} WHERE reference = ${reference}`

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Update booking error", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
