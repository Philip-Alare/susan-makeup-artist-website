import Link from "next/link"
import { Check, Sparkles } from "lucide-react"

const packages = [
  {
    name: "Bridal Package",
    badge: "30% OFF EMBER DISCOUNT",
    price: "GBP 350.99",
    originalPrice: "GBP 500",
    features: [
      "Bridal trial session tailored to your style and theme",
      "3-4 hour full glam session on your wedding day",
      "Premium skin prep and finish",
      "Professional reels with smooth transitions",
      "Two edited videos perfect for reels or wedding memories",
      "Travel available by request",
    ],
    note: "Serving London, Manchester, Birmingham, Leeds, Sheffield, and Bradford. Travel worldwide on request (fees may apply).",
    highlight: true,
  },
  {
    name: "Birthday Glam Package",
    price: "NGN 65,000",
    features: [
      "Flawless makeup application",
      "Premium skin prep and lash styling",
      "Exclusive birthday photoshoot",
      "High-quality edited photos",
      "Non-refundable booking fee: NGN 15,000",
      "Balance due before or on appointment day",
    ],
    note: "Photos ready within 4-5 days of your session.",
    highlight: false,
  },
  {
    name: "Exclusive Birthday Shoot",
    price: "NGN 60,000",
    features: [
      "30-second reel-ready makeup photography session",
      "Up to three outfit changes",
      "Five high-quality photos",
      "1-3 flawless makeup looks to match your style",
      "Expert photography session",
      "Available at partnered studios or client venues",
    ],
    deliverables: [
      "Five professionally edited photos",
      "30-second cinematic reel",
      "Fast 4-5 day delivery",
    ],
    note: "Booking fee covers one person only.",
    highlight: false,
  },
]

export default function PackagesSection() {
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
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-b from-white to-[#f6ecdc] ${
                pkg.highlight
                  ? "border-2 border-[#C9A24D] shadow-2xl shadow-[#C9A24D]/25"
                  : "border border-[#C9A24D]/30"
              }`}
            >
              {pkg.badge && (
                <div className="absolute right-0 top-0 bg-[#C9A24D] px-4 py-2 text-xs tracking-wider text-[#1c1208]">
                  {pkg.badge}
                </div>
              )}

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-[#2c1a0a]">
                    {pkg.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    {pkg.originalPrice && (
                      <span className="text-xl text-[#b1781d]/55 line-through">{pkg.originalPrice}</span>
                    )}
                    <span className="text-4xl text-[#b1781d]">{pkg.price}</span>
                  </div>
                </div>

                <div className="mb-6 h-px w-full bg-[#C9A24D]/20" />

                <ul className="mb-8 space-y-4">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 flex-shrink-0 text-[#C9A24D]" size={18} />
                      <span className="text-sm leading-relaxed text-[#5a4632]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.deliverables && (
                  <>
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="text-[#C9A24D]" size={18} />
                      <h4 className="text-xs uppercase tracking-wider text-[#2c1a0a]">Deliverables</h4>
                    </div>
                    <ul className="mb-8 space-y-3">
                      {pkg.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#C9A24D]" />
                          <span className="text-sm leading-relaxed text-[#5a4632]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {pkg.note && (
                  <p className="mb-6 text-xs italic leading-relaxed text-[#5a4632]/75">{pkg.note}</p>
                )}

                <Link
                  href="/contact"
                  className={`inline-flex w-full items-center justify-center rounded px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider transition-transform hover:scale-105 ${
                    pkg.highlight
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
            <span className="text-[#C9A24D]">No refunds.</span> Travel fees may apply.
          </p>
        </div>
      </div>
    </section>
  )
}
