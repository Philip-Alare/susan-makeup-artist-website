'use client'

import Link from "next/link"
import { Check } from "lucide-react"

import { packages, type PackageData, type Currency, normalizePackage } from "../data/packages"
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
        const mapped: PackageData[] = api.map((p: any, idx: number) => normalizePackage(p, idx))
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
    <section className="bg-white px-4 py-20" id="packages">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="section-eyebrow mb-4 text-sm">Exclusive Packages</p>
          <h2 className="font-display text-4xl text-black md:text-6xl">Glam Packages & Pricing</h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-black" />
          <p className="mx-auto mt-6 max-w-2xl text-[#666666]">
            Book your appointment today and experience the luxury of flawless glam.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {list.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-b from-white to-[#F5F5F5] ${
                index === 0 ? "border-2 border-black shadow-xs" : "border border-[#E5E5E5]"
              }`}
            >
              {index === 0 && (
                <div className="absolute right-0 top-0 bg-black px-4 py-2 text-xs tracking-wider text-[#FFFFFF]">
                  Client Favorite
                </div>
              )}

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-black">{pkg.name}</h3>
                  <div className="mt-3 flex flex-col gap-1">
                    <span className="text-4xl text-black">{pkg.displayPrice}</span>
                    <span className="text-sm text-[#666666]">Deposit: {pkg.displayDeposit} (non-refundable)</span>
                    <span className="text-xs text-[#999999]">Duration: {pkg.durationEstimate}</span>
                  </div>
                  <div className="mt-2 text-sm text-[#2A2A2A]">{pkg.description}</div>
                </div>

                <div className="mb-6 h-px w-full bg-[#E5E5E5]" />

                <ul className="mb-8 space-y-4">
                  {pkg.includes.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 flex-shrink-0 text-black" size={18} />
                      <span className="text-sm leading-relaxed text-[#2A2A2A]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {index === 0 && (
                  <p className="mb-4 text-xs italic leading-relaxed text-[#999999]">{availabilityText}</p>
                )}

                <Link
                  href={`/book?package=${pkg.id}`}
                  className={`inline-flex w-full items-center justify-center rounded px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider transition-transform hover:scale-105 ${
                    index === 0
                      ? "bg-black text-[#FFFFFF] hover:bg-[#1A1A1A]"
                      : "border-2 border-black text-black hover:bg-[#F5F5F5]"
                  }`}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] p-6 text-center">
          <p className="text-[#2A2A2A]">
            <span className="text-black">Important:</span> Limited slots available. Booking fee required.{" "}
            <span className="text-black">No refunds.</span> Travel fees may apply. Available to travel to any
            country.
          </p>
          <p className="mt-3 text-[#2A2A2A]">{availabilityText}</p>
          {!!notes.length && (
          <ul className="mt-2 text-[#666666]">
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
