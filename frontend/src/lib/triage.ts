
export type HazardType = 'MEDICAL' | 'FIRE' | 'LANDSLIDE' | 'COLLAPSE' | 'CYCLONE' | 'FLOOD' | 'GENERAL';

export interface VictimStatus {
  trapped?: boolean;
  water_rising?: boolean;
  water_depth?: 'ankle' | 'knee' | 'waist' | 'chest' | 'roof';
  unconscious?: boolean;
  smoke?: boolean;
  infant_present?: boolean;
  senior_present?: boolean;
  headcount: number;
}

export function calculateTTC(hazard: HazardType, status: VictimStatus): { ttc_minutes: number, priority: string, urgency_score: number } {
  let baseTTC = 180;
  if (hazard === 'MEDICAL') baseTTC = 20;
  if (hazard === 'FIRE') baseTTC = 30;
  if (hazard === 'LANDSLIDE') baseTTC = 40;
  if (hazard === 'COLLAPSE') baseTTC = 45;
  if (hazard === 'CYCLONE') baseTTC = 90;
  if (hazard === 'FLOOD') baseTTC = 120;

  let multiplier = 1.0;
  if (status.trapped) multiplier *= 0.60;
  if (status.water_rising) multiplier *= 0.50;
  
  if (status.water_depth === 'waist') multiplier *= 0.65;
  if (status.water_depth === 'chest') multiplier *= 0.45;
  if (status.water_depth === 'roof') multiplier *= 0.35;
  
  if (status.unconscious) multiplier *= 0.40;
  if (status.smoke) multiplier *= 0.50;

  let ttc_minutes = Math.round(baseTTC * multiplier);

  let urgency_score = 100;
  if (status.infant_present) urgency_score += 20;
  if (status.senior_present) urgency_score += 15;
  if (status.headcount > 4) urgency_score += Math.min(30, (status.headcount - 4) * 5 + 15);

  let priority = 'LOW';
  if (ttc_minutes <= 20) priority = 'CRITICAL';
  else if (ttc_minutes <= 45) priority = 'HIGH';
  else if (ttc_minutes <= 90) priority = 'MODERATE';

  return { ttc_minutes, priority, urgency_score };
}
