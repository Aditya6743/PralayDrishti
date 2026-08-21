
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filter = url.searchParams.get('filter') || 'ALL';
  
  let tickets = db.getTickets();
  if (filter !== 'ALL') {
    tickets = tickets.filter(t => t.priority === filter || t.hazard === filter);
  }
  
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  // Override Priority
  try {
    const { ticket_id, new_priority, operator, reason } = await req.json();
    const ticket = db.tickets.find(t => t.ticket_id === ticket_id);
    if (ticket) {
      ticket.priority = new_priority;
      // Audit log could go here
      return NextResponse.json({ success: true, ticket });
    }
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
