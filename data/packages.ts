export type Currency = string
export type Availability = "UK" | "NG" | "BOTH"

export type PackageData = {
  id: string
  name: string
  description: string
  currency: Currency
  price: number // major units (e.g., 350.99 or 65000)
  deposit: number // major units
  displayPrice: string
  displayDeposit: string
  includes: string[]
  durationEstimate: string
  availability: Availability
}

const KNOWN_CURRENCIES = ["GBP", "USD", "EUR", "NGN", "CAD", "AUD"]

export const packages: PackageData[] = [
  {
    id: "bridal-package",
    name: "Bridal Package",
    description: "The ultimate all-in-one bridal experience designed to make you look and feel flawless on your wedding day.",
    currency: "GBP",
    price: 350.99,
    deposit: 120,
    displayPrice: "£350.99",
    displayDeposit: "£120",
    includes: [
      "Bridal trial session tailored to your look and theme",
      "Premium skin prep and luxury finish",
      "3-4 hour full glam session",
      "Professional touch-ups throughout the day",
      "Two edited videos ideal for reels or wedding memories",
    ],
    durationEstimate: "3-4 hours (wedding day)",
    availability: "BOTH",
  },
  {
    id: "birthday-glam",
    name: "Birthday Glam Package",
    description: "Celebrate your special day with a luxury beauty and photography experience.",
    currency: "NGN",
    price: 65000,
    deposit: 15000,
    displayPrice: "₦65,000",
    displayDeposit: "₦15,000",
    includes: [
      "Flawless makeup application",
      "Premium skin prep and lash styling",
      "Birthday photoshoot included",
      "High-quality edited photos",
      "Non-refundable booking fee applies",
    ],
    durationEstimate: "2-3 hours",
    availability: "BOTH",
  },
  {
    id: "exclusive-birthday-shoot",
    name: "Exclusive Birthday Shoot",
    description: "Makeup photography session with cinematic video and professional editing.",
    currency: "NGN",
    price: 60000,
    deposit: 15000,
    displayPrice: "₦60,000",
    displayDeposit: "₦15,000",
    includes: [
      "30-second reel included",
      "1-2 outfit changes for variety",
      "High-definition makeup finish",
      "Five professionally edited photos",
      "Cinematic reel for social media",
    ],
    durationEstimate: "2-3 hours",
    availability: "BOTH",
  },
]

export function formatPrice(pkg: PackageData) {
  const value = pkg.price
  if (KNOWN_CURRENCIES.includes(pkg.currency)) {
    try {
      const formatter = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: pkg.currency,
        minimumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
        maximumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
      })
      return formatter.format(value)
    } catch {
      // Fallback
    }
  }
  // If currency is a symbol or unknown code, just prefix it
  return `${pkg.currency}${value.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatDeposit(pkg: PackageData) {
  if (KNOWN_CURRENCIES.includes(pkg.currency)) {
    try {
      const formatter = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: pkg.currency,
        minimumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
        maximumFractionDigits: pkg.currency === "NGN" ? 0 : 2,
      })
      return formatter.format(pkg.deposit)
    } catch {
      // Fallback
    }
  }
  return `${pkg.currency}${pkg.deposit.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

const SYMBOL_TO_CODE: Record<string, string> = { "₦": "NGN", "£": "GBP", "$": "USD", "€": "EUR" }

function parseMoney(raw: any): { code?: string; amount: number } {
  if (typeof raw === "number") return { amount: raw }
  const s = String(raw || "")
  const m = s.match(/^([A-Z]{3}|[^\w\s])?\s*([\d,]+(?:\.\d+)?)$/)
  const code = m?.[1]?.length === 3 ? m[1] : (m?.[1] ? SYMBOL_TO_CODE[m[1]] : undefined)
  const amount = m?.[2] ? Number(String(m[2]).replace(/,/g, "")) : Number(s.replace(/[^0-9.]/g, "")) || 0
  return { code, amount }
}

function normalizeCurrency(raw: any, fallback?: string): string {
  const c = typeof raw === "string" ? raw : ""
  if (KNOWN_CURRENCIES.includes(c)) return c
  if (SYMBOL_TO_CODE[c]) {
    const cc = SYMBOL_TO_CODE[c]
    if (KNOWN_CURRENCIES.includes(cc)) return cc
  }
  if (fallback && KNOWN_CURRENCIES.includes(fallback)) return fallback
  return "GBP"
}

export function normalizePackage(p: any, idx: number, defaults: PackageData[] = packages): PackageData {
  const priceInfo = parseMoney(p?.price)
  const depInfo = parseMoney(p?.deposit)
  const currency = normalizeCurrency(p?.currency, priceInfo.code)
  const defaultPkg = defaults.find((dp) => dp.name === p?.name)
  const id = typeof p?.id === "string" && p?.id ? p.id : (defaultPkg ? defaultPkg.id : `${String(p?.name || "Package").toLowerCase().replace(/\s+/g, "-")}-${idx}`)
  const value = typeof p?.price === "number" ? p.price : priceInfo.amount
  const depositVal = typeof p?.deposit === "number" ? p.deposit : depInfo.amount
  const includes = Array.isArray(p?.includes)
    ? p.includes
    : Array.isArray(p?.features)
    ? p.features
    : Array.isArray(p?.deliverables)
    ? p.deliverables
    : []
  const pkg: PackageData = {
    id,
    name: p?.name || `Package ${idx + 1}`,
    description: p?.description || p?.note || p?.originalPrice || "",
    currency,
    price: value,
    deposit: depositVal,
    displayPrice: formatPrice({ id, name: "", description: "", currency, price: value, deposit: depositVal, displayPrice: "", displayDeposit: "", includes: [], durationEstimate: "", availability: "BOTH" }),
    displayDeposit: formatDeposit({ id, name: "", description: "", currency, price: value, deposit: depositVal, displayPrice: "", displayDeposit: "", includes: [], durationEstimate: "", availability: "BOTH" }),
    includes,
    durationEstimate: p?.durationEstimate || "",
    availability: (p?.availability as Availability) || "BOTH",
  }
  return pkg
}
