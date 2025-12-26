import Link from "next/link"
import { Instagram, Phone } from "lucide-react"

export default function ContactCta() {
  return (
    <section className="bg-gradient-to-b from-[#1a1410] to-[#0E0E0E] px-4 py-16" id="contact">
      <div className="mx-auto max-w-4xl text-center">
        <h3 className="font-display text-3xl text-white md:text-4xl">Ready to Book Your Appointment?</h3>
        <p className="mt-4 text-[#E6D1C3]/80">
          Limited slots available. Reach out via WhatsApp or send us a message to secure your date.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/2347068305925"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
          >
            <Phone size={18} />
            WhatsApp Booking
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded border-2 border-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#C9A24D] transition-colors hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
          >
            Contact Page
          </Link>
          <a
            href="https://instagram.com/beautyhomebysuzain"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-[#C9A24D]/50 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#E6D1C3] transition-colors hover:border-[#C9A24D] hover:text-[#C9A24D]"
          >
            <Instagram size={18} />
            Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
