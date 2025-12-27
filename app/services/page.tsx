'use client'

import Link from "next/link"
import { motion } from "motion/react"
import { Camera, Crown, GraduationCap, Palette, Plus, Sparkles } from "lucide-react"
import ImageWithFallback from "../../components/image-with-fallback"

const makeupServices = [
  {
    icon: <Crown size={40} />,
    title: "Bridal Glam",
    description:
      "The ultimate bridal makeup experience to make you look and feel flawless on your wedding day. Includes a trial session, professional application, and a long-lasting finish.",
    features: ["Bridal trial session", "Long-lasting formula", "Custom color matching", "Touch-up kit included"],
    image: "/assets/IMG-20251227-WA0036.jpg",
  },
  {
    icon: <Sparkles size={40} />,
    title: "Birthday Glam",
    description:
      "Celebrate your special day in style with a complete glam transformation. Professional makeup artistry for birthday photoshoots and celebrations.",
    features: ["Full glam makeup", "Premium skin prep", "Photoshoot ready", "Birthday shoot package available"],
    image: "/assets/IMG-20251227-WA0034.jpg",
  },
  {
    icon: <Camera size={40} />,
    title: "Event Glam",
    description:
      "Look camera-ready for any special event or occasion. Professional makeup application designed to photograph beautifully and last all day.",
    features: ["High-definition makeup", "Camera-ready finish", "All-day wear", "Special event styling"],
    image: "/assets/IMG-20251227-WA0026.jpg",
  },
  {
    icon: <Palette size={40} />,
    title: "Editorial / Photoshoot Glam",
    description:
      "High-fashion editorial makeup for photoshoots, magazine features, and creative projects. Bold, artistic looks tailored to your vision.",
    features: ["Editorial styling", "Creative concepts", "Professional collaboration", "Portfolio ready"],
    image: "/assets/IMG-20251227-WA0020.jpg",
  },
]

const addOns = [
  { icon: <Plus size={24} />, name: "Skin Prep Upgrade", description: "Hydrating, camera-ready prep tailored to your skin." },
  { icon: <Plus size={24} />, name: "Lash Styling", description: "Premium lash styling for added drama and glamour." },
  { icon: <Plus size={24} />, name: "Touch-Up Service", description: "On-site touch-ups to keep you looking flawless all day." },
]

export default function ServicesPage() {
  return (
    <div className="bg-[#0E0E0E] text-white">
      <section className="relative flex h-[50vh] items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0E0E0E]/70 to-[#0E0E0E]" />
        <ImageWithFallback
          src="/assets/IMG-20251227-WA0030.jpg"
          alt="Makeup Services"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-[#E6D1C3]"
          >
            Flawless makeup for every occasion
          </motion.p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#0E0E0E] to-[#1a1410] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl text-white md:text-5xl">Makeup Services</h2>
            <div className="mx-auto mb-6 mt-4 h-1 w-24 bg-[#C9A24D]" />
            <p className="mx-auto max-w-3xl text-lg text-white/60">
              Professional makeup services tailored to enhance your natural beauty and create unforgettable looks.
            </p>
          </div>

          <div className="space-y-16">
            {makeupServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col items-center gap-8 border border-[#C9A24D]/20 bg-[#0E0E0E] overflow-hidden ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="relative h-[400px] w-full overflow-hidden lg:w-1/2">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-8 lg:w-1/2 lg:p-12">
                  <div className="mb-4 text-[#C9A24D]">{service.icon}</div>
                  <h3 className="font-display text-3xl tracking-wider text-white">{service.title}</h3>
                  <p className="mt-4 text-white/70">{service.description}</p>

                  <div className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-white/70">
                        <span className="mr-3 text-[#C9A24D]">&bull;</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/packages"
                    className="mt-8 inline-block rounded border border-[#C9A24D] px-6 py-3 text-sm uppercase tracking-wider text-[#C9A24D] transition-colors hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
                  >
                    View Packages
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1a1410] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h3 className="font-display text-3xl text-white">Additional Services</h3>
            <div className="mx-auto mt-3 h-1 w-16 bg-[#C9A24D]" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {addOns.map((addOn, index) => (
              <motion.div
                key={addOn.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-[#C9A24D]/20 bg-[#0E0E0E] p-6 transition-all hover:border-[#C9A24D]"
              >
                <div className="mb-3 text-[#C9A24D]">{addOn.icon}</div>
                <h4 className="text-lg text-white">{addOn.name}</h4>
                <p className="mt-2 text-sm text-white/60">{addOn.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#1a1410] to-[#0E0E0E] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="border-2 border-[#C9A24D]/30 bg-[#0E0E0E] p-8 md:p-12">
            <div className="mb-6 flex items-center justify-center">
              <GraduationCap size={48} className="text-[#C9A24D]" />
            </div>
            <h2 className="font-display text-center text-4xl text-white">Makeup Training & Mentorship</h2>
            <div className="mx-auto my-6 h-1 w-24 bg-[#C9A24D]" />
            <p className="mx-auto mb-8 max-w-3xl text-center text-lg leading-relaxed text-white/70">
              Hands-on training for aspiring artists looking to refine their skills, learn professional techniques, and
              build confidence in real-world glam applications. We offer online classes for beginners, one-on-one upgrade
              sessions, and both online and physical course options.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-[#C9A24D]/20 bg-[#1a1410] p-6">
                <h4 className="mb-3 text-lg uppercase tracking-wider text-white">What You&apos;ll Learn</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Professional makeup techniques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Bridal and glam application methods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Color theory and face mapping</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Building your makeup business</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Online classes for beginners and skill upgrades</span>
                  </li>
                </ul>
              </div>

              <div className="border border-[#C9A24D]/20 bg-[#1a1410] p-6">
                <h4 className="mb-3 text-lg uppercase tracking-wider text-white">Training Format</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Hands-on practical sessions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>One-on-one mentorship</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Real client practice</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Flexible scheduling available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#C9A24D]">&bull;</span>
                    <span>Online and in-person course delivery</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/contact"
                className="inline-flex rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
              >
                Enquire About Training
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0E0E0E] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="font-display text-3xl text-white md:text-4xl">Ready to Book Your Appointment?</h3>
          <p className="mt-4 text-white/60">Limited slots available. Contact us today to secure your date.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/447523992614"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
            >
              WhatsApp: +44 7523 992614
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded border-2 border-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#C9A24D] transition-colors hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
