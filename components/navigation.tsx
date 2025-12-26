'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/catalogue", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const linkClasses = (href: string) =>
    `text-sm tracking-wide transition-colors ${
      pathname === href ? "text-[#C9A24D]" : "text-[#E6D1C3]"
    } hover:text-[#C9A24D]`

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#C9A24D]/20 bg-[#0E0E0E]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-wider text-[#C9A24D]">
          BeautyHomeBySuzain
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded bg-[#C9A24D] px-6 py-2.5 text-sm font-semibold text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
          >
            Book Now
          </Link>
        </div>

        <button
          className="md:hidden text-[#C9A24D]"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-[#C9A24D]/20 bg-[#0E0E0E] px-4 py-6 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={linkClasses(link.href)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block rounded bg-[#C9A24D] px-6 py-3 text-center text-sm font-semibold text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}
