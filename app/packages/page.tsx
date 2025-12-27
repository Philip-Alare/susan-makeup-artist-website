'use client'

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Camera, Check, Crown, Phone, Sparkles } from "lucide-react"

type Package = {
  icon: ReactNode
  title: string
  badge: string
  badgeColor: string
  price: string
  originalPrice?: string
  currency: string
  description: string
  features: string[]
  breakdown?: string[]
  deliverables?: string[]
  availability?: string
  specialOffer?: string
  location?: string
  delivery?: string
  bookingFee?: string
  note?: string
  cta: string
  featured: boolean
}

const packages: Package[] = [
  {
    icon: <Crown size={48} />,
    title: "Bridal Package",
    badge: "30% OFF EMBER DISCOUNT",
    badgeColor: "bg-red-600",
    price: "GBP 350.99",
    originalPrice: "Includes premium skin prep and consultation",
    currency: "GBP",
    description:
      "The ultimate all-in-one bridal experience designed to make you look and feel flawless on your wedding day.",
    features: [
      "Bridal trial session tailored to your look and theme",
      "Premium skin prep and finish",
      "3-4 hour full glam session",
      "Professional touch-ups throughout the day",
      "Two edited videos ideal for reels or wedding memories",
    ],
    specialOffer: "Enjoy 30% off for a limited time only.",
    availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
    note: "Available across listed cities; travel worldwide by request (fees may apply).",
    cta: "Book Your Bridal Glam",
    featured: true,
  },
  {
    icon: <Sparkles size={48} />,
    title: "Birthday Glam Package",
    badge: "Exclusive",
    badgeColor: "bg-[#C9A24D]",
    price: "NGN 65,000",
    currency: "NGN",
    description: "Celebrate your special day with a luxury beauty and photography experience.",
    features: [
      "Flawless makeup application",
      "Premium skin prep and lash styling",
      "Birthday photoshoot included",
      "Booking fee: NGN 15,000 (non-refundable)",
      "Quick delivery timeline",
    ],
    breakdown: [
      "Full glam makeup session",
      "Pose direction and set styling",
      "Birthday cake photoshoot setup",
      "Professional photographer",
      "High-quality edited photos",
    ],
    availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
    cta: "Book Birthday Package",
    featured: false,
  },
  {
    icon: <Camera size={48} />,
    title: "Exclusive Birthday Shoot",
    badge: "Premium",
    badgeColor: "bg-emerald-600",
    price: "NGN 60,000",
    currency: "NGN",
    description: "Makeup photography session with cinematic video and professional editing.",
    features: [
      "30-second reel included",
      "1-2 outfit changes for variety",
      "High-quality photos edited for social",
    ],
    deliverables: [
      "Five professionally edited photos",
      "One unedited (modified) picture",
      "30-second cinematic reel",
    ],
    location: "Client-selected venue or partnered studios in the UK",
    delivery: "4-5 day delivery",
    bookingFee: "Booking fee: NGN 15,000 (covers one person only)",
    availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
    cta: "Book Birthday Shoot",
    featured: false,
  },
]

export default function PackagesPage() {
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
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden border-2 bg-[#0E0E0E] ${
                pkg.featured ? "border-[#C9A24D]" : "border-[#C9A24D]/30"
              }`}
            >
              <div className={`absolute right-6 top-6 ${pkg.badgeColor} z-10 px-4 py-2 text-xs uppercase tracking-wider`}>
                {pkg.badge}
              </div>

              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <div className="mb-6 text-[#C9A24D]">{pkg.icon}</div>
                    <h2 className="font-display text-4xl text-white">{pkg.title}</h2>
                    <div className="my-6">
                      <p className="text-5xl font-display text-[#E6D1C3]">{pkg.price}</p>
                      {pkg.originalPrice && <p className="text-sm text-white/50">{pkg.originalPrice}</p>}
                    </div>
                    <p className="leading-relaxed text-white/70">{pkg.description}</p>
                    {pkg.availability && (
                      <p className="mt-4 text-sm text-[#C9A24D]">Availability: {pkg.availability}</p>
                    )}
                  </div>

                  <div className="space-y-8 lg:col-span-2">
                    <div>
                      <h3 className="mb-4 border-b border-[#C9A24D]/20 pb-2 text-lg uppercase tracking-wider">
                        Package Includes
                      </h3>
                      <ul className="space-y-3">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start text-white/70">
                            <Check size={20} className="mr-3 mt-0.5 flex-shrink-0 text-[#C9A24D]" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {pkg.breakdown && (
                      <div>
                        <h3 className="mb-4 border-b border-[#C9A24D]/20 pb-2 text-lg uppercase tracking-wider">
                          What&apos;s Included
                        </h3>
                        <ul className="space-y-3">
                          {pkg.breakdown.map((item) => (
                            <li key={item} className="flex items-start text-white/70">
                              <Check size={20} className="mr-3 mt-0.5 flex-shrink-0 text-[#C9A24D]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pkg.deliverables && (
                      <div>
                        <h3 className="mb-4 border-b border-[#C9A24D]/20 pb-2 text-lg uppercase tracking-wider">
                          Deliverables
                        </h3>
                        <ul className="space-y-3">
                          {pkg.deliverables.map((item) => (
                            <li key={item} className="flex items-start text-white/70">
                              <Check size={20} className="mr-3 mt-0.5 flex-shrink-0 text-[#C9A24D]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-3 border border-[#C9A24D]/20 bg-[#1a1410] p-6">
                      {pkg.specialOffer && <p className="text-sm text-[#C9A24D]">Special offer: {pkg.specialOffer}</p>}
                      {pkg.location && <p className="text-sm text-white/60">Location: {pkg.location}</p>}
                      {pkg.delivery && <p className="text-sm text-white/60">Delivery: {pkg.delivery}</p>}
                      {pkg.bookingFee && <p className="text-sm text-white/60">{pkg.bookingFee}</p>}
                      {pkg.note && <p className="text-xs italic text-white/50">{pkg.note}</p>}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <a
                        href="https://wa.me/447523992614"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded bg-[#C9A24D] px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
                      >
                        <Phone size={20} />
                        {pkg.cta}
                      </a>
                      <Link
                        href="/contact"
                        className="flex flex-1 items-center justify-center rounded border-2 border-[#C9A24D] px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-[#C9A24D] transition-colors hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
                      >
                        Get More Info
                      </Link>
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
          <p className="mt-4 text-white/60">Contact us on WhatsApp or Instagram to secure your appointment.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/447523992614"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
            >
              WhatsApp: +44 7523 992614
            </a>
            <a
              href="https://instagram.com/beautyhomebysuzain"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border-2 border-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#C9A24D] transition-colors hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
            >
              Instagram DM
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
