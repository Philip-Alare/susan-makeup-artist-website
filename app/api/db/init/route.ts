import { NextResponse } from "next/server"

import { sql } from "../../../../lib/db"
import { seedDefaultContent } from "@/lib/content"

export async function GET() {
  const conn = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
  if (!conn) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        reference TEXT UNIQUE NOT NULL,
        package_id TEXT NOT NULL,
        package_name TEXT NOT NULL,
        currency TEXT NOT NULL,
        amount_paid INTEGER NOT NULL,
        pay_type TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        time_window TEXT NOT NULL,
        country TEXT NOT NULL,
        city TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        customer_phone TEXT NOT NULL,
        instagram_handle TEXT,
        notes TEXT,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_status_created ON bookings(status, created_at);`
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        section TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `
    await seedDefaultContent()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DB init error", error)
    return NextResponse.json({ error: "Failed to initialize DB" }, { status: 500 })
  }
}
