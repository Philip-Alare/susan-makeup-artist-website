'use client'
'use client'

export const dynamic = "force-dynamic"

import Link from "next/link"
import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { packages, type PackageData } from "../../data/packages"

type PayType = "deposit" | "full"

const ukCities = ["London", "Manchester", "Birmingham", "Leeds", "Sheffield", "Bradford"]
const ngCities = ["Lagos"]

function BookingPageInner() {
  const params = useSearchParams()
  const preselect = params.get("package")
  const [selected, setSelected] = useState<string | null>(preselect)
  const [payType, setPayType] = useState<PayType>("deposit")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [timeWindow, setTimeWindow] = useState("Morning (9–12)")
  const [country, setCountry] = useState<"UK" | "Nigeria">("UK")
  const [city, setCity] = useState("London")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [instagramHandle, setInstagramHandle] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPackage = useMemo(() => packages.find((p) => p.id === selected) || packages[0], [selected])

  const amount = payType === "deposit" ? selectedPackage.deposit : selectedPackage.price
  const amountLabel = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: selectedPackage.currency,
    minimumFractionDigits: selectedPackage.currency === "NGN" ? 0 : 2,
  }).format(amount)

  async function handleSubmit(type: PayType) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          payType: type,
          appointmentDate,
          timeWindow,
          country: country === "UK" ? "UK" : "Nigeria",
          city,
          name,
          phone,
          email,
          instagramHandle,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || "Unable to start checkout")
      window.location.href = data.url as string
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#fdf7ef] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#C9A24D]">Luxury Booking</p>
          <h1 className="mt-3 font-display text-4xl text-[#2c1a0a] md:text-5xl">Book Your Appointment</h1>
          <p className="mt-4 text-[#6b4a2d]">
            Select a package, choose your date, and confirm with a deposit or full payment.
          </p>
        </div>

        <div className="space-y-10">
          <section className="rounded-xl border border-[#d6c4a5] bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24D]">Step 1</p>
                <h2 className="font-display text-2xl text-[#2c1a0a]">Choose a package</h2>
              </div>
              <Link href="/packages" className="text-sm text-[#b1781d] underline">
                View package details
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelected(pkg.id)}
                  className={`rounded-lg border p-4 text-left transition hover:-translate-y-1 ${
                    selectedPackage.id === pkg.id
                      ? "border-[#C9A24D] bg-[#f9f0de]"
                      : "border-[#e6d8c0] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl text-[#2c1a0a]">{pkg.name}</h3>
                    {pkg.id === selectedPackage.id && (
                      <span className="rounded-full bg-[#C9A24D] px-3 py-1 text-xs text-[#1c1208]">Selected</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#6b4a2d]">{pkg.description}</p>
                  <p className="mt-3 text-lg font-semibold text-[#b1781d]">
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: pkg.currency,
                      minimumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
                    }).format(pkg.price)}
                  </p>
                  <p className="text-xs text-[#846134]">
                    Deposit:{" "}
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: pkg.currency,
                      minimumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
                    }).format(pkg.deposit)}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#d6c4a5] bg-white/80 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24D]">Step 2</p>
            <h2 className="font-display text-2xl text-[#2c1a0a]">Date & Time</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-[#5a4632]">Preferred Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="mt-2 w-full rounded border border-[#d6c4a5] bg-white px-3 py-2 text-[#2c1a0a] focus:border-[#C9A24D] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-[#5a4632]">Time Window</label>
                <select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  className="mt-2 w-full rounded border border-[#d6c4a5] bg-white px-3 py-2 text-[#2c1a0a] focus:border-[#C9A24D] focus:outline-none"
                >
                  <option>Morning (9–12)</option>
                  <option>Afternoon (12–3)</option>
                  <option>Evening (3–6)</option>
                  <option>Custom (specify in notes)</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#d6c4a5] bg-white/80 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24D]">Step 3</p>
            <h2 className="font-display text-2xl text-[#2c1a0a]">Location</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm text-[#5a4632]">Country</label>
                <div className="flex gap-3">
                  {["UK", "Nigeria"].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCountry(c as "UK" | "Nigeria")
                        setCity(c === "UK" ? ukCities[0] : ngCities[0])
                      }}
                      className={`flex-1 rounded border px-4 py-2 text-sm ${
                        country === c ? "border-[#C9A24D] bg-[#f9f0de]" : "border-[#d6c4a5] bg-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-[#5a4632]">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 w-full rounded border border-[#d6c4a5] bg-white px-3 py-2 text-[#2c1a0a] focus:border-[#C9A24D] focus:outline-none"
                >
                  {(country === "UK" ? ukCities : ngCities).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-[#846134]">
                  Available to travel to any country (travel fees may apply).
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#d6c4a5] bg-white/80 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24D]">Step 4</p>
            <h2 className="font-display text-2xl text-[#2c1a0a]">Your Details</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-[#5a4632]">Full Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded border border-[#d6c4a5] bg-white px-3 py-2 text-[#2c1a0a] focus:border-[#C9A24D] focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm text-[#5a4632]">Phone *</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded border border-[#d6c4a5] bg-white px-3 py-2 text-[#2c1a0a] focus:border-[#C9A24D] focus:outline-none"
                  placeholder="+44 7523 992614"
                />
              </div>
              <div>
                <label className="text-sm text-[#5a4632]">Email (optional)</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded border border-[#d6c4a5] bg-white px-3 py-2 text-[#2c1a0a] focus:border-[#C9A24D] focus:outline-none"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-[#5a4632]">Instagram (optional)</label>
                <input
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="mt-2 w-full rounded border border-[#d6c4a5] bg-white px-3 py-2 text-[#2c1a0a] focus:border-[#C9A24D] focus:outline-none"
                  placeholder="@beautyhomebysuzain"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-[#5a4632]">Notes / Event type</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 w-full rounded border border-[#d6c4a5] bg-white px-3 py-2 text-[#2c1a0a] focus:border-[#C9A24D] focus:outline-none"
                  rows={3}
                  placeholder="Share your vision, timing, venue details, or special requests."
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#d6c4a5] bg-white/80 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24D]">Step 5</p>
            <h2 className="font-display text-2xl text-[#2c1a0a]">Payment</h2>
            <p className="mt-3 text-sm text-[#6b4a2d]">
              Secure your date with a deposit or pay in full. Deposits are non-refundable.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {(["deposit", "full"] as PayType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setPayType(type)}
                  className={`rounded-full border px-4 py-2 text-sm capitalize ${
                    payType === type ? "border-[#C9A24D] bg-[#f9f0de]" : "border-[#d6c4a5] bg-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-lg font-semibold text-[#b1781d]">Total: {amountLabel}</div>
              <div className="flex gap-3">
                <button
                  disabled={loading || !appointmentDate || !name || !phone}
                  onClick={() => handleSubmit(payType)}
                  className="rounded bg-[#C9A24D] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#1c1208] transition hover:bg-[#e8d6b5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Processing..." : `Pay ${payType === "deposit" ? "Deposit" : "Full"} & Confirm`}
                </button>
                <a
                  href="https://wa.me/447523992614"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border-2 border-[#C9A24D] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#c08b2f] transition hover:bg-[#C9A24D] hover:text-[#1c1208]"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </section>
        </div>
      </div>
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#6b4a2d]">Loading booking form...</div>}>
      <BookingPageInner />
    </Suspense>
  )
}
