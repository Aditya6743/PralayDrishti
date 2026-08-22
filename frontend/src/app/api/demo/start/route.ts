import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST() {
  try {
    const locations = ["Andheri", "Bandra", "Sector 12", "Dharavi", "Colaba", "Borivali", "Juhu", "Powai", "Goregaon", "Malad", "Worli", "Dadar", "Kurla", "Vashi", "Thane"];
    
    // We bulk insert 50 incidents for the demo
    const incidents = [];
    for (let i = 0; i < 50; i++) {
      const isFlood = Math.random() > 0.5;
      const category = isFlood ? "FLOOD" : "STRUCTURAL";
      const severity = Math.random() > 0.8 ? "CRITICAL" : "HIGH";
      const loc = locations[Math.floor(Math.random() * locations.length)];
      
      incidents.push({
        id: crypto.randomUUID(),
        title: `${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()} at ${loc} - Zone ${Math.floor(Math.random() * 10) + 1}`,
        category: category,
        severity: severity,
        confidence: 0.85 + Math.random() * 0.14,
        latitude: 19.0760 + (Math.random() * 0.2 - 0.1),
        longitude: 72.8777 + (Math.random() * 0.2 - 0.1),
        people_affected: Math.floor(Math.random() * 5) + 1,
        status: "OPEN",
        is_demo: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // Use postgres.js tagged template bulk insert
    await sql`
      INSERT INTO incidents ${sql(incidents)}
    `;

    return NextResponse.json({ status: "Simulation started" });
  } catch (error: any) {
    console.error("POST /api/demo/start error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
