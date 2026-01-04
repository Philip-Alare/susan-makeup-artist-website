'use client'

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { X } from "lucide-react"
import ImageWithFallback from "../../components/image-with-fallback"
import { getSection, withSite } from "@/lib/api"

type PortfolioItem = {
  id: number
  media: string
  category: "bridal" | "birthday" | "glam" | "editorial"
  title: string
  description: string
  alt: string
}

const portfolioItems: PortfolioItem[] = [
  // Bridal
  {
    id: 1,
    media: "/assets/IMG-20251227-WA0014.jpg",
    category: "bridal",
    title: "Bridal Portrait",
    description: "Soft bridal glam with luminous skin and bouquet.",
    alt: "Bridal portrait holding a bouquet with soft glam makeup",
  },
  {
    id: 2,
    media: "/assets/IMG-20251227-WA0018.jpg",
    category: "bridal",
    title: "Golden Bridal Glam",
    description: "Warm tones and structured eye look for wedding day.",
    alt: "Bride with golden glam makeup and neutral lip",
  },
  {
    id: 3,
    media: "/assets/IMG-20251227-WA0019.jpg",
    category: "bridal",
    title: "Flawless Finish",
    description: "Radiant skin with soft blush and liner for vows.",
    alt: "Close-up bridal beauty look with radiant complexion",
  },
  {
    id: 4,
    media: "/assets/IMG-20251227-WA0028.jpg",
    category: "bridal",
    title: "Bridal Grace",
    description: "Timeless elegance with glossy lip and defined eyes.",
    alt: "Bride in white dress with classic glam makeup",
  },
  {
    id: 5,
    media: "/assets/VID-20251227-WA0045.mp4",
    category: "bridal",
    title: "Bridal Glow Motion",
    description: "Looping bridal glam reel showcasing flawless finish.",
    alt: "Looping bridal glam video showing glowing makeup",
  },
  {
    id: 6,
    media: "/assets/VID-20251227-WA0037.mp4",
    category: "bridal",
    title: "Trial Session Motion",
    description: "Behind-the-scenes bridal prep captured in motion.",
    alt: "Looping video of bride during makeup prep",
  },
  {
    id: 7,
    media: "/assets/VID-20251227-WA0043.mp4",
    category: "bridal",
    title: "Bridal Details",
    description: "Close-up reel highlighting shimmer and lashes.",
    alt: "Looping close-up bridal glam video with shimmer details",
  },

  // Birthday
  {
    id: 8,
    media: "/assets/IMG-20251227-WA0016.jpg",
    category: "birthday",
    title: "Birthday Glam",
    description: "Celebration-ready makeup with bold lip.",
    alt: "Birthday glam portrait with bold red lipstick",
  },
  {
    id: 9,
    media: "/assets/IMG-20251227-WA0017.jpg",
    category: "birthday",
    title: "Party Ready",
    description: "Flawless base and statement eyes for the occasion.",
    alt: "Birthday makeup look with soft waves and nude lip",
  },
  {
    id: 10,
    media: "/assets/IMG-20251227-WA0020.jpg",
    category: "birthday",
    title: "Glam in Gold",
    description: "Golden tones and glowing skin for birthday shoot.",
    alt: "Birthday shoot makeup with golden dress and glam",
  },
  {
    id: 11,
    media: "/assets/IMG-20251227-WA0030.jpg",
    category: "birthday",
    title: "Radiant Celebration",
    description: "High-gloss finish and fluttery lashes.",
    alt: "Birthday glam portrait with glossy lips and lashes",
  },
  {
    id: 12,
    media: "/assets/VID-20251227-WA0044.mp4",
    category: "birthday",
    title: "Birthday Sparkle",
    description: "Looping reel of sparkling birthday glam.",
    alt: "Looping birthday glam video with sparkle details",
  },
  {
    id: 13,
    media: "/assets/VID-20251227-WA0046.mp4",
    category: "birthday",
    title: "Birthday Reels",
    description: "Movement-focused reel for birthday transformation.",
    alt: "Looping birthday makeover video",
  },

  // Glam
  {
    id: 14,
    media: "/assets/464066441_18464962738001599_1785631599972269718_n.jpg",
    category: "glam",
    title: "Modern Glam",
    description: "Bold lashes with cool-toned blonde waves.",
    alt: "Close-up glam look with blonde waves and bold lashes",
  },
  {
    id: 15,
    media: "/assets/465163931_18467386522001599_3279204667309139186_n.jpg",
    category: "glam",
    title: "Red Carpet Glam",
    description: "Statement red lip with sleek silver hair.",
    alt: "Glam portrait with red lipstick and silver hair",
  },
  {
    id: 16,
    media: "/assets/472386974_18479647309001599_4460260269162410280_n.jpg",
    category: "glam",
    title: "Smoky Fringe",
    description: "Smoky eye and nude lip framed by soft fringe.",
    alt: "Glam look with smoky eyes and straight fringe",
  },
  {
    id: 17,
    media: "/assets/474980801_18483432556001599_8644868303585455120_n.jpg",
    category: "glam",
    title: "Silver Waves",
    description: "Voluminous silver curls with sculpted glam.",
    alt: "Glam portrait with silver curly hair and defined makeup",
  },
  {
    id: 18,
    media: "/assets/499715425_1027152582376587_5700509961139003638_n.jpg",
    category: "glam",
    title: "Sheer Glow",
    description: "Dewy finish with soft pink tones.",
    alt: "Close-up glam with sheer pink tones and soft curls",
  },
  {
    id: 19,
    media: "/assets/503352745_1042797387789519_8539407518781522875_n.jpg",
    category: "glam",
    title: "Pearl Glam",
    description: "Sculpted cheekbones and glossy lip.",
    alt: "Glam portrait with pearl earrings and glossy lips",
  },
  {
    id: 20,
    media: "/assets/503723098_1782770865787136_4725173635377146930_n.jpg",
    category: "glam",
    title: "Luxe Red Lip",
    description: "High-shine red lip with soft curls.",
    alt: "Close-up red lipstick glam with silver hair",
  },
  {
    id: 21,
    media: "/assets/505760753_1600241367312812_3601516657950385119_n.jpg",
    category: "glam",
    title: "Midnight Sparkle",
    description: "Sequin ensemble with flawless glam finish.",
    alt: "Glam shot with sequin outfit and sleek ponytail",
  },
  {
    id: 22,
    media: "/assets/541132952_18525327943001599_7963877940994144732_n.jpg",
    category: "glam",
    title: "Golden Bronze",
    description: "Warm bronze tones with radiant skin.",
    alt: "Glam portrait with golden bronze makeup",
  },
  {
    id: 23,
    media: "/assets/542137589_18525327814001599_3930867530632746288_n.jpg",
    category: "glam",
    title: "Sleek Glam",
    description: "Glossy lip and sleek straight hair.",
    alt: "Close-up glam with sleek straight hair and nude lips",
  },
  {
    id: 24,
    media: "/assets/IMG-20251227-WA0034.jpg",
    category: "glam",
    title: "Golden Hour Glam",
    description: "Radiant bronze skin with soft eye shimmer.",
    alt: "Glam portrait in golden light with soft shimmer makeup",
  },
  {
    id: 25,
    media: "/assets/IMG-20251227-WA0036.jpg",
    category: "glam",
    title: "Vintage Glam",
    description: "Classic glam with rich lip color.",
    alt: "Glam look with vintage-inspired lip and hat",
  },
  {
    id: 26,
    media: "/assets/VID-20251227-WA0042.mp4",
    category: "glam",
    title: "Glam Motion",
    description: "Looping motion reel of a glam shoot.",
    alt: "Looping glam video showing model pose",
  },

  // Editorial
  {
    id: 27,
    media: "/assets/471364875_18477409726001599_6214645408122691109_n.jpg",
    category: "editorial",
    title: "Runway Moment",
    description: "Editorial gown with metallic accents.",
    alt: "Editorial look in sparkling gown with headpiece",
  },
  {
    id: 28,
    media: "/assets/503154347_9122817994488373_2837202979333272361_n.jpg",
    category: "editorial",
    title: "Cultural Glam",
    description: "Beaded crown with regal glam finish.",
    alt: "Editorial portrait with coral beads and regal makeup",
  },
  {
    id: 29,
    media: "/assets/503969398_701727119454382_6099158890526774338_n.jpg",
    category: "editorial",
    title: "Silver Shimmer",
    description: "Sleek ponytail with reflective glam.",
    alt: "Editorial close-up with silver sequin outfit and sleek hair",
  },
  {
    id: 30,
    media: "/assets/IMG-20251227-WA0026.jpg",
    category: "editorial",
    title: "Red Statement",
    description: "Bold red dress paired with soft glam.",
    alt: "Editorial pose in red gown with glam makeup",
  },
  {
    id: 31,
    media: "/assets/IMG-20251227-WA0032.jpg",
    category: "editorial",
    title: "Golden Muse",
    description: "Golden backdrop and elevated glam.",
    alt: "Editorial portrait with golden backdrop and soft glam",
  },
  {
    id: 32,
    media: "/assets/IMG-20251227-WA0015.jpg",
    category: "editorial",
    title: "Classic Elegance",
    description: "Timeless updo with refined glam.",
    alt: "Editorial bridal-inspired portrait with classic makeup",
  },
  {
    id: 33,
    media: "/assets/WhatsApp Video 2025-12-27.mp4",
    category: "editorial",
    title: "Editorial Motion",
    description: "Looping editorial reel highlighting details.",
    alt: "Looping editorial video with soft focus bridal look",
  },
]

const categories = [
  { id: "all", name: "All Work" },
  { id: "bridal", name: "Bridal" },
  { id: "birthday", name: "Birthday" },
  { id: "glam", name: "Glam" },
  { id: "editorial", name: "Editorial" },
]

export default function CataloguePage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [items, setItems] = useState<PortfolioItem[]>(portfolioItems)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getSection("portfolio")
        const apiItems = Array.isArray(data?.items) ? data.items : []
        if (apiItems.length) {
          const mapped: PortfolioItem[] = apiItems.map((i: any, idx: number) => ({
            id: idx + 1,
            media: withSite(i.media || ""),
            category: i.category || "editorial",
            title: i.title || "",
            description: i.description || "",
            alt: i.alt || i.title || "",
          }))
          setItems(mapped)
        }
      } catch {
        /* keep defaults */
      }
    })()
  }, [])

  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter)
  const isVideo = (path: string) => path.endsWith(".mp4")
  const categoryLabels: Record<PortfolioItem["category"], string> = {
    bridal: "Bridal",
    birthday: "Birthday",
    glam: "Glam",
    editorial: "Editorial",
  }

  return (
    <div className="bg-[#0E0E0E] text-white">
      <section className="bg-gradient-to-b from-[#0E0E0E] to-[#1a1410] px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)]"
          >
            Our Work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-[#fdf7ec] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
          >
            A showcase of flawless transformations and luxury beauty moments.
          </motion.p>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#C9A24D]" />
        </div>
      </section>

      <section className="sticky top-20 z-40 border-b border-[#C9A24D]/20 bg-[#1a1410] px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-6 py-2 text-sm uppercase tracking-wider transition-all ${
                  filter === category.id
                    ? "bg-[#C9A24D] text-[#0E0E0E]"
                    : "border border-[#C9A24D]/30 bg-[#0E0E0E] text-white/70 hover:text-[#C9A24D]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1a1410] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-square cursor-pointer overflow-hidden border border-[#C9A24D]/20 bg-[#0E0E0E]"
                onClick={() => setSelectedImage(index)}
              >
                {isVideo(item.media) ? (
                  <video
                    src={item.media}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label={item.alt}
                  />
                ) : (
                  <ImageWithFallback
                    src={item.media}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/50 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="mb-2 text-xs uppercase tracking-wider text-[#C9A24D]">
                    {categoryLabels[item.category]}
                  </span>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#1a1410] to-[#0E0E0E] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="font-display text-3xl text-white md:text-4xl">See More on Instagram</h3>
          <p className="mt-4 text-[#E6D1C3]/80">
            Follow @beautyhomebysuzain for daily glam inspiration and behind-the-scenes content.
          </p>
          <a
            href="https://instagram.com/beautyhomebysuzain"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded bg-[#C9A24D] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0E0E0E] transition-colors hover:bg-[#E6D1C3]"
          >
            Follow on Instagram
          </a>
        </div>
      </section>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute right-4 top-4 text-white/80 transition-colors hover:text-white"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <div className="relative max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {isVideo(filteredItems[selectedImage].media) ? (
              <video
                src={filteredItems[selectedImage].media}
                className="h-full w-full object-contain"
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            ) : (
              <ImageWithFallback
                src={filteredItems[selectedImage].media as string}
                alt={filteredItems[selectedImage].alt}
                className="h-full w-full object-contain"
              />
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <span className="block text-sm uppercase tracking-wider text-[#C9A24D]">
                {categoryLabels[filteredItems[selectedImage].category]}
              </span>
              <h3 className="text-2xl">{filteredItems[selectedImage].title}</h3>
              <p className="text-white/70">{filteredItems[selectedImage].description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
