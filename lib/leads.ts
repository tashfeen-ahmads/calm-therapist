export interface LeadRecord {
  id: string;
  email: string;
  source: string;
  capturedAt: string;
}

const globalAny = globalThis as unknown as { __calmLeads?: LeadRecord[] };
const store: LeadRecord[] = globalAny.__calmLeads ?? [];
globalAny.__calmLeads = store;

export function captureLead(email: string, source: string): LeadRecord {
  const lead: LeadRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: email.trim().toLowerCase(),
    source,
    capturedAt: new Date().toISOString(),
  };
  store.push(lead);
  console.log(`[lead-magnet] captured ${lead.email} from ${lead.source}`);
  return lead;
}

export function listLeads(): LeadRecord[] {
  return [...store];
}
