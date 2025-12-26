import Link from "next/link"
import { Camera, GraduationCap, Heart, Sparkles } from "lucide-react"

const services = [
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
      "Celebrate in style with birthday glam packages that cover makeup, hair, and photoshoot-ready finishes.",
    highlights: ["Makeup & hair", "Birthday photoshoot", "Edited photos"],
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
  return (
    <section className="bg-gradient-to-b from-[#0E0E0E] to-[#1a1410] px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="section-eyebrow mb-4 text-sm">What We Offer</p>
          <h2 className="font-display text-4xl text-[#E6D1C3] md:text-6xl">Luxury Makeup Services</h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#C9A24D]" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="rounded-lg border border-[#C9A24D]/20 bg-[#0E0E0E] p-8 shadow-xs transition-all hover:border-[#C9A24D] hover:shadow-[#C9A24D]/10"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24D]/10">
                  <Icon className="text-[#C9A24D]" size={28} />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-[#E6D1C3]">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#E6D1C3]/80">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-xs uppercase text-[#E6D1C3]/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24D]" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-16 rounded-lg bg-gradient-to-r from-[#6B3F2A] to-[#7A4A33] p-10 text-center md:p-12">
          <h3 className="font-display text-3xl uppercase text-[#E6D1C3] md:text-4xl">
            Makeup Training & Mentorship
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-[#E6D1C3]/90">
            Hands-on training for aspiring artists looking to refine their skills, learn professional techniques, and
            build confidence in real-world glam applications.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex rounded bg-[#C9A24D] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
            >
              Enquire About Training
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
