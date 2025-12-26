'use client'

import { useState } from "react"
import { motion } from "motion/react"
import { X } from "lucide-react"
import ImageWithFallback from "../../components/image-with-fallback"

const portfolioItems = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1762201732755-b59e912de5d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBicmlkYWwlMjBtYWtldXAlMjBnbGFtfGVufDF8fHx8MTc2Njc3OTE2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "bridal",
    title: "Bridal Elegance",
    description: "Flawless bridal glam with luxury finish.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1766193232249-282e7754b1c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjBiaXJ0aGRheSUyMHBob3Rvc2hvb3R8ZW58MXx8fHwxNzY2Nzc5NjE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "birthday",
    title: "Birthday Celebration",
    description: "Glamorous birthday photoshoot package.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1617113370852-2371f361f9fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWtldXAlMjBhcnRpc3Q%3D&ixlib=rb-4.1.0&q=80&w=1080",
    category: "glam",
    title: "Editorial Glam",
    description: "High-fashion editorial makeup.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1762201732755-b59e912de5d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBicmlkYWwlMjBtYWtldXAlMjBnbGFtfGVufDF8fHx8MTc2Njc3OTE2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "bridal",
    title: "Classic Bridal",
    description: "Timeless bridal beauty.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1766193232249-282e7754b1c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjBiaXJ0aGRheSUyMHBob3Rvc2hvb3R8ZW58MXx8fHwxNzY2Nzc5NjE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "birthday",
    title: "Birthday Glam",
    description: "Stunning birthday transformation.",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1621691553102-66d4ecdb1be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBhcnRpc3QlMjBiZWF1dHl8ZW58MXx8fHwxNzY2Nzc5NjE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "glam",
    title: "Event Glam",
    description: "Red carpet ready.",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1648922798217-f5d339cb7aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBtYWtldXAlMjBiZWF1dHl8ZW58MXx8fHwxNzY2Nzc5NjE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "editorial",
    title: "Magazine Editorial",
    description: "High-fashion editorial look.",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1600637070413-0798fafbb6c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWtldXAlMjBicnVzaGVzfGVufDF8fHx8MTc2NjcwOTk3MHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "glam",
    title: "Glamour Session",
    description: "Professional glam makeup.",
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

  const filteredItems = filter === "all" ? portfolioItems : portfolioItems.filter((item) => item.category === filter)

  return (
    <div className="bg-[#0E0E0E] text-white">
      <section className="bg-gradient-to-b from-[#0E0E0E] to-[#1a1410] px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl"
          >
            Our Work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-[#E6D1C3]"
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
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/50 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="mb-2 text-xs uppercase tracking-wider text-[#C9A24D]">{item.category}</span>
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
            <ImageWithFallback
              src={filteredItems[selectedImage].image}
              alt={filteredItems[selectedImage].title}
              className="h-full w-full object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <span className="block text-sm uppercase tracking-wider text-[#C9A24D]">
                {filteredItems[selectedImage].category}
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
