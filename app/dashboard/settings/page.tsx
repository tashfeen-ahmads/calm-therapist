"use client";

import { useEffect, useState } from "react";
import { readState, writeState } from "@/components/onboarding/OnboardingShell";

export default function SettingsPage() {
  const [reminderTime, setReminderTime] = useState("08:30");
  const [language, setLanguage] = useState("en");
  const [tone, setTone] = useState("warm");
  const [referencePast, setReferencePast] = useState(true);
  const [crisisName, setCrisisName] = useState("");
  const [crisisPhone, setCrisisPhone] = useState("");

  useEffect(() => {
    const s = readState() as Record<string, string>;
    if (s.language) setLanguage(s.language);
    if (s.tone) setTone(s.tone);
    if (s.crisisContactName) setCrisisName(s.crisisContactName);
    if (s.crisisContactPhone) setCrisisPhone(s.crisisContactPhone);
  }, []);

  const save = () => {
    writeState({ language, tone, crisisContactName: crisisName, crisisContactPhone: crisisPhone });
  };

  return (
    <div style={{ padding: "48px 32px", maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 32 }}>Settings</h2>

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

      <Group title="Subscription">
        <p style={{ fontSize: 14, color: "var(--calm-ink-40)" }}>You&apos;re on the Free plan.</p>
        <button className="btn-primary" style={{ marginTop: 16 }}>Upgrade to Pro</button>
      </Group>

      <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
        <button onClick={save} className="btn-primary">Save changes</button>
        <button className="btn-ghost" style={{ color: "var(--calm-ink)" }}>
          Delete account
        </button>
      </div>
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
