
import { haversineDistance } from './geo';
import { calculateTTC } from './triage';

export interface Ticket {
  ticket_id: string;
  access_token: string;
  hazard: string;
  lat: number;
  lng: number;
  status: 'QUEUED' | 'TEAM_ASSIGNED' | 'EN_ROUTE' | 'RESCUED' | 'RESOLVED';
  created_at: number;
  ttc_minutes: number;
  priority: string;
  victim_status: any;
  is_duplicate: boolean;
  phone?: string;
}

class Store {
  tickets: Ticket[] = [];

  addTicket(data: any) {
    // Duplicate check: within 2 hours, 500 meters, matching phone or hazard
    const now = Date.now();
    const is_duplicate = this.tickets.some(t => {
      const timeDiff = now - t.created_at;
      const dist = haversineDistance(data.lat, data.lng, t.lat, t.lng);
      return timeDiff <= 2 * 60 * 60 * 1000 && dist <= 500 && (t.phone === data.phone || t.hazard === data.hazard);
    });

    const ticket_id = 'TK-' + Math.floor(10000 + Math.random() * 90000);
    const access_token = 'tok_' + Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
    
    const { ttc_minutes, priority } = calculateTTC(data.hazard, data.victim_status);

    const ticket: Ticket = {
      ticket_id,
      access_token,
      hazard: data.hazard,
      lat: data.lat,
      lng: data.lng,
      status: 'QUEUED',
      created_at: now,
      ttc_minutes,
      priority,
      victim_status: data.victim_status,
      is_duplicate,
      phone: data.phone
    };

    this.tickets.push(ticket);
    return ticket;
  }

  getTickets() {
    return this.tickets.sort((a, b) => a.ttc_minutes - b.ttc_minutes);
  }

  getTicket(ticket_id: string, token: string) {
    return this.tickets.find(t => t.ticket_id === ticket_id && t.access_token === token);
  }
}

export const db = new Store();
