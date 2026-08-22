import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    let incidents = [];
    try {
      incidents = await sql`SELECT * FROM incidents ORDER BY updated_at DESC LIMIT 100`;
    } catch (dbError) {
      console.error("Supabase failed. Returning mock incidents for demo.");
      // Fallback Demo Data
      incidents = [
        { id: 1, title: 'Flood Rescue', lat: 28.6139, lng: 77.2090, severity: 'CRITICAL', status: 'ACTIVE', ai_summary: '5 trapped in flood', type: 'flood' },
        { id: 2, title: 'Building Collapse', lat: 28.6239, lng: 77.2190, severity: 'HIGH', status: 'ACTIVE', ai_summary: 'Structural damage', type: 'earthquake' }
      ];
    }
    return NextResponse.json(incidents);
  } catch (error: any) {
    console.error("GET /api/incidents error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
