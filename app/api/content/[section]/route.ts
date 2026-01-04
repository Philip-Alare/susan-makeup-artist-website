import { NextResponse, type NextRequest } from "next/server"
import { put } from "@vercel/blob"

const ALLOWED_SECTIONS = ["home", "about", "services", "packages", "portfolio", "contact", "settings"]

const BLOB_BUCKET = process.env.BLOB_BUCKET || process.env.NEXT_PUBLIC_BLOB_BUCKET || "pqum76zhaodicrtp"
const BLOB_BASE_URL =
  process.env.BLOB_BASE_URL ||
  process.env.NEXT_PUBLIC_BLOB_BASE_URL ||
  `https://${BLOB_BUCKET}.public.blob.vercel-storage.com`
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_RW_TOKEN ||
  process.env.BLOB_READ_WRITE_TOKEN

function blobUrl(section: string) {
  return `${BLOB_BASE_URL}/content/${section}.json`
}

function defaultSection(section: string) {
  switch (section) {
    case "home":
      return {
        hero: {
          eyebrow: "Luxury Makeup",
          title: "BeautyHomeBySuzain",
          subtitle: "Editorial perfection for every occasion",
          slides: [
            {
              title: "Luxury Bridal & Glam Makeup Artist",
              subtitle: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford | Available worldwide",
              image: "/assets/IMG-20251227-WA0030.jpg",
              primaryLabel: "Book Appointment",
              primaryHref: "/book",
              secondaryLabel: "View Packages",
              secondaryHref: "/packages",
            },
            {
              title: "Celebrate Your Day in Style",
              subtitle: "Exclusive birthday glam packages",
              image: "/assets/IMG-20251227-WA0032.jpg",
              primaryLabel: "Book Appointment",
              primaryHref: "/book",
              secondaryLabel: "View Packages",
              secondaryHref: "/packages",
            },
            {
              title: "Editorial Perfection",
              subtitle: "Your moment to shine",
              image: "/assets/IMG-20251227-WA0028.jpg",
              primaryLabel: "Book Appointment",
              primaryHref: "/book",
              secondaryLabel: "View Portfolio",
              secondaryHref: "/catalogue",
            },
          ],
        },
        highlights: [
          { title: "Bridal glam", description: "Flawless bridal looks with luxury finish" },
          { title: "Editorial beauty", description: "Camera-ready artistry for photoshoots" },
          { title: "Travel-ready", description: "London, Manchester, Birmingham, Leeds, Sheffield, Bradford" },
        ],
      }
    case "services":
      return {
        hero: { title: "Our Services", subtitle: "Flawless makeup for every occasion" },
        services: [
          {
            title: "Bridal Glam",
            description: "The ultimate bridal experience to make you look and feel flawless on your wedding day.",
            features: [
              "Bridal trial session",
              "Premium skin prep",
              "Long-lasting finish",
              "Touch-up kit guidance",
            ],
            image: "/assets/IMG-20251227-WA0019.jpg",
          },
          {
            title: "Birthday Glam",
            description: "Celebrate in style with camera-ready glam for your special day.",
            features: ["Full glam makeup", "Premium skin prep", "Photoshoot ready", "Luxury finish"],
            image: "/assets/IMG-20251227-WA0016.jpg",
          },
          {
            title: "Event Glam",
            description: "Statement looks for red carpet, parties, and special events.",
            features: ["High-definition makeup", "Camera-ready finish", "All-day wear", "Custom color matching"],
            image: "/assets/IMG-20251227-WA0026.jpg",
          },
          {
            title: "Editorial / Photoshoot Glam",
            description: "Bold, artistic looks tailored to your vision for shoots.",
            features: ["Editorial styling", "Creative concepts", "Professional collaboration", "Portfolio ready"],
            image: "/assets/IMG-20251227-WA0036.jpg",
          },
        ],
      }
    case "packages":
      return {
        packages: [
          {
            name: "Bridal Package",
            price: "GBP 350.99",
            originalPrice: "Includes premium skin prep and consultation",
            badge: "Client Favorite",
            features: [
              "Bridal trial session tailored to your look",
              "Premium skin prep and luxury finish",
              "3-4 hour full glam session",
              "Two edited videos for reels or memories",
            ],
            availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
            note: "Travel worldwide by request (fees may apply).",
          },
          {
            name: "Birthday Glam Package",
            price: "NGN 65,000",
            badge: "Exclusive",
            features: [
              "Flawless makeup application",
              "Premium skin prep and lash styling",
              "Birthday photoshoot included",
              "High-quality edited photos",
            ],
            availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
            note: "Booking fee applies. Photos ready within 4-5 days.",
          },
          {
            name: "Exclusive Birthday Shoot",
            price: "NGN 60,000",
            badge: "Premium",
            features: [
              "30-second reel included",
              "1-2 outfit changes",
              "High-quality photos edited for social",
              "Available at partnered studios or client venues",
            ],
            deliverables: ["Five professionally edited photos", "Cinematic reel"],
            availability: "London · Manchester · Birmingham · Leeds · Sheffield · Bradford",
            note: "Booking fee covers one person only.",
          },
        ],
      }
    case "about":
      return {
        about: {
          title: "Susan Eworo (Suzain)",
          tagline: "Luxury bridal & glam artist",
          bio: "BeautyHomeBySuzain is a luxury makeup brand delivering flawless glam for weddings, birthdays, photoshoots, and special occasions across the UK and Nigeria.",
          travelNote: "Available to travel to any country.",
          image: "/assets/IMG-20251227-WA0018.jpg",
          imageAlt: "Susan Eworo",
        },
        locations: ["London", "Manchester", "Birmingham", "Leeds", "Sheffield", "Bradford"],
        training: [
          "I teach online classes for beginners",
          "One-on-one training and upgrade classes",
          "We sell our courses online and physical",
        ],
      }
    case "portfolio":
      return {
        items: [
          { title: "Bridal Portrait", category: "bridal", media: "/assets/IMG-20251227-WA0014.jpg", alt: "Bridal portrait holding a bouquet with soft glam makeup" },
          { title: "Golden Bridal Glam", category: "bridal", media: "/assets/IMG-20251227-WA0018.jpg", alt: "Bride with golden glam makeup and neutral lip" },
          { title: "Flawless Finish", category: "bridal", media: "/assets/IMG-20251227-WA0019.jpg", alt: "Close-up bridal beauty look with radiant complexion" },
          { title: "Bridal Grace", category: "bridal", media: "/assets/IMG-20251227-WA0028.jpg", alt: "Bride in white dress with classic glam makeup" },
          { title: "Bridal Glow Motion", category: "bridal", media: "/assets/VID-20251227-WA0045.mp4", alt: "Looping bridal glam video showing glowing makeup" },
          { title: "Trial Session Motion", category: "bridal", media: "/assets/VID-20251227-WA0037.mp4", alt: "Looping video of bride during makeup prep" },
          { title: "Bridal Details", category: "bridal", media: "/assets/VID-20251227-WA0043.mp4", alt: "Looping close-up bridal glam video with shimmer details" },
          { title: "Birthday Glam", category: "birthday", media: "/assets/IMG-20251227-WA0016.jpg", alt: "Birthday glam portrait with bold red lipstick" },
          { title: "Party Ready", category: "birthday", media: "/assets/IMG-20251227-WA0017.jpg", alt: "Birthday makeup look with soft waves and nude lip" },
          { title: "Glam in Gold", category: "birthday", media: "/assets/IMG-20251227-WA0020.jpg", alt: "Birthday shoot makeup with golden dress and glam" },
          { title: "Radiant Celebration", category: "birthday", media: "/assets/IMG-20251227-WA0030.jpg", alt: "Birthday glam portrait with glossy lips and lashes" },
          { title: "Birthday Sparkle", category: "birthday", media: "/assets/VID-20251227-WA0044.mp4", alt: "Looping birthday glam video with sparkle details" },
          { title: "Birthday Reels", category: "birthday", media: "/assets/VID-20251227-WA0046.mp4", alt: "Looping birthday makeover video" },
          { title: "Modern Glam", category: "glam", media: "/assets/464066441_18464962738001599_1785631599972269718_n.jpg", alt: "Close-up glam look with blonde waves and bold lashes" },
          { title: "Red Carpet Glam", category: "glam", media: "/assets/465163931_18467386522001599_3279204667309139186_n.jpg", alt: "Glam portrait with red lipstick and silver hair" },
          { title: "Smoky Fringe", category: "glam", media: "/assets/472386974_18479647309001599_4460260269162410280_n.jpg", alt: "Glam look with smoky eyes and straight fringe" },
          { title: "Silver Waves", category: "glam", media: "/assets/474980801_18483432556001599_8644868303585455120_n.jpg", alt: "Glam portrait with silver curly hair and defined makeup" },
          { title: "Sheer Glow", category: "glam", media: "/assets/499715425_1027152582376587_5700509961139003638_n.jpg", alt: "Close-up glam with sheer pink tones and soft curls" },
          { title: "Pearl Glam", category: "glam", media: "/assets/503352745_1042797387789519_8539407518781522875_n.jpg", alt: "Glam portrait with pearl earrings and glossy lips" },
          { title: "Luxe Red Lip", category: "glam", media: "/assets/503723098_1782770865787136_4725173635377146930_n.jpg", alt: "Close-up red lipstick glam with silver hair" },
          { title: "Midnight Sparkle", category: "glam", media: "/assets/505760753_1600241367312812_3601516657950385119_n.jpg", alt: "Glam shot with sequin outfit and sleek ponytail" },
          { title: "Golden Bronze", category: "glam", media: "/assets/541132952_18525327943001599_7963877940994144732_n.jpg", alt: "Glam portrait with golden bronze makeup" },
          { title: "Sleek Glam", category: "glam", media: "/assets/542137589_18525327814001599_3930867530632746288_n.jpg", alt: "Close-up glam with sleek straight hair and nude lips" },
          { title: "Golden Hour Glam", category: "glam", media: "/assets/IMG-20251227-WA0034.jpg", alt: "Glam portrait in golden light with soft shimmer makeup" },
          { title: "Vintage Glam", category: "glam", media: "/assets/IMG-20251227-WA0036.jpg", alt: "Glam look with vintage-inspired lip and hat" },
          { title: "Glam Motion", category: "glam", media: "/assets/VID-20251227-WA0042.mp4", alt: "Looping glam video showing model pose" },
          { title: "Runway Moment", category: "editorial", media: "/assets/471364875_18477409726001599_6214645408122691109_n.jpg", alt: "Editorial look in sparkling gown with headpiece" },
          { title: "Cultural Glam", category: "editorial", media: "/assets/503154347_9122817994488373_2837202979333272361_n.jpg", alt: "Editorial portrait with coral beads and regal makeup" },
          { title: "Silver Shimmer", category: "editorial", media: "/assets/503969398_701727119454382_6099158890526774338_n.jpg", alt: "Editorial close-up with silver sequin outfit and sleek hair" },
          { title: "Red Statement", category: "editorial", media: "/assets/IMG-20251227-WA0026.jpg", alt: "Editorial pose in red gown with glam makeup" },
          { title: "Golden Muse", category: "editorial", media: "/assets/IMG-20251227-WA0032.jpg", alt: "Editorial portrait with golden backdrop and soft glam" },
          { title: "Classic Elegance", category: "editorial", media: "/assets/IMG-20251227-WA0015.jpg", alt: "Editorial bridal-inspired portrait with classic makeup" },
          { title: "Editorial Motion", category: "editorial", media: "/assets/WhatsApp Video 2025-12-27.mp4", alt: "Looping editorial video with soft focus bridal look" },
        ],
      }
    case "contact":
      return {
        phone: "+44 7523 992614",
        whatsapp: "+44 7523 992614",
        whatsappLink: "https://wa.me/447523992614",
        email: "beautyhomebysuzain@gmail.com",
        social: { instagram: "https://instagram.com/beautyhomebysuzain", facebook: "" },
        ctaLabel: "Book Appointment",
        ctaLink: "/book",
        address: { lines: ["London & across the UK", "Available to travel worldwide"] },
        travelNote: "Available to travel to any country.",
      }
    case "settings":
      return { admin: {}, profile: {}, general: {} }
    default:
      return {}
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-store",
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() })
}

export async function GET(request: NextRequest, { params }: { params: { section: string } }) {
  const section = params.section?.toLowerCase()
  if (!ALLOWED_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Section not found" }, { status: 404, headers: corsHeaders() })
  }

  // Try blob first
  try {
    const res = await fetch(blobUrl(section), { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data, { headers: corsHeaders() })
    }
  } catch {
    /* ignore and fall back */
  }

  // Return empty scaffold if nothing exists
  return NextResponse.json(defaultSection(section), { headers: corsHeaders() })
}

export async function PUT(request: NextRequest, { params }: { params: { section: string } }) {
  const section = params.section?.toLowerCase()
  if (!ALLOWED_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Section not found" }, { status: 404, headers: corsHeaders() })
  }

  if (!BLOB_TOKEN) {
    return NextResponse.json({ error: "Blob token not configured" }, { status: 500, headers: corsHeaders() })
  }

  const body = await request.json().catch(() => null)
  if (body === null || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: corsHeaders() })
  }

  try {
    // Use SDK put instead of fetch
    await put(`content/${section}.json`, JSON.stringify(body), {
      access: 'public',
      addRandomSuffix: false,
      token: BLOB_TOKEN,
      allowOverwrite: true,
    })
    
    // Respond with what we stored
    return NextResponse.json(body, { headers: corsHeaders() })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save content" },
      { status: 500, headers: corsHeaders() },
    )
  }
}
