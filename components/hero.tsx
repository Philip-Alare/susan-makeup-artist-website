'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1736849816780-6ca0730061a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBicmlkYWwlMjBtYWtldXAlMjBhcnRpc3R8ZW58MXx8fHwxNzY2Nzc4NzI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Luxury Bridal & Glam Makeup Artist",
    subtitle: "UK & Nigeria | Travel Available",
  },
  {
    url: "https://images.unsplash.com/photo-1763625640135-9ed6b1e5a10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjBiaXJ0aGRheSUyMG1ha2V1cHxlbnwxfHx8fDE3NjY3Nzg3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Celebrate Your Day in Style",
    subtitle: "Exclusive Birthday Glam Packages",
  },
  {
    url: "https://images.unsplash.com/photo-1578518496391-99bc1530a2c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBtYWtldXAlMjBwaG90b3Nob290fGVufDF8fHx8MTc2Njc3ODcyOXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Editorial Perfection",
    subtitle: "Your Moment to Shine",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroImages.length),
      5000,
    )
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black">
      {heroImages.map((image, index) => (
        <div
          key={image.url}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <img src={image.url} alt={image.title} className="h-full w-full object-cover" />
        </div>
      ))}

      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-display tracking-wide text-[#C9A24D] sm:text-6xl md:text-7xl">
            {heroImages[currentSlide].title}
          </h1>
          <p className="mt-4 text-xl uppercase tracking-wider text-[#E6D1C3] sm:text-2xl">
            {heroImages[currentSlide].subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-transform hover:scale-105 hover:bg-[#E6D1C3]"
            >
              Book Appointment
            </Link>
            <Link
              href="/packages"
              className="rounded border-2 border-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#C9A24D] transition-transform hover:scale-105 hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
            >
              View Packages
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-[#C9A24D]/20 p-3 text-white transition-colors hover:bg-[#C9A24D]/40"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-[#C9A24D]/20 p-3 text-white transition-colors hover:bg-[#C9A24D]/40"
      >
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 flex gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-[#C9A24D]" : "w-3 bg-[#E6D1C3]/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
