'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroImages = [
  {
    url: "/assets/IMG-20251227-WA0030.jpg",
    title: "Luxury Bridal & Glam Makeup Artist",
    subtitle: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford | Available to travel worldwide",
  },
  {
    url: "/assets/IMG-20251227-WA0032.jpg",
    title: "Celebrate Your Day in Style",
    subtitle: "Exclusive Birthday Glam Packages",
  },
  {
    url: "/assets/IMG-20251227-WA0028.jpg",
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
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#f8f1e3]/25 to-[#f3e8d9]/35" />
          <img src={image.url} alt={image.title} className="h-full w-full object-cover object-top" />
        </div>
      ))}

      <div className="relative z-20 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-display tracking-wide text-[#c08b2f] sm:text-6xl md:text-7xl">
            {heroImages[currentSlide].title}
          </h1>
          <p className="mt-4 text-xl uppercase tracking-wider text-[#5a4632] sm:text-2xl">
            {heroImages[currentSlide].subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#1c1208] transition-transform hover:scale-105 hover:bg-[#e8d6b5]"
            >
              Book Appointment
            </Link>
            <Link
              href="/packages"
              className="rounded border-2 border-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#c08b2f] transition-transform hover:scale-105 hover:bg-[#C9A24D] hover:text-[#1c1208]"
            >
              View Packages
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-[#C9A24D]/20 p-3 text-[#1c1208] transition-colors hover:bg-[#C9A24D]/40"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-[#C9A24D]/20 p-3 text-[#1c1208] transition-colors hover:bg-[#C9A24D]/40"
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
