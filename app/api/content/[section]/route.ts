import { NextResponse, type NextRequest } from "next/server"

const ALLOWED_SECTIONS = ["home", "about", "services", "packages", "portfolio", "contact", "settings"]

const BLOB_BUCKET = process.env.BLOB_BUCKET || process.env.NEXT_PUBLIC_BLOB_BUCKET || "susan-makeup-artist-website-blob"
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
      return { hero: { eyebrow: "", title: "", subtitle: "", slides: [] as any[] }, highlights: [] as any[] }
    case "services":
      return { hero: { title: "", subtitle: "" }, services: [] as any[] }
    case "packages":
      return { packages: [] as any[] }
    case "about":
      return {
        about: { title: "", tagline: "", bio: "", travelNote: "", image: "", imageAlt: "" },
        locations: [] as string[],
        training: [] as string[],
      }
    case "portfolio":
      return { items: [] as any[] }
    case "contact":
      return {
        phone: "",
        whatsapp: "",
        whatsappLink: "",
        email: "",
        social: { instagram: "", facebook: "" },
        ctaLabel: "",
        ctaLink: "",
        address: { lines: [] as string[] },
        travelNote: "",
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
    const res = await fetch(blobUrl(section), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLOB_TOKEN}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(text || "Failed to write content")
    }
    // Respond with what we stored
    return NextResponse.json(body, { headers: corsHeaders() })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save content" },
      { status: 500, headers: corsHeaders() },
    )
  }
}
