'use client'

import Link from "next/link"
import { Check } from "lucide-react"

import { formatDeposit, formatPrice, packages, type PackageData, type Currency } from "../data/packages"
import { useEffect, useState } from "react"
import { getSection } from "@/lib/api"

const defaultAvailability =
  "Serving London, Manchester, Birmingham, Leeds, Sheffield, and Bradford. Available to travel worldwide (fees may apply)."

export default function PackagesSection() {
  const [availabilityText, setAvailabilityText] = useState(defaultAvailability)
  const [notes, setNotes] = useState<string[]>([])
  const [list, setList] = useState<PackageData[]>(packages)

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getSection("packages")
        const api = Array.isArray(data?.packages) ? data.packages : []
        const mapped: PackageData[] = api.map((p: any, idx: number) => {
          const hasSplit = typeof p.currency === "string" && typeof p.price === "number"
          const m = !hasSplit ? String(p.price || "").match(/^([A-Z]{3}|[^\w\s])?\s*([\d,]+(?:\.\d+)?)$/) : null
          const currency: Currency = hasSplit ? (p.currency as Currency) : "GBP"
          const value = hasSplit ? Number(p.price) : m?.[2] ? Number(String(m[2]).replace(/,/g, "")) : Number(String(p.price || "").replace(/[^0-9.]/g, "")) || 0
          
          // Parse deposit which might be "GBP 50" or just number
          const mDep = typeof p.deposit === "string" ? p.deposit.match(/^([A-Z]{3}|[^\w\s])?\s*([\d,]+(?:\.\d+)?)$/) : null
          const depositVal = typeof p.deposit === "number" ? p.deposit : mDep ? Number(String(mDep[2]).replace(/,/g, "")) : Number(String(p.deposit || "").replace(/[^0-9.]/g, "")) || 0

          return {
            id: typeof p.id === "string" && p.id ? p.id : `${String(p.name || "Package").toLowerCase().replace(/\s+/g, "-")}-${idx}`,
            name: p.name || `Package ${idx + 1}`,
            description: p.description || p.originalPrice || "",
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
            availability: (p.availability as any) || "BOTH",
          }
        })
        if (mapped.length) setList(mapped)
        const avail =
          api[0]?.availability || api[1]?.availability || api[2]?.availability || data?.availability || null
        if (typeof avail === "string" && avail) setAvailabilityText(avail)
        const noteList = api.map((p: any) => p.note).filter(Boolean)
        if (noteList.length) setNotes(noteList)
      } catch {
        /* keep defaults */
      }
    })()
  }, [])

  return (
    <section className="bg-[#fffaf2] px-4 py-20" id="packages">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="section-eyebrow mb-4 text-sm">Exclusive Packages</p>
          <h2 className="font-display text-4xl text-[#2c1a0a] md:text-6xl">Glam Packages & Pricing</h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#C9A24D]" />
          <p className="mx-auto mt-6 max-w-2xl text-[#8c6235]">
            Book your appointment today and experience the luxury of flawless glam.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {list.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-b from-white to-[#f6ecdc] ${
                index === 0 ? "border-2 border-[#C9A24D] shadow-2xl shadow-[#C9A24D]/25" : "border border-[#C9A24D]/30"
              }`}
            >
              {index === 0 && (
                <div className="absolute right-0 top-0 bg-[#C9A24D] px-4 py-2 text-xs tracking-wider text-[#1c1208]">
                  Client Favorite
                </div>
              )}

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-[#2c1a0a]">{pkg.name}</h3>
                  <div className="mt-3 flex flex-col gap-1">
                    <span className="text-4xl text-[#b1781d]">{formatPrice(pkg)}</span>
                    <span className="text-sm text-[#5a4632]">Deposit: {formatDeposit(pkg)} (non-refundable)</span>
                    <span className="text-xs text-[#5a4632]/80">Duration: {pkg.durationEstimate}</span>
                  </div>
                  <div className="mt-2 text-sm text-[#5a4632]">{pkg.description}</div>
                </div>

                <div className="mb-6 h-px w-full bg-[#C9A24D]/20" />

                <ul className="mb-8 space-y-4">
                  {pkg.includes.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 flex-shrink-0 text-[#C9A24D]" size={18} />
                      <span className="text-sm leading-relaxed text-[#5a4632]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {index === 0 && (
                  <p className="mb-4 text-xs italic leading-relaxed text-[#5a4632]/75">{availabilityText}</p>
                )}

                <Link
                  href={`/book?package=${pkg.id}`}
                  className={`inline-flex w-full items-center justify-center rounded px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider transition-transform hover:scale-105 ${
                    index === 0
                      ? "bg-[#C9A24D] text-[#1c1208] hover:bg-[#e8d6b5]"
                      : "border-2 border-[#C9A24D] text-[#c08b2f] hover:bg-[#C9A24D] hover:text-[#1c1208]"
                  }`}
                >
                  Book This Package
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-[#C9A24D]/30 bg-[#f9f0de] p-6 text-center">
          <p className="text-[#7a5328]">
            <span className="text-[#C9A24D]">Important:</span> Limited slots available. Booking fee required.{" "}
            <span className="text-[#C9A24D]">No refunds.</span> Travel fees may apply. Available to travel to any
            country.
          </p>
          <p className="mt-3 text-[#7a5328]">{availabilityText}</p>
          {!!notes.length && (
            <ul className="mt-2 text-[#7a5328]/90">
              {notes.slice(0, 3).map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
