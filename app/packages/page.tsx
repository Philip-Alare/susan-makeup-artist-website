'use client'

import Link from "next/link"
import { motion } from "motion/react"
import { Camera, Check, Crown, Phone, Sparkles } from "lucide-react"

import { formatDeposit, formatPrice, packages, type PackageData, type Currency } from "../../data/packages"
import { useEffect, useState } from "react"
import { getSection } from "@/lib/api"

function iconFor(pkg: PackageData) {
  if (pkg.id.includes("bridal")) return <Crown size={48} />
  if (pkg.id.includes("shoot")) return <Camera size={48} />
  return <Sparkles size={48} />
}

const availabilityText =
  "Serving London, Manchester, Birmingham, Leeds, Sheffield, and Bradford. Available to travel worldwide (fees may apply)."

export default function PackagesPage() {
  const [list, setList] = useState<PackageData[]>(packages)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getSection("packages")
        const api = Array.isArray(data?.packages) ? data.packages : []
        if (api.length) {
          const mapped: PackageData[] = api.map((p: any, idx: number) => {
            const hasSplit = typeof p.currency === "string" && typeof p.price === "number"
            const m = !hasSplit ? String(p.price || "").match(/^([A-Z]{3}|[^\w\s])?\s*([\d,]+(?:\.\d+)?)$/) : null
            const currency = hasSplit ? (p.currency as Currency) : "GBP"
            const value = hasSplit ? Number(p.price) : m?.[2] ? Number(String(m[2]).replace(/,/g, "")) : Number(String(p.price || "").replace(/[^0-9.]/g, "")) || 0

            // Parse deposit which might be "GBP 50" or just number
            const mDep = typeof p.deposit === "string" ? p.deposit.match(/^([A-Z]{3}|[^\w\s])?\s*([\d,]+(?:\.\d+)?)$/) : null
            const depositVal = typeof p.deposit === "number" ? p.deposit : mDep ? Number(String(mDep[2]).replace(/,/g, "")) : Number(String(p.deposit || "").replace(/[^0-9.]/g, "")) || 0

            return {
              id: typeof p.id === "string" && p.id ? p.id : `${p.name?.toLowerCase().replace(/\s+/g, "-") || "pkg"}-${idx}`,
              name: p.name || `Package ${idx + 1}`,
              description: p.originalPrice || p.description || "",
              currency,
              price: value,
              deposit: depositVal,
              includes: Array.isArray(p.includes)
                ? p.includes
                : Array.isArray(p.features)
                ? p.features
                : Array.isArray(p.deliverables)
                ? p.deliverables
                : [],
              durationEstimate: p.durationEstimate || "",
              availability: "BOTH",
            }
          })
          setList(mapped)
        }
      } catch {
        /* keep defaults */
      }
    })()
  }, [])

  return (
    <div className="bg-[#0E0E0E] text-white">
      <section className="bg-gradient-to-b from-[#0E0E0E] to-[#1a1410] px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)]"
          >
            Luxury Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-[#fdf7ec] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
          >
            Exclusive makeup packages designed for your special moments.
          </motion.p>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#C9A24D]" />
          <p className="mt-4 text-white/60">Limited slots available. No refund policy applies to all bookings.</p>
        </div>
      </section>

      <section className="bg-[#1a1410] px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-12">
          {list.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden border-2 bg-[#0E0E0E] ${
                index === 0 ? "border-[#C9A24D]" : "border-[#C9A24D]/30"
              }`}
            >
              {index === 0 && (
                <div className="absolute right-6 top-6 bg-[#C9A24D] z-10 px-4 py-2 text-xs uppercase tracking-wider text-[#0E0E0E]">
                  Client Favorite
                </div>
              )}

              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <div className="mb-6 text-[#C9A24D]">{iconFor(pkg)}</div>
                    <h2 className="font-display text-4xl text-white">{pkg.name}</h2>
                    <div className="my-6">
                      <p className="text-5xl font-display text-[#E6D1C3]">{formatPrice(pkg)}</p>
                      {pkg.deposit > 0 && (
                        <p className="text-sm text-white/50">Deposit: {formatDeposit(pkg)} (non-refundable)</p>
                      )}
                      <p className="text-sm text-white/50 mt-1">Duration: {pkg.durationEstimate}</p>
                    </div>
                    <p className="leading-relaxed text-white/70">{pkg.description}</p>
                    <p className="mt-4 text-sm text-[#C9A24D]">{availabilityText}</p>
                  </div>

                  <div className="space-y-8 lg:col-span-2">
                    <div>
                      <h3 className="mb-4 border-b border-[#C9A24D]/20 pb-2 text-lg uppercase tracking-wider">
                        Package Includes
                      </h3>
                      <ul className="space-y-3">
                        {pkg.includes.map((feature) => (
                          <li key={feature} className="flex items-start text-white/70">
                            <Check size={20} className="mr-3 mt-0.5 flex-shrink-0 text-[#C9A24D]" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 border border-[#C9A24D]/20 bg-[#1a1410] p-6">
                      <p className="text-sm text-[#C9A24D]">Travel worldwide on request (fees may apply).</p>
                      <p className="text-sm text-white/60">Limited slots available per month. Book early to secure.</p>
                      <p className="text-xs italic text-white/50">
                        All booking fees are non-refundable. Reschedules subject to availability.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Link
                        href={`/book?package=${pkg.id}`}
                        className="flex flex-1 items-center justify-center rounded bg-[#C9A24D] px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
                      >
                        Book This Package
                      </Link>
                      <a
                        href="https://wa.me/447523992614"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded border-2 border-[#C9A24D] px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-[#C9A24D] transition-colors hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
                      >
                        <Phone size={20} />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#1a1410] to-[#0E0E0E] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-[#C9A24D]/30 bg-[#0E0E0E] p-8">
            <h3 className="font-display text-center text-2xl text-white">Important Information</h3>
            <div className="mt-6 space-y-4 text-white/70">
              <div className="flex items-start">
                <span className="mr-3 text-[#C9A24D]">-</span>
                <p>
                  <strong className="text-white">Booking Policy:</strong> All booking fees are non-refundable. Please
                  ensure your date is confirmed before making payment.
                </p>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-[#C9A24D]">-</span>
                <p>
                  <strong className="text-white">Travel Fees:</strong> Travel fees may apply depending on location.
                  Contact us for a custom quote.
                </p>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-[#C9A24D]">-</span>
                <p>
                  <strong className="text-white">Availability:</strong> Limited slots available per month. Book early to
                  secure your preferred date.
                </p>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-[#C9A24D]">-</span>
                <p>
                  <strong className="text-white">No Refund Policy:</strong> All payments are final. Reschedules may be
                  accommodated subject to availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0E0E0E] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="font-display text-3xl text-white md:text-4xl">Ready to Book Your Package?</h3>
          <p className="mt-4 text-white/60">Book online or chat on WhatsApp to secure your appointment.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
            >
              Book Online
            </Link>
            <a
              href="https://wa.me/447523992614"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border-2 border-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#C9A24D] transition-colors hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
            >
              WhatsApp: +44 7523 992614
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
