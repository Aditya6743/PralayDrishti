import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const reports = await sql`SELECT * FROM reports ORDER BY created_at DESC LIMIT 50`;
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
