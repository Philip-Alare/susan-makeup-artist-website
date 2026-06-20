import { useEffect, useMemo, useState } from "react"
import { Card, CardHeader, CardContent } from "./Card"
import { Button } from "./Button"
import { RefreshCw, Filter } from "lucide-react"

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

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBookings(statusFilter)
  }, [statusFilter])

  async function fetchBookings(status?: string) {
    setLoading(true)
    setError(null)
    try {
      // Authenticated via cookie now
      const t = Date.now()
      const res = await fetch(`/api/admin/bookings${status ? `?status=${status}&t=${t}` : `?t=${t}`}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load bookings")
      setBookings(data.bookings || [])
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-black text-xl font-semibold">Bookings</h1>
          <p className="text-muted-foreground">Manage appointments and payments</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-[#E5E5E5] bg-white py-2 pl-4 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-black sm:min-w-44"
            >
              <option value="">All Status</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            onClick={() => fetchBookings(statusFilter)}
            disabled={loading}
            variant="ghost"
            className="w-full justify-center sm:w-auto sm:p-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="break-all font-mono text-sm text-muted-foreground">#{booking.reference}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                      ${booking.status === 'paid' ? 'bg-black text-[#FFFFFF]' : 
                        (booking.status === 'pending' || booking.status === 'pending_payment') ? 'bg-[#E5E5E5] text-black' : 
                        'bg-[#1A1A1A] text-[#FFFFFF]'}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-black">{booking.package_name}</h3>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end sm:text-right">
                  <div>
                    <p className="text-2xl font-bold text-black">
                      {formatter(booking.amount_paid, booking.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">{new Date(booking.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  {(booking.status === 'pending_payment' || booking.status === 'pending') && (
                    <Button 
                      size="sm" 
                      className="h-8 w-full bg-black text-xs text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
                      onClick={() => updateStatus(booking.reference, 'paid')}
                    >
                      Mark Paid
                    </Button>
                  )}
                  {booking.status === 'paid' && (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="h-8 w-full border-black text-xs text-black hover:bg-[#F5F5F5] sm:w-auto"
                      onClick={() => updateStatus(booking.reference, 'pending_payment')}
                    >
                      Mark Pending
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-[#E5E5E5] py-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-medium text-black">{booking.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{booking.customer_phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Appointment</p>
                  <p className="font-medium text-black">
                    {new Date(booking.appointment_date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">{booking.time_window}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                  <p className="font-medium text-black">{booking.city}, {booking.country}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  )
}
