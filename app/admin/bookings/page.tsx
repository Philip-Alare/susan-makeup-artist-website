'use client'

import { useEffect, useMemo, useState } from "react"

type Booking = {
  id: number
  reference: string
  package_name: string
  amount_paid: number
  currency: string
  appointment_date: string
  time_window: string
  country: string
  city: string
  customer_name: string
  customer_phone: string
  status: string
  created_at: string
}

const formatter = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
    minimumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(amount / 100)

export default function AdminBookingsPage() {
  const [password, setPassword] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("bh-admin-key")
    if (stored) {
      setPassword(stored)
      void fetchBookings(stored, statusFilter)
    }
  }, [statusFilter])

  async function fetchBookings(key: string, status?: string) {
    setLoading(true)
    setError(null)
    try {
      const t = Date.now()
      const res = await fetch(`/api/admin/bookings${status ? `?status=${status}&t=${t}` : `?t=${t}`}`, {
        cache: "no-store",
        headers: { "x-admin-key": key },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load bookings")
      setBookings(data.bookings || [])
      localStorage.setItem("bh-admin-key", key)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(reference: string, newStatus: string) {
    if (!confirm(`Mark booking ${reference} as ${newStatus}?`)) return
    
    // Optimistic update
    const previous = [...bookings]
    setBookings(prev => prev.map(b => b.reference === reference ? { ...b, status: newStatus } : b))

    try {
      const t = Date.now()
      const res = await fetch(`/api/admin/bookings?t=${t}`, {
        method: 'PATCH',
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': password
        },
        body: JSON.stringify({ reference, status: newStatus })
      })
      
      if (!res.ok) {
        throw new Error('Failed to update status')
      }
    } catch (err) {
      alert('Error updating status')
      setBookings(previous) // Revert
    }
  }

  const filtered = useMemo(() => {
    if (!statusFilter) return bookings
    return bookings.filter((b) => b.status === statusFilter)
  }, [bookings, statusFilter])

  return (
    <div className="min-h-screen bg-[#fdf7ef] px-4 py-12">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#d6c4a5] bg-white/90 p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24D]">Admin</p>
            <h1 className="font-display text-3xl text-[#2c1a0a]">Bookings</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="rounded border border-[#d6c4a5] bg-white px-3 py-2 text-sm text-[#2c1a0a]"
            />
            <button
              onClick={() => fetchBookings(password, statusFilter)}
              className="rounded bg-[#C9A24D] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#1c1208] transition hover:bg-[#e8d6b5]"
            >
              Load
            </button>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                fetchBookings(password, e.target.value || undefined)
              }}
              className="rounded border border-[#d6c4a5] bg-white px-3 py-2 text-sm text-[#2c1a0a]"
            >
              <option value="">All</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {loading && <p className="mt-3 text-[#6b4a2d]">Loading...</p>}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm text-[#2c1a0a]">
            <thead>
              <tr className="border-b border-[#e6d8c0] bg-[#f9f0de] text-left">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">Package</th>
                <th className="px-3 py-2">Paid</th>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-[#f0e5cf]">
                  <td className="px-3 py-2">{new Date(b.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2 font-mono text-xs">{b.reference}</td>
                  <td className="px-3 py-2">{b.package_name}</td>
                  <td className="px-3 py-2">{formatter(b.amount_paid, b.currency)}</td>
                  <td className="px-3 py-2">
                    {b.appointment_date} • {b.time_window}
                  </td>
                  <td className="px-3 py-2">
                    {b.country}, {b.city}
                  </td>
                  <td className="px-3 py-2">
                    {b.customer_name}
                    <div className="text-xs text-[#6b4a2d]">{b.customer_phone}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        b.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : (b.status === "pending" || b.status === "pending_payment")
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {b.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {(b.status === 'pending_payment' || b.status === 'pending') && (
                      <button
                        onClick={() => updateStatus(b.reference, 'paid')}
                        className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 transition"
                      >
                        Mark Paid
                      </button>
                    )}
                    {b.status === 'paid' && (
                      <button
                        onClick={() => updateStatus(b.reference, 'pending_payment')}
                        className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-200 transition"
                      >
                        Mark Pending
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td className="px-3 py-6 text-center text-[#6b4a2d]" colSpan={9}>
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
