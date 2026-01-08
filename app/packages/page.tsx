'use client'

import Link from "next/link"
import { motion } from "motion/react"
import { Camera, Check, Crown, Phone, Sparkles } from "lucide-react"

import { packages, type PackageData, type Currency, normalizePackage } from "../../data/packages"
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
          const mapped: PackageData[] = api.map((p: any, idx: number) => normalizePackage(p, idx))
          setList(mapped)
        }
      } catch {
        /* keep defaults */
      }
    })()
  }, [])

  return (
    <div className="bg-white text-black">
      <section className="bg-gradient-to-b from-white to-[#F5F5F5] px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl"
          >
            Luxury Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-[#666666]"
          >
            Exclusive makeup packages designed for your special moments.
          </motion.p>
          <div className="mx-auto mt-4 h-1 w-24 bg-black" />
          <p className="mt-4 text-[#666666]">Limited slots available. No refund policy applies to all bookings.</p>
        </div>
      </section>

      <section className="bg-[#F5F5F5] px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-12">
          {list.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden border-2 bg-white ${
                index === 0 ? "border-black" : "border-[#E5E5E5]"
              }`}
            >
              {index === 0 && (
                <div className="absolute right-6 top-6 bg-black z-10 px-4 py-2 text-xs uppercase tracking-wider text-[#FFFFFF]">
                  Client&nbsp;Favorite
                </div>
              )}

              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <div className="mb-6 text-black">{iconFor(pkg)}</div>
                    <h2 className="font-display text-4xl text-black">{pkg.name}</h2>
                    <div className="my-6">
                      <p className="text-5xl font-display text-black">{pkg.displayPrice}</p>
                      {pkg.deposit > 0 && (
                        <p className="text-sm text-[#666666]">Deposit: {pkg.displayDeposit} (non-refundable)</p>
                      )}
                      <p className="text-sm text-[#666666] mt-1">Duration: {pkg.durationEstimate}</p>
                    </div>
                    <p className="leading-relaxed text-[#666666]">{pkg.description}</p>
                    <p className="mt-4 text-sm text-black">{availabilityText}</p>
                  </div>

                  <div className="space-y-8 lg:col-span-2">
                    <div>
                      <h3 className="mb-4 border-b border-[#E5E5E5] pb-2 text-lg uppercase tracking-wider">
                        Package Includes
                      </h3>
                      <ul className="space-y-3">
                        {pkg.includes.map((feature) => (
                          <li key={feature} className="flex items-start text-[#666666]">
                            <Check size={20} className="mr-3 mt-0.5 flex-shrink-0 text-black" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 border border-[#E5E5E5] bg-[#F5F5F5] p-6">
                      <p className="text-sm text-black">Travel worldwide on request (fees may apply).</p>
                      <p className="text-sm text-[#666666]">Limited slots available per month. Book early to secure.</p>
                      <p className="text-xs italic text-[#666666]">
                        All booking fees are non-refundable. Reschedules subject to availability.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Link
                        href={`/book?package=${pkg.id}`}
                        className="flex flex-1 items-center justify-center rounded bg-black px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] transition-colors hover:bg-[#1A1A1A]"
                      >
                        Book This Package
                      </Link>
                      <a
                        href="https://wa.me/447523992614"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded border-2 border-black px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-[#F5F5F5]"
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

      <section className="bg-gradient-to-b from-[#F5F5F5] to-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-[#E5E5E5] bg-white p-8">
            <h3 className="font-display text-center text-2xl text-black">Important Information</h3>
            <div className="mt-6 space-y-4 text-[#666666]">
              <div className="flex items-start">
                <span className="mr-3 text-black">-</span>
                <p>
                  <strong className="text-black">Booking Policy:</strong> All booking fees are non-refundable. Please
                  ensure your date is confirmed before making payment.
                </p>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-black">-</span>
                <p>
                  <strong className="text-black">Travel Fees:</strong> Travel fees may apply depending on location.
                  Contact us for a custom quote.
                </p>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-black">-</span>
                <p>
                  <strong className="text-black">Availability:</strong> Limited slots available per month. Book early to
                  secure your preferred date.
                </p>
              </div>
              <div className="flex items-start">
                <span className="mr-3 text-black">-</span>
                <p>
                  <strong className="text-black">No Refund Policy:</strong> All payments are final. Reschedules may be
                  accommodated subject to availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="font-display text-3xl text-[#FFFFFF] md:text-4xl">Ready to Book Your Package?</h3>
          <p className="mt-4 text-[#FFFFFF]/60">Book online or chat on WhatsApp to secure your appointment.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-[#F5F5F5]"
            >
              Book Online
            </Link>
            <a
              href="https://wa.me/447523992614"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border-2 border-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] transition-colors hover:bg-white hover:text-black"
            >
              WhatsApp: +44 7523 992614
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
