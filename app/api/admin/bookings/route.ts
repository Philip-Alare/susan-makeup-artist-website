import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verifySession, COOKIE_NAME } from "@/lib/auth"
import { sql } from "@/lib/db"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const token = cookies().get(COOKIE_NAME)?.value
  const isSessionValid = await verifySession(token)
  
  const provided = request.headers.get("x-admin-key") || new URL(request.url).searchParams.get("key")
  
  if (!isSessionValid && (!ADMIN_PASSWORD || provided !== ADMIN_PASSWORD)) {
      return unauthorized()
  }

  const status = new URL(request.url).searchParams.get("status")

  try {
    const bookings = status
      ? await sql`SELECT * FROM bookings WHERE status = ${status} ORDER BY created_at DESC LIMIT 200`
      : await sql`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200`
    return NextResponse.json({ bookings: bookings.rows })
  } catch (error) {
    console.error("Fetch bookings error", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
