import { dbEnabled, prisma } from "./prisma";

export interface LeadRecord {
  id: string;
  email: string;
  source: string;
  capturedAt: string;
}

const globalAny = globalThis as unknown as { __calmLeads?: LeadRecord[] };
const memoryStore: LeadRecord[] = globalAny.__calmLeads ?? [];
globalAny.__calmLeads = memoryStore;

export async function captureLead(email: string, source: string): Promise<LeadRecord> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanSource = source.trim() || "unknown";

  if (dbEnabled) {
    const row = await prisma.lead.create({
      data: { email: cleanEmail, source: cleanSource },
    });
    const lead: LeadRecord = {
      id: row.id,
      email: row.email,
      source: row.source,
      capturedAt: row.capturedAt.toISOString(),
    };
    console.log(`[lead-magnet] captured ${lead.email} from ${lead.source}`);
    return lead;
  }

  const lead: LeadRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: cleanEmail,
    source: cleanSource,
    capturedAt: new Date().toISOString(),
  };
  memoryStore.push(lead);
  console.log(`[lead-magnet] captured ${lead.email} from ${lead.source}`);
  return lead;
}

export async function listLeads(): Promise<LeadRecord[]> {
  if (dbEnabled) {
    const rows = await prisma.lead.findMany({ orderBy: { capturedAt: "desc" } });
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      source: r.source,
      capturedAt: r.capturedAt.toISOString(),
    }));
  }
  return [...memoryStore].sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : -1));
}
