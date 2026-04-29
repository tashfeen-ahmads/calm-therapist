"use client";

import { useEffect, useState } from "react";
import { readState, writeState } from "@/components/onboarding/OnboardingShell";

interface Me {
  email: string;
  name: string;
  plan: "free" | "pro";
}

const PLANS = [
  {
    key: "free" as const,
    label: "Free",
    price: "$0",
    suffix: "/forever",
    description: "Try Calm Therapist with everything you need to get started.",
    features: [
      "3 sessions per week",
      "Chat agent only",
      "7-day session history",
      "Crisis Safe protocol",
    ],
  },
  {
    key: "pro" as const,
    label: "Pro",
    price: "$19",
    suffix: "/month",
    yearly: "or $159/year",
    description: "Everything Calm Therapist can do, with the long view.",
    features: [
      "Unlimited sessions",
      "Voice + chat + journal",
      "Full longitudinal history",
      "Monthly Reflect",
      "Crisis Safe + human handoff",
      "Export your data anytime",
    ],
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

      <Group title="Plans">
        <p style={{ fontSize: 14, color: "var(--calm-ink-40)", marginBottom: 24 }}>
          Switch any time. We never bill you without telling you first.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="plans-grid">
          {PLANS.map((p) => {
            const active = currentPlan === p.key;
            return (
              <div
                key={p.key}
                style={{
                  background: active ? "var(--calm-forest)" : "var(--calm-white)",
                  color: active ? "white" : "var(--calm-ink)",
                  border: active ? "1px solid var(--calm-forest)" : "1px solid var(--calm-ink-10)",
                  borderRadius: 16,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ color: active ? "white" : "var(--calm-ink)" }}>{p.label}</h3>
                  {active && (
                    <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.85 }}>
                      Current
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: 40, fontWeight: 500 }}>{p.price}</span>
                  <span style={{ fontSize: 14, opacity: active ? 0.85 : 0.6 }}>{p.suffix}</span>
                </div>
                {p.yearly && (
                  <p style={{ fontSize: 12, opacity: active ? 0.85 : 0.6 }}>{p.yearly}</p>
                )}
                <p style={{ fontSize: 14, lineHeight: 1.6, opacity: active ? 0.95 : 0.85 }}>{p.description}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: 13, display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 999,
                          background: active ? "rgba(255,255,255,0.85)" : "var(--calm-forest)",
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
                  className={active ? "btn-light" : "btn-primary"}
                  disabled={active || planLoading}
                  onClick={() => switchPlan(p.key)}
                  style={{ marginTop: "auto" }}
                >
                  {active ? "Current plan" : p.key === "pro" ? "Upgrade to Pro" : "Switch to Free"}
                </button>
              </div>
            );
          })}
        </div>
        {planMsg && (
          <p style={{ marginTop: 16, fontSize: 14, color: "var(--calm-forest)" }}>{planMsg}</p>
        )}
      </Group>

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
            <option value="ar">Arabic</option>
            <option value="ur">Urdu</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
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
