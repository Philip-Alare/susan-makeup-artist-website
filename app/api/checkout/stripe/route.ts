import { NextResponse, type NextRequest } from "next/server"
import Stripe from "stripe"
import { put } from "@vercel/blob"

import { sql } from "../../../../lib/db"
import { packages } from "../../../../data/packages"

const stripeSecret = process.env.STRIPE_SECRET_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beautyhomebysuzain.com"
const BLOB_BUCKET = process.env.BLOB_BUCKET || process.env.NEXT_PUBLIC_BLOB_BUCKET || "pqum76zhaodicrtp"
const BLOB_BASE_URL =
  process.env.BLOB_BASE_URL ||
  process.env.NEXT_PUBLIC_BLOB_BASE_URL ||
  `https://${BLOB_BUCKET}.public.blob.vercel-storage.com`
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_RW_TOKEN ||
  process.env.BLOB_READ_WRITE_TOKEN
const BOOKINGS_BLOB_URL = `${BLOB_BASE_URL}/bookings/bookings.json`

function bookingReference() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const rand = Math.random().toString(36).slice(-4).toUpperCase()
  return `BHS-${y}${m}${d}-${rand}`
}

export async function POST(request: NextRequest) {
  if (!stripeSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2025-12-15.clover" })

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

  const pkg = packages.find((p) => p.id === packageId)
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 })
  }

  const amountMajor = payType === "deposit" ? pkg.deposit : pkg.price
  const amountMinor = Math.round(amountMajor * 100)

  const reference = bookingReference()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: pkg.currency.toLowerCase(),
            product_data: {
              name: `${pkg.name} (${payType === "deposit" ? "Deposit" : "Full Payment"})`,
              metadata: { reference, package_id: pkg.id },
            },
            unit_amount: amountMinor,
          },
        },
      ],
      success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/book?canceled=1`,
      metadata: {
        booking_reference: reference,
        package_id: pkg.id,
        pay_type: payType,
      },
      customer_email: email || undefined,
    })

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
          ${"pending"},
          ${session.id}
        )
      `
    } else if (BLOB_TOKEN) {
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
        status: "pending",
        stripe_session_id: session.id,
        created_at: new Date().toISOString(),
      }
      const existing = await fetch(BOOKINGS_BLOB_URL, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).catch(() => [])
      const next = Array.isArray(existing) ? [booking, ...existing] : [booking]
      
      await put('bookings/bookings.json', JSON.stringify(next), {
        access: 'public',
        addRandomSuffix: false,
        token: BLOB_TOKEN,
      })
    }

    return NextResponse.json({ url: session.url, reference })
  } catch (error) {
    console.error("Checkout error", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
