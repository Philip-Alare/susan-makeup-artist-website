import AboutSection from "../components/about-section"
import ContactCta from "../components/contact-cta"
import Hero from "../components/hero"
import PackagesSection from "../components/packages-section"
import ServicesSection from "../components/services-section"

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <PackagesSection />
      <AboutSection />
      <ContactCta />
    </>
  )
}
