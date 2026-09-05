"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Style } from "@/components/ui/Style";

interface Founding {
  members: number;
  cap: number;
  seatsLeft: number;
  freeMonths: number;
  circlesOpenAt: number;
}

/**
 * The one number that matters on the landing page: how many founding seats
 * are left. Reads the public founding endpoint; renders a quiet fallback
 * until it answers.
 */
export function FoundingStrip() {
  const [f, setF] = useState<Founding | null>(null);
  useEffect(() => {
    fetch("/api/founding")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Founding | null) => d && setF(d))
      .catch(() => {});
  }, []);

  const cap = f?.cap ?? Number(process.env.NEXT_PUBLIC_FOUNDING_CAP ?? 150);
  const taken = f?.members ?? 0;
  const pct = Math.min(100, Math.round((taken / cap) * 100));

  return (
    <section style={{ background: "var(--calm-forest)", color: "white", padding: "28px 24px" }}>
      <div className="container founding-strip">
        <div style={{ flex: 1, minWidth: 260 }}>
          <p className="body-micro" style={{ opacity: 0.8, marginBottom: 6 }}>Founding members</p>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 26, lineHeight: 1.2 }}>
            The first {cap} get everything free for {f?.freeMonths ?? 4} months.
          </p>
          <p style={{ fontSize: 14, opacity: 0.85, marginTop: 6 }}>
            Chat, voice, and circles. No card, no limits. Chat stays free for everyone after that.
          </p>
        </div>
        <div style={{ minWidth: 220, flex: "0 1 320px" }}>
          <div className="founding-bar" role="img" aria-label={`${taken} of ${cap} founding seats taken`}>
            <span style={{ width: `${pct}%` }} />
          </div>
          <p style={{ fontSize: 13, marginTop: 8, opacity: 0.9 }}>
            {f ? `${taken} of ${cap} seats taken` : `${cap} seats`}
          </p>
        </div>
        <Link href="/auth/signup" className="btn-light" style={{ whiteSpace: "nowrap" }}>
          Take a seat
        </Link>
      </div>
      <Style>{`
        .founding-strip { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
        .founding-bar { height: 8px; background: rgba(255,255,255,0.25); border-radius: 999px; overflow: hidden; }
        .founding-bar span { display: block; height: 100%; background: white; border-radius: 999px; transition: width 0.6s ease; }
      `}</Style>
    </section>
  );
}
