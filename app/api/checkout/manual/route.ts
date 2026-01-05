import { NextResponse, type NextRequest } from "next/server"
import { put, list } from "@vercel/blob"

import { sql } from "../../../../lib/db"
import { packages } from "../../../../data/packages"
import { rateLimit } from "@/lib/rateLimit"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "https://beautyhomebysuzain.com")
const BLOB_BUCKET = process.env.BLOB_BUCKET || process.env.NEXT_PUBLIC_BLOB_BUCKET;
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
    let url: string | null = null;
    if (BLOB_BASE_URL) {
       url = `${BLOB_BASE_URL}/content/packages.json`;
    } else if (BLOB_TOKEN) {
       const { blobs } = await list({ prefix: "content/packages.json", limit: 1, token: BLOB_TOKEN });
       if (blobs.length > 0) url = blobs[0].url;
    }

    if (!url) return defaults;

    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return defaults
    const data = await res.json()
    if (Array.isArray(data?.packages)) {
      return data.packages.map((p: any, idx: number) => ({
        ...p,
        id: p.id || `${p.name.toLowerCase().replace(/\s+/g, "-")}-${idx}`,
        price: Number(p.price),
        deposit: Number(p.deposit),
      }))
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
  
  // Create booking object
  const booking = {
    reference,
    package_id: pkg.id,
    package_name: pkg.name,
    currency: pkg.currency,
    amount_paid: amountMinor,
    pay_type: payType,
    appointment_date: appointmentDate,
    time_window: timeWindow,
    country,
    city,
    customer_name: name,
    customer_email: email || null,
    customer_phone: phone,
    instagram_handle: instagramHandle || null,
    notes: notes || null,
    status: "pending_payment", // Distinct status for bank transfer
    stripe_session_id: null,
    payment_method: "bank_transfer",
    created_at: new Date().toISOString(),
  }

  try {
    const conn = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL
    if (conn) {
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
          status,
          stripe_session_id
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
          ${"pending_payment"},
          ${null}
        )
      `
    } else if (BLOB_TOKEN) {
      const bookingsUrl = await getBookingsBlobUrl();
      const existing = bookingsUrl ? await fetch(bookingsUrl, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => []) : [];
      const next = Array.isArray(existing) ? [booking, ...existing] : [booking]
      
      await put('bookings/bookings.json', JSON.stringify(next), {
        access: 'public',
        addRandomSuffix: false,
        token: BLOB_TOKEN,
        allowOverwrite: true,
      })
    }

    return NextResponse.json({ reference })
  } catch (error) {
    console.error("Booking error", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}