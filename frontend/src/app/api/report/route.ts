
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const ticket = db.addTicket(data);
    return NextResponse.json({
      success: true,
      ticket_id: ticket.ticket_id,
      access_token: ticket.access_token,
      status_url: `/status.html?ticket=${ticket.ticket_id}&token=${ticket.access_token}`,
      remaining_time_minutes: ticket.ttc_minutes,
      priority_rank: ticket.priority
    });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
