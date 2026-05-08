"use client";

import { useEffect, useState } from "react";
import { readState, writeState } from "@/components/onboarding/OnboardingShell";

interface Me {
  email: string;
  name: string;
  plan: "free" | "pro";
}

interface Quota {
  plan: "free" | "pro";
  weeklyLimitSec: number;
  weeklyUsedSec: number;
  weeklyRemainingSec: number;
  monthlyLimitSec: number;
  monthlyUsedSec: number;
  monthlyRemainingSec: number;
  topupsThisMonth: number;
}

// Dashboard upgrade flow — paid options only. The user is already on free if
// they're seeing this; show them what opening a space looks like.
const PAID_OPTIONS = [
  {
    key: "monthly" as const,
    label: "Monthly",
    price: "$19",
    suffix: "/month",
    blurb: "Light commitment. Pause whenever.",
  },
  {
    key: "yearly" as const,
    label: "Yearly",
    price: "$149",
    suffix: "/year",
    badge: "Best value",
    blurb: "Saves $79 across the year. Same flexibility — pause whenever.",
  },
];

export default function SettingsPage() {
  const [reminderTime, setReminderTime] = useState("08:30");
  const [language, setLanguage] = useState("en");
  const [tone, setTone] = useState("warm");
  const [referencePast, setReferencePast] = useState(true);
  const [crisisName, setCrisisName] = useState("");
  const [crisisPhone, setCrisisPhone] = useState("");
  const [me, setMe] = useState<Me | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planMsg, setPlanMsg] = useState<string | null>(null);

  useEffect(() => {
    const s = readState() as Record<string, string>;
    if (s.language) setLanguage(s.language);
    if (s.tone) setTone(s.tone);
    if (s.crisisContactName) setCrisisName(s.crisisContactName);
    if (s.crisisContactPhone) setCrisisPhone(s.crisisContactPhone);

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data: { user: Me | null }) => setMe(data.user))
      .catch(() => {});
  }, []);

  const save = () => {
    writeState({ language, tone, crisisContactName: crisisName, crisisContactPhone: crisisPhone });
  };

  const switchPlan = async (plan: "free" | "pro") => {
    if (planLoading) return;
    setPlanLoading(true);
    setPlanMsg(null);
    try {
      const res = await fetch("/api/auth/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPlanMsg(data.error ?? "Could not switch plan.");
      } else {
        setMe(data.user);
        setPlanMsg(plan === "pro" ? "You're on Pro." : "Switched to Free.");
      }
    } catch {
      setPlanMsg("Network error.");
    } finally {
      setPlanLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  };

  const currentPlan = me?.plan ?? "free";

  return (
    <div style={{ padding: "48px 32px", maxWidth: 880, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 32 }}>Settings</h2>

      {me && (
        <div className="card" style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="body-micro" style={{ color: "var(--calm-forest)" }}>Account</p>
            <p style={{ fontSize: 16, marginTop: 6 }}>{me.name} · {me.email}</p>
          </div>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              background: currentPlan === "pro" ? "var(--calm-forest)" : "var(--calm-mist)",
              color: currentPlan === "pro" ? "white" : "var(--calm-ink)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {currentPlan === "pro" ? "Pro plan" : "Free plan"}
          </span>
        </div>
      )}

      <UsageBilling
        plan={currentPlan}
        onUpgrade={() => switchPlan("pro")}
        switching={planLoading}
        planMsg={planMsg}
        onPause={async () => {
          // Stripe customer portal if configured. Falls back to the
          // demo "switch plan to free" if Stripe isn't set up.
          try {
            const res = await fetch("/api/billing/portal", { method: "POST" });
            const data = await res.json();
            if (res.ok && data?.url) {
              window.location.href = data.url as string;
              return;
            }
            if (data?.mock) {
              await switchPlan("free");
              return;
            }
            window.alert(data.error ?? "Could not open the billing portal.");
          } catch {
            window.alert("Network error.");
          }
        }}
      />

      <Group title="Notifications">
        <Field label="Daily check-in reminder">
          <input
            type="time"
            className="input"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </Field>
      </Group>

      <Group title="Voice & language">
        <Field label="Preferred language">
          <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </Field>
        <Field label="Tone">
          <select className="input" value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="warm">Warm and gentle</option>
            <option value="direct">Direct and clear</option>
            <option value="clinical">Clinical and structured</option>
          </select>
        </Field>
      </Group>

      <Group title="Privacy">
        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
          <span style={{ fontSize: 15 }}>
            Allow Calm Therapist to reference past sessions
          </span>
          <input type="checkbox" checked={referencePast} onChange={(e) => setReferencePast(e.target.checked)} />
        </label>
      </Group>

      <Group title="Crisis contact">
        <Field label="Trusted person (optional)">
          <input
            className="input"
            placeholder="Their name"
            value={crisisName}
            onChange={(e) => setCrisisName(e.target.value)}
          />
        </Field>
        <Field label="Phone number">
          <input
            className="input"
            placeholder="Including country code"
            value={crisisPhone}
            onChange={(e) => setCrisisPhone(e.target.value)}
          />
        </Field>
      </Group>

      <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
        <button onClick={save} className="btn-primary">Save changes</button>
        <button onClick={logout} className="btn-ghost">Log out</button>
        <button className="btn-ghost" style={{ color: "var(--calm-ink)" }}>
          Delete account
        </button>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .plans-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid var(--calm-ink-10)" }}>
      <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 13, color: "var(--calm-ink-40)" }}>{label}</span>
      {children}
    </label>
  );
}

interface UsageBillingProps {
  plan: "free" | "pro";
  onUpgrade: () => void;
  onPause: () => void | Promise<void>;
  switching: boolean;
  planMsg: string | null;
}

function UsageBilling({ plan, onUpgrade, onPause, switching, planMsg }: UsageBillingProps) {
  const [quota, setQuota] = useState<Quota | null>(null);
  const [topupBusy, setTopupBusy] = useState(false);
  const [topupMsg, setTopupMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/voice/quota")
      .then((r) => r.json())
      .then((d: Quota) => setQuota(d))
      .catch(() => {});
  }, [plan]);

  const buyTopup = async () => {
    setTopupBusy(true);
    setTopupMsg(null);
    try {
      // Stripe Checkout if configured.
      const stripeRes = await fetch("/api/billing/topup-checkout", { method: "POST" });
      const stripeData = await stripeRes.json();
      if (stripeRes.ok && stripeData?.url) {
        window.location.href = stripeData.url as string;
        return;
      }
      if (stripeData?.mock) {
        // Demo mode — apply instantly.
        const res = await fetch("/api/voice/topup", { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          setTopupMsg(data.error ?? "Could not apply top-up.");
        } else {
          setQuota({ plan: "pro", ...data.quota });
          setTopupMsg("Added 30 min this week and 50 min for the month.");
        }
        return;
      }
      setTopupMsg(stripeData.error ?? "Could not start checkout.");
    } catch {
      setTopupMsg("Network error.");
    } finally {
      setTopupBusy(false);
    }
  };

  if (plan === "free") {
    return (
      <Group title="Open your space">
        <p style={{ fontSize: 14, color: "var(--calm-ink-70)", marginBottom: 16 }}>
          Choose how you want to keep going. Pause anytime.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="plans-grid">
          {PAID_OPTIONS.map((p) => {
            const isYearly = p.key === "yearly";
            return (
              <div
                key={p.key}
                style={{
                  position: "relative",
                  background: isYearly ? "var(--calm-forest)" : "var(--calm-white)",
                  color: isYearly ? "white" : "var(--calm-ink)",
                  border: isYearly ? "1px solid var(--calm-forest)" : "1px solid var(--calm-ink-10)",
                  borderRadius: 16,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {p.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: -10,
                      left: 24,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: "var(--calm-ink)",
                      color: "white",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {p.badge}
                  </span>
                )}
                <h3 style={{ color: isYearly ? "white" : "var(--calm-ink)" }}>{p.label}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: 40, fontWeight: 500 }}>{p.price}</span>
                  <span style={{ fontSize: 14, opacity: 0.85 }}>{p.suffix}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>{p.blurb}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Voice — 20 min a week, included",
                    "Unlimited text",
                    "Weekly journal + monthly reflect",
                    "Crisis-safe + human handoff",
                  ].map((f) => (
                    <li key={f} style={{ fontSize: 13, display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 999,
                          background: isYearly ? "rgba(255,255,255,0.85)" : "var(--calm-forest)",
                          marginTop: 8,
                          flexShrink: 0,
                        }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={isYearly ? "btn-light" : "btn-primary"}
                  disabled={switching}
                  onClick={onUpgrade}
                  style={{ marginTop: "auto" }}
                >
                  {switching ? "Opening your space…" : isYearly ? `Keep my space open — ${p.price}/year` : `Keep my space open — ${p.price}/month`}
                </button>
              </div>
            );
          })}
        </div>
        {planMsg && (
          <p style={{ marginTop: 16, fontSize: 14, color: "var(--calm-forest)" }}>{planMsg}</p>
        )}
      </Group>
    );
  }

  // Pro user: show usage + billing.
  const weekUsedMin = quota ? Math.floor(quota.weeklyUsedSec / 60) : 0;
  const weekLimitMin = quota ? Math.floor(quota.weeklyLimitSec / 60) : 0;
  const weekRemainMin = quota ? Math.floor(quota.weeklyRemainingSec / 60) : 0;
  const monthUsedMin = quota ? Math.floor(quota.monthlyUsedSec / 60) : 0;
  const monthLimitMin = quota ? Math.floor(quota.monthlyLimitSec / 60) : 0;
  const usedPct = weekLimitMin === 0 ? 0 : Math.min(100, (weekUsedMin / weekLimitMin) * 100);

  return (
    <Group title="Usage & billing">
      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <p className="body-micro" style={{ color: "var(--calm-ink-40)" }}>Plan</p>
          <p style={{ fontSize: 16, marginTop: 4 }}>Pro · $19/month (or $149/year)</p>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>Voice this week</span>
            <span style={{ fontSize: 13, color: "var(--calm-ink-70)" }}>
              {weekUsedMin} / {weekLimitMin} min · {weekRemainMin} left
            </span>
          </div>
          <div style={{ height: 6, background: "var(--calm-ink-10)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${usedPct}%`, height: "100%", background: "var(--calm-forest)", transition: "width 0.4s ease" }} />
          </div>
          <p style={{ marginTop: 6, fontSize: 12, color: "var(--calm-ink-40)" }}>
            {monthUsedMin} of {monthLimitMin} min this month · resets on the 1st · weekly resets every Monday
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        <p className="body-micro" style={{ color: "var(--calm-forest)" }}>Voice top-up · $12</p>
        <h3 style={{ fontSize: 22 }}>Need more this week?</h3>
        <p style={{ fontSize: 14, color: "var(--calm-ink-70)", lineHeight: 1.6 }}>
          One-time pack: <strong>+30 minutes this week</strong> and <strong>+50 minutes for the
          month</strong>. Applied immediately. Caps at 4 packs/month so you can&apos;t accidentally
          spend half your rent.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={buyTopup} className="btn-primary" disabled={topupBusy}>
            {topupBusy ? "Adding…" : "Add 30 min — $12"}
          </button>
          {quota && quota.topupsThisMonth > 0 && (
            <span style={{ fontSize: 13, color: "var(--calm-ink-40)" }}>
              {quota.topupsThisMonth} / 4 top-ups this month
            </span>
          )}
        </div>
        {topupMsg && (
          <p style={{ fontSize: 13, color: "var(--calm-forest)" }}>{topupMsg}</p>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={onPause} className="btn-ghost" disabled={switching}>
          {switching ? "…" : "Pause your space"}
        </button>
      </div>
      <p style={{ fontSize: 12, color: "var(--calm-ink-40)" }}>
        Pausing keeps your record. You can come back anytime.
      </p>
      {planMsg && (
        <p style={{ fontSize: 14, color: "var(--calm-forest)" }}>{planMsg}</p>
      )}
    </Group>
  );
}
