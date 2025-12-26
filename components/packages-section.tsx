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
      "Hair installation (available at an extra cost)",
      "Professional reels with smooth transitions",
      "Two edited videos perfect for reels or wedding memories",
      "Travel available by request",
    ],
    note: "Available across London and surrounding areas. Pricing may vary depending on location and time of booking (travel or early-slot fees may apply).",
    highlight: true,
  },
  {
    name: "Birthday Glam Package",
    price: "NGN 65,000",
    features: [
      "Flawless makeup application",
      "Professional hair installation",
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
      "Five high-quality phone pictures",
      "1-3 flawless makeup looks to match your style",
      "Expert photography session",
      "Location: Ozone Cinema, Sabo Yaba, Lagos",
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
    <section className="bg-[#0E0E0E] px-4 py-20" id="packages">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="section-eyebrow mb-4 text-sm">Exclusive Packages</p>
          <h2 className="font-display text-4xl text-[#E6D1C3] md:text-6xl">Glam Packages & Pricing</h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#C9A24D]" />
          <p className="mx-auto mt-6 max-w-2xl text-[#E6D1C3]/80">
            Book your appointment today and experience the luxury of flawless glam.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-b from-[#1a1410] to-[#0E0E0E] ${
                pkg.highlight
                  ? "border-2 border-[#C9A24D] shadow-2xl shadow-[#C9A24D]/20"
                  : "border border-[#C9A24D]/20"
              }`}
            >
              {pkg.badge && (
                <div className="absolute right-0 top-0 bg-[#C9A24D] px-4 py-2 text-xs tracking-wider text-[#0E0E0E]">
                  {pkg.badge}
                </div>
              )}

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-[#E6D1C3]">
                    {pkg.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    {pkg.originalPrice && (
                      <span className="text-xl text-[#E6D1C3]/40 line-through">{pkg.originalPrice}</span>
                    )}
                    <span className="text-4xl text-[#C9A24D]">{pkg.price}</span>
                  </div>
                </div>

                <div className="mb-6 h-px w-full bg-[#C9A24D]/20" />

                <ul className="mb-8 space-y-4">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 flex-shrink-0 text-[#C9A24D]" size={18} />
                      <span className="text-sm leading-relaxed text-[#E6D1C3]/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.deliverables && (
                  <>
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="text-[#C9A24D]" size={18} />
                      <h4 className="text-xs uppercase tracking-wider text-[#E6D1C3]">Deliverables</h4>
                    </div>
                    <ul className="mb-8 space-y-3">
                      {pkg.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#C9A24D]" />
                          <span className="text-sm leading-relaxed text-[#E6D1C3]/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {pkg.note && (
                  <p className="mb-6 text-xs italic leading-relaxed text-[#E6D1C3]/60">{pkg.note}</p>
                )}

                <Link
                  href="/contact"
                  className={`inline-flex w-full items-center justify-center rounded px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider transition-transform hover:scale-105 ${
                    pkg.highlight
                      ? "bg-[#C9A24D] text-[#0E0E0E] hover:bg-[#E6D1C3]"
                      : "border-2 border-[#C9A24D] text-[#C9A24D] hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
                  }`}
                >
                  Book This Package
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-[#C9A24D]/30 bg-[#7A4A33]/20 p-6 text-center">
          <p className="text-[#E6D1C3]/90">
            <span className="text-[#C9A24D]">Important:</span> Limited slots available. Booking fee required.{" "}
            <span className="text-[#C9A24D]">No refunds.</span> Travel fees may apply.
          </p>
        </div>
      </div>
    </section>
  )
}
