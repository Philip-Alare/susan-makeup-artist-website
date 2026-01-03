'use client'

import Link from "next/link"
import { Camera, GraduationCap, Heart, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { getSection } from "@/lib/api"

const defaultServices = [
  {
    icon: Heart,
    title: "Bridal Glam",
    description:
      "Flawless bridal makeup designed to make you shine on your special day. Includes trial sessions and a luxury experience.",
    highlights: ["Trial session", "Full bridal look", "Touch-up service"],
  },
  {
    icon: Sparkles,
    title: "Birthday Glam",
    description:
      "Celebrate in style with birthday glam packages that cover makeup and photoshoot-ready finishes.",
    highlights: ["Signature glam", "Birthday photoshoot", "Edited photos"],
  },
  {
    icon: Camera,
    title: "Editorial Glam",
    description:
      "Professional makeup for photoshoots, events, and special occasions. High-definition, camera-ready perfection.",
    highlights: ["HD makeup", "Event ready", "Long-lasting"],
  },
  {
    icon: GraduationCap,
    title: "Makeup Training",
    description:
      "Hands-on training for aspiring makeup artists. Learn professional techniques and build confidence.",
    highlights: ["One-on-one training", "Pro tips", "Certificate"],
  },
]

export default function ServicesSection() {
  const [services, setServices] = useState(defaultServices)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getSection("services")
        const list = Array.isArray(data?.services) ? data.services : []
        if (list.length) {
          const mapped = list.map((s: any) => ({
            icon:
              /bridal/i.test(s.title) ? Heart :
              /birthday/i.test(s.title) ? Sparkles :
              /editorial|photoshoot/i.test(s.title) ? Camera :
              /training/i.test(s.title) ? GraduationCap :
              Sparkles,
            title: s.title,
            description: s.description,
            highlights: s.features || s.deliverables || [],
          }))
          setServices(mapped)
        }
      } catch {
        /* keep defaults */
      }
    })()
  }, [])

  return (
    <section className="bg-gradient-to-b from-[#fffaf2] via-[#f5ecdc] to-[#f3e8d9] px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="section-eyebrow mb-4 text-sm text-[#b1781d]">What We Offer</p>
          <h2 className="font-display text-4xl text-[#2c1a0a] md:text-6xl">Luxury Makeup Services</h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#C9A24D]" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="rounded-lg border border-[#C9A24D]/30 bg-white p-8 shadow-xs transition-all hover:border-[#C9A24D] hover:shadow-[#C9A24D]/15"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24D]/15">
                  <Icon className="text-[#C9A24D]" size={28} />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-[#2c1a0a]">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#5a4632]">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-xs uppercase text-[#5a4632]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24D]" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-16 rounded-lg bg-gradient-to-r from-[#f7e8c3] via-[#f3dda7] to-[#e7c77b] p-10 text-center md:p-12">
          <h3 className="font-display text-3xl uppercase text-[#2c1a0a] md:text-4xl">
            Makeup Training & Mentorship
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-[#4a3320]">
            Hands-on training for aspiring artists looking to refine their skills, learn professional techniques, and
            build confidence in real-world glam applications.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex rounded bg-[#C9A24D] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#1c1208] transition-colors hover:bg-[#e8d6b5]"
            >
              Enquire About Training
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
