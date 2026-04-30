const DAY_MS = 24 * 60 * 60 * 1000;

export interface DayBucket {
  date: string; // YYYY-MM-DD
  count: number;
}

function dateKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function bucketByDay<T>(
  items: T[],
  getDate: (item: T) => Date | string | number,
  days: number
): DayBucket[] {
  const now = new Date();
  // anchor to UTC midnight today
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const startMs = todayUtc.getTime() - (days - 1) * DAY_MS;

  const buckets: DayBucket[] = [];
  const map = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(startMs + i * DAY_MS);
    const key = dateKey(d);
    map.set(key, 0);
    buckets.push({ date: key, count: 0 });
  }

  for (const it of items) {
    const raw = getDate(it);
    const ms = raw instanceof Date ? raw.getTime() : typeof raw === "number" ? raw : Date.parse(raw);
    if (!Number.isFinite(ms)) continue;
    if (ms < startMs || ms > todayUtc.getTime() + DAY_MS) continue;
    const key = dateKey(new Date(ms));
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
  }

  return buckets.map((b) => ({ date: b.date, count: map.get(b.date) ?? 0 }));
}

export function totalOf(series: DayBucket[]): number {
  return series.reduce((s, b) => s + b.count, 0);
}

/** Compare totals of two consecutive equal-sized windows. */
export function periodOverPeriodChange(items: { at: string }[], days: number): number {
  const now = Date.now();
  const a = items.filter((x) => Date.parse(x.at) >= now - days * DAY_MS).length;
  const b = items.filter((x) => {
    const t = Date.parse(x.at);
    return t < now - days * DAY_MS && t >= now - 2 * days * DAY_MS;
  }).length;
  if (b === 0) return a > 0 ? 100 : 0;
  return Number((((a - b) / b) * 100).toFixed(1));
}
