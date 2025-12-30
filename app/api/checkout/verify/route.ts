import { NextResponse, type NextRequest } from "next/server"
import Stripe from "stripe"

import { sql } from "../../../../lib/db"

const stripeSecret = process.env.STRIPE_SECRET_KEY

export async function GET(request: NextRequest) {
  if (!stripeSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-10-22" })
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] })
    const paid = session.payment_status === "paid"
    const reference = (session.metadata?.booking_reference as string | undefined) || null

    if (paid) {
      await sql`
        UPDATE bookings
        SET status = 'paid'
        WHERE stripe_session_id = ${sessionId}
      `
    }

    const bookingResult = await sql`
      SELECT *
      FROM bookings
      WHERE stripe_session_id = ${sessionId}
      LIMIT 1
    `

    return NextResponse.json({
      status: paid ? "paid" : session.payment_status,
      booking: bookingResult.rows[0] || null,
      reference,
    })
  } catch (error) {
    console.error("Verify error", error)
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 })
  }
}
