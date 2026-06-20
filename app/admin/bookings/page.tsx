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
    <div className="min-h-screen bg-white px-4 py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-lg sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">Admin</p>
            <h1 className="font-display text-3xl text-black">Bookings</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-black"
            />
            <button
              onClick={() => fetchBookings(password, statusFilter)}
              className="rounded bg-black px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] transition hover:bg-[#1A1A1A]"
            >
              Load
            </button>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                fetchBookings(password, e.target.value || undefined)
              }}
              className="w-full rounded border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-black sm:col-span-2 lg:w-auto"
            >
              <option value="">All</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-[#1A1A1A]">{error}</p>}
        {loading && <p className="mt-3 text-[#666666]">Loading...</p>}

        <div className="mt-6 space-y-4 md:hidden">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#F0F0F0] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
                    {new Date(b.created_at).toLocaleDateString()}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      b.status === "paid"
                        ? "bg-black text-[#FFFFFF]"
                        : (b.status === "pending" || b.status === "pending_payment")
                          ? "bg-[#E5E5E5] text-black"
                          : "bg-[#1A1A1A] text-[#FFFFFF]"
                    }`}
                  >
                    {b.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#666666]">Reference</p>
                  <p className="mt-1 break-all font-mono text-sm text-black">{b.reference}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#666666]">Package</p>
                  <p className="mt-1 font-semibold text-black">{b.package_name}</p>
                  <p className="mt-1 text-sm text-[#666666]">{formatter(b.amount_paid, b.currency)}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#666666]">Appointment</p>
                    <p className="mt-1 text-sm text-black">{b.appointment_date}</p>
                    <p className="text-sm text-[#666666]">{b.time_window}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#666666]">Location</p>
                    <p className="mt-1 text-sm text-black">{b.country}, {b.city}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#666666]">Client</p>
                    <p className="mt-1 text-sm font-medium text-black">{b.customer_name}</p>
                    <p className="text-sm text-[#666666]">{b.customer_phone}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {(b.status === 'pending_payment' || b.status === 'pending') && (
                    <button
                      onClick={() => updateStatus(b.reference, 'paid')}
                      className="rounded bg-black px-3 py-2 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#1A1A1A]"
                    >
                      Mark Paid
                    </button>
                  )}
                  {b.status === 'paid' && (
                    <button
                      onClick={() => updateStatus(b.reference, 'pending_payment')}
                      className="rounded border border-black px-3 py-2 text-sm font-semibold text-black transition hover:bg-[#F5F5F5]"
                    >
                      Mark Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!filtered.length && (
            <div className="rounded-2xl border border-dashed border-[#E5E5E5] px-4 py-8 text-center text-[#666666]">
              No bookings yet.
            </div>
          )}
        </div>

        <div className="mt-6 hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm text-black">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F5F5F5] text-left">
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
                <tr key={b.id} className="border-b border-[#E5E5E5]">
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
                    <div className="text-xs text-[#666666]">{b.customer_phone}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        b.status === "paid"
                          ? "bg-black text-[#FFFFFF]"
                          : (b.status === "pending" || b.status === "pending_payment")
                            ? "bg-[#E5E5E5] text-black"
                            : "bg-[#1A1A1A] text-[#FFFFFF]"
                      }`}
                    >
                      {b.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {(b.status === 'pending_payment' || b.status === 'pending') && (
                      <button
                        onClick={() => updateStatus(b.reference, 'paid')}
                        className="rounded bg-black px-2 py-1 text-xs font-semibold text-[#FFFFFF] hover:bg-[#1A1A1A] transition"
                      >
                        Mark Paid
                      </button>
                    )}
                    {b.status === 'paid' && (
                      <button
                        onClick={() => updateStatus(b.reference, 'pending_payment')}
                        className="rounded border border-black px-2 py-1 text-xs font-semibold text-black hover:bg-[#F5F5F5] transition"
                      >
                        Mark Pending
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td className="px-3 py-6 text-center text-[#666666]" colSpan={9}>
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
