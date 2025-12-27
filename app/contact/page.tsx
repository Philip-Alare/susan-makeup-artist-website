'use client'

import { motion } from "motion/react"
import { Clock, Instagram, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="bg-[#0E0E0E] text-white">
      <section className="bg-gradient-to-b from-[#0E0E0E] to-[#1a1410] px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)]"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-[#fdf7ec] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
          >
            Book your appointment today.
          </motion.p>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#C9A24D]" />
        </div>
      </section>

      <section className="bg-[#1a1410] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.a
              href="https://wa.me/447523992614"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group border-2 border-[#C9A24D]/30 bg-[#0E0E0E] p-8 transition-all hover:border-[#C9A24D]"
            >
              <div className="flex items-start gap-6">
                <div className="bg-[#C9A24D]/10 p-4 transition-colors group-hover:bg-[#C9A24D]/20">
                  <Phone size={32} className="text-[#C9A24D]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl uppercase tracking-wider">WhatsApp Booking</h3>
                  <p className="mt-2 text-white/60">Book directly via WhatsApp for instant confirmation.</p>
                  <p className="mt-3 text-lg text-[#C9A24D]">+44 7523 992614</p>
                  <p className="mt-2 text-sm text-white/40">Tap to chat now.</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href="https://instagram.com/beautyhomebysuzain"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group border-2 border-[#C9A24D]/30 bg-[#0E0E0E] p-8 transition-all hover:border-[#C9A24D]"
            >
              <div className="flex items-start gap-6">
                <div className="bg-[#C9A24D]/10 p-4 transition-colors group-hover:bg-[#C9A24D]/20">
                  <Instagram size={32} className="text-[#C9A24D]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl uppercase tracking-wider">Instagram DM</h3>
                  <p className="mt-2 text-white/60">Send us a direct message on Instagram.</p>
                  <p className="mt-3 text-lg text-[#C9A24D]">@beautyhomebysuzain</p>
                  <p className="mt-2 text-sm text-white/40">Follow and message us.</p>
                </div>
              </div>
            </motion.a>
          </div>

          <div className="mt-16 border-2 border-[#C9A24D]/30 bg-[#0E0E0E] p-8">
            <h3 className="font-display text-center text-3xl text-white">Business Information</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <MapPin size={24} className="mt-1 flex-shrink-0 text-[#C9A24D]" />
                <div>
                  <h4 className="text-lg uppercase tracking-wider">Locations</h4>
                  <div className="mt-3 space-y-2 text-white/70">
                    <p>London</p>
                    <p>Manchester</p>
                    <p>Birmingham</p>
                    <p>Leeds</p>
                    <p>Sheffield</p>
                    <p>Bradford</p>
                    <p className="mt-3 text-[#C9A24D]">Available to travel to any country.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={24} className="mt-1 flex-shrink-0 text-[#C9A24D]" />
                <div>
                  <h4 className="text-lg uppercase tracking-wider">Availability</h4>
                  <div className="mt-3 space-y-2 text-white/70">
                    <p>By appointment only</p>
                    <p>Limited slots available</p>
                    <p className="mt-3 text-sm text-white/50">Book in advance to secure your preferred date.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#1a1410] to-[#0E0E0E] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="border-2 border-[#C9A24D]/30 bg-[#0E0E0E] p-8">
            <h3 className="font-display text-center text-2xl text-white">Booking Guidelines</h3>
            <div className="mt-6 space-y-6">
              <div className="border-l-4 border-[#C9A24D] pl-6">
                <h4 className="text-sm uppercase tracking-wider text-white">Booking Fee Required</h4>
                <p className="text-sm text-white/70">
                  A booking fee is required to secure your appointment. This fee is non-refundable and will be deducted
                  from your total package cost.
                </p>
              </div>
              <div className="border-l-4 border-[#C9A24D] pl-6">
                <h4 className="text-sm uppercase tracking-wider text-white">No Refund Policy</h4>
                <p className="text-sm text-white/70">
                  All payments are final. Please ensure your date is confirmed before booking. Reschedules may be
                  accommodated based on availability.
                </p>
              </div>
              <div className="border-l-4 border-[#C9A24D] pl-6">
                <h4 className="text-sm uppercase tracking-wider text-white">Travel Fees</h4>
                <p className="text-sm text-white/70">
                  Travel fees may apply depending on your location. Contact us for a detailed quote specific to your
                  area.
                </p>
              </div>
              <div className="border-l-4 border-[#C9A24D] pl-6">
                <h4 className="text-sm uppercase tracking-wider text-white">Limited Availability</h4>
                <p className="text-sm text-white/70">
                  We have limited slots available each month. Book early to secure your preferred date and time,
                  especially for bridal and special event bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0E0E0E] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="font-display text-3xl text-white md:text-4xl">Follow Our Journey</h3>
          <p className="mt-4 text-white/60">
            Stay updated with our latest work, exclusive offers, and beauty tips.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href="https://instagram.com/beautyhomebysuzain"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#C9A24D] transition-colors hover:text-[#E6D1C3]"
            >
              <Instagram size={32} />
              <span className="text-lg">@beautyhomebysuzain</span>
            </a>
          </div>

          <div className="mt-12 border border-[#C9A24D]/20 bg-[#1a1410] p-8">
            <p className="text-white/60">Have questions? Need more information about our services?</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
              href="https://wa.me/447523992614"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
            >
              WhatsApp: +44 7523 992614
            </a>
              <a
                href="https://instagram.com/beautyhomebysuzain"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border-2 border-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#C9A24D] transition-colors hover:bg-[#C9A24D] hover:text-[#0E0E0E]"
              >
                Instagram Direct
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#0E0E0E] to-[#1a1410] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="border border-[#C9A24D]/20 bg-[#0E0E0E] p-12 text-center">
            <MapPin size={48} className="mx-auto mb-6 text-[#C9A24D]" />
            <h3 className="font-display text-2xl text-white">Service Areas</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h4 className="text-xl text-white">United Kingdom</h4>
                <p className="text-white/60">London · Manchester · Birmingham</p>
                <p className="text-white/60">Leeds · Sheffield · Bradford</p>
                <p className="mt-2 text-sm text-white/50">Full coverage across these cities.</p>
              </div>
              <div>
                <h4 className="text-xl text-white">Worldwide Travel</h4>
                <p className="text-white/60">Available to travel to any country.</p>
                <p className="mt-2 text-sm text-white/50">Get in touch for bespoke bookings.</p>
              </div>
            </div>
            <p className="mt-8 text-[#C9A24D]">Travel available to any location globally.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
