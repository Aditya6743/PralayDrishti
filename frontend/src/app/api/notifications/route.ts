import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: "1",
      message: "SYSTEM ONLINE - All comms relays active.",
      type: "INFO",
      timestamp: new Date().toISOString()
    }
  ]);
}
