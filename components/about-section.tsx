export default function AboutSection() {
  return (
    <section className="bg-[#0E0E0E] px-4 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-lg bg-[#C9A24D]/20" />
          <img
            src="https://images.unsplash.com/photo-1617113370852-2371f361f9fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWtldXAlMjBhcnRpc3QlMjB3b3JraW5nfGVufDF8fHx8MTc2Njc3ODcyOXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Susan Eworo - Makeup Artist"
            className="relative h-[500px] w-full rounded-lg object-cover shadow-2xl"
          />
        </div>

        <div>
          <p className="section-eyebrow mb-4 text-sm">About BeautyHomeBySuzain</p>
          <h2 className="font-display text-4xl text-[#E6D1C3] md:text-5xl">Susan Eworo (Suzain)</h2>
          <div className="my-6 h-1 w-20 bg-[#C9A24D]" />

          <p className="mb-6 leading-relaxed text-[#E6D1C3]/90">
            BeautyHomeBySuzain is a luxury makeup brand led by Susan Eworo, a celebrity and bridal makeup artist
            delivering flawless glam for weddings, birthdays, photoshoots, and special occasions across the UK and
            Nigeria.
          </p>

          <p className="mb-8 leading-relaxed text-[#E6D1C3]/90">
            With expertise in bridal transformations and high-end glam, Suzain creates stunning looks that celebrate
            confidence, beauty, and your most memorable moments.
          </p>

          <div className="mb-8 grid grid-cols-2 gap-6">
            <div className="border-l-2 border-[#C9A24D] pl-4">
              <h4 className="text-2xl text-[#C9A24D]">UK</h4>
              <p className="text-sm text-[#E6D1C3]/70">Leeds & Bradford</p>
            </div>
            <div className="border-l-2 border-[#C9A24D] pl-4">
              <h4 className="text-2xl text-[#C9A24D]">Nigeria</h4>
              <p className="text-sm text-[#E6D1C3]/70">Lagos</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#E6D1C3]/80">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C9A24D]" />
              <span className="text-sm">Travel Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C9A24D]" />
              <span className="text-sm">Limited Slots</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
