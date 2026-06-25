import { NextResponse, type NextRequest } from "next/server"

import { sql } from "../../../../lib/db"
import { packages, normalizePackage } from "../../../../data/packages"
import { rateLimit } from "@/lib/rateLimit"
import { getContent } from "@/lib/content"

function bookingReference() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const rand = Math.random().toString(36).slice(-4).toUpperCase()
  return `BHS-${y}${m}${d}-${rand}`
}

async function resolvePackages() {
  const defaults = packages
  try {
    const data = await getContent("packages")
    if (Array.isArray(data?.packages)) {
      return data.packages.map((p: any, idx: number) => normalizePackage(p, idx, defaults))
    }
    return defaults
  } catch {
    return defaults
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { key: "checkout:manual", max: 5, windowMs: 60_000 })
  if (limited.blocked && limited.response) return limited.response

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const {
    packageId,
    payType,
    appointmentDate,
    timeWindow,
    country,
    city,
    name,
    phone,
    email,
    instagramHandle,
    notes,
  } = body

  if (!packageId || !payType || !appointmentDate || !timeWindow || !country || !city || !name || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const resolved = await resolvePackages()
  const pkg = resolved.find((p: any) => p.id === packageId)
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 })
  }

  const amountMajor = payType === "deposit" ? pkg.deposit : pkg.price
  const amountMinor = Math.round(amountMajor * 100)

  const reference = bookingReference()

  try {
    const conn = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
    if (!conn) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    await sql`
      INSERT INTO bookings (
        reference,
        package_id,
        package_name,
        currency,
        amount_paid,
        pay_type,
        appointment_date,
        time_window,
        country,
        city,
        customer_name,
        customer_email,
        customer_phone,
        instagram_handle,
        notes,
        status
      ) VALUES (
        ${reference},
        ${pkg.id},
        ${pkg.name},
        ${pkg.currency},
        ${amountMinor},
        ${payType},
        ${appointmentDate},
        ${timeWindow},
        ${country},
        ${city},
        ${name},
        ${email || null},
        ${phone},
        ${instagramHandle || null},
        ${notes || null},
        ${"pending_payment"}
      )
    `

    return NextResponse.json({ reference })
  } catch (error) {
    console.error("Booking error", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
