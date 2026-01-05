import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter, Playfair_Display } from "next/font/google"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.beautyhomebysuzain.com"),
  title: "BeautyHomeBySuzain | Luxury Bridal & Glam Makeup",
  description:
    "Luxury bridal and glam makeup artist serving London, Manchester, Birmingham, Leeds, Sheffield, and Bradford — available to travel worldwide.",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} min-h-screen bg-background text-foreground`}
      >
        <Navigation />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
