'use client'
'use client'

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

type Booking = {
  reference: string
  package_name: string
  appointment_date: string
  time_window: string
  country: string
  city: string
  status: string
}

function BookingSuccessInner() {
  const params = useSearchParams()
  const sessionId = params.get("session_id")
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!sessionId) {
        setError("Missing session id")
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Could not verify payment")
        setBooking(data.booking)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [sessionId])

  return (
    <div className="min-h-screen bg-[#fdf7ef] px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#d6c4a5] bg-white/90 p-10 shadow-lg">
        <p className="text-sm uppercase tracking-[0.2em] text-[#C9A24D]">Booking Confirmed</p>
        <h1 className="mt-3 font-display text-4xl text-[#2c1a0a]">Thank you for your payment</h1>
        <p className="mt-3 text-[#6b4a2d]">We&apos;ve received your booking. A confirmation has been sent.</p>

        {loading && <p className="mt-6 text-[#6b4a2d]">Verifying payment...</p>}
        {error && <p className="mt-6 text-red-600">{error}</p>}

        {booking && (
          <div className="mt-8 space-y-3 rounded-lg border border-[#e6d8c0] bg-[#fffaf2] p-6 text-[#2c1a0a]">
            <div className="flex justify-between text-sm text-[#846134]">
              <span>Reference</span>
              <span className="font-semibold text-[#b1781d]">{booking.reference}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Package</span>
              <span className="font-medium">{booking.package_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date / Time</span>
              <span className="font-medium">
                {booking.appointment_date} — {booking.time_window}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Location</span>
              <span className="font-medium">
                {booking.country}, {booking.city}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Status</span>
              <span className="font-semibold text-green-700">{booking.status?.toUpperCase()}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/447523992614"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded bg-[#C9A24D] px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[#1c1208] transition hover:bg-[#e8d6b5]"
          >
            Chat on WhatsApp
          </a>
          <Link
            href="/"
            className="flex-1 rounded border border-[#C9A24D] px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[#c08b2f] transition hover:bg-[#C9A24D] hover:text-[#1c1208]"
          >
            Back to Home
          </Link>
          <Link
            href="/packages"
            className="flex-1 rounded border border-[#C9A24D] px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[#c08b2f] transition hover:bg-[#C9A24D] hover:text-[#1c1208]"
          >
            View Packages
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#6b4a2d]">Loading confirmation...</div>}>
      <BookingSuccessInner />
    </Suspense>
  )
}
