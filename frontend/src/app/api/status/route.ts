
import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ticket_id = url.searchParams.get('ticket');
  const token = url.searchParams.get('token');
  
  if (!ticket_id || !token) return NextResponse.json({ error: 'Missing auth' }, { status: 401 });
  
  const ticket = db.getTicket(ticket_id, token);
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  let guidance = "Stay calm and await instructions.";
  if (ticket.hazard === 'FLOOD') guidance = "Move to the highest possible ground. Do not walk through moving water.";
  if (ticket.hazard === 'FIRE') guidance = "Stay low to the ground to avoid smoke. Do not open hot doors.";
  if (ticket.hazard === 'COLLAPSE') guidance = "Tap on a pipe or wall so rescuers can hear you. Do not shout unless necessary (dust).";

  return NextResponse.json({ ticket, guidance });
}
