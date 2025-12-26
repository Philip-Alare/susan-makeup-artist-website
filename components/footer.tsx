import Link from "next/link"
import { Instagram, MessageCircle, MapPin, Phone } from "lucide-react"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0E0E0E] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="text-2xl font-semibold">
            BeautyHome<span className="text-[#C9A24D]">BySuzain</span>
          </h3>
          <p className="mt-3 text-[#E6D1C3]">Luxury Bridal & Glam Makeup Artist</p>
          <p className="text-[#E6D1C3]">Susan Eworo (Suzain)</p>
        </div>

        <div>
          <h4 className="mb-4 uppercase tracking-wider text-sm text-[#E6D1C3]">
            Quick Links
          </h4>
          <ul className="space-y-2 text-[#E6D1C3]">
            <li>
              <Link href="/services" className="transition-colors hover:text-[#C9A24D]">
                Services
              </Link>
            </li>
            <li>
              <Link href="/catalogue" className="transition-colors hover:text-[#C9A24D]">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/packages" className="transition-colors hover:text-[#C9A24D]">
                Packages & Pricing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-[#C9A24D]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 uppercase tracking-wider text-sm text-[#E6D1C3]">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-[#E6D1C3]">
            <li className="flex items-center space-x-2">
              <MapPin size={18} className="text-[#C9A24D]" />
              <span>Leeds & Bradford, UK</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin size={18} className="text-[#C9A24D]" />
              <span>Lagos, Nigeria</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={18} className="text-[#C9A24D]" />
              <a href="tel:+2347068305925" className="transition-colors hover:text-[#C9A24D]">
                +234 706 830 5925
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <MessageCircle size={18} className="text-[#C9A24D]" />
              <a
                href="https://wa.me/2347068305925"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#C9A24D]"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Instagram size={18} className="text-[#C9A24D]" />
              <a
                href="https://instagram.com/beautyhomebysuzain"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#C9A24D]"
              >
                @beautyhomebysuzain
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#6B3F2A] px-4 py-6 text-center text-[#E6D1C3]">
        <p>&copy; {year} BeautyHomeBySuzain. All rights reserved.</p>
        <p className="mt-2 text-sm">
          <strong>No refund policy</strong> | Travel available
        </p>
      </div>
    </footer>
  )
}
