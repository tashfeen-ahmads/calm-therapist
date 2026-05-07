"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, readState, writeState } from "@/components/onboarding/OnboardingShell";

const AGE_OPTIONS = ["under 18", "18-24", "25-34", "35-44", "45-54", "55+"];
const GENDER_OPTIONS = ["Woman", "Man", "Non-binary", "Prefer to self-describe", "Prefer not to say"];
const LANGUAGE_OPTIONS = [
  ["en", "English"],
  ["es", "Spanish"],
  ["fr", "French"],
];

export default function Step1Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const s = readState() as Record<string, string>;
    if (s.name) setName(s.name);
    if (s.age) setAge(s.age);
    if (s.gender) setGender(s.gender);
    if (s.language) setLanguage(s.language);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    writeState({ name: name.trim(), age, gender, language });
    router.push("/onboarding/step-2");
  };

  return (
    <OnboardingShell step={1}>
      <h2 style={{ marginBottom: 16 }}>Let&apos;s start with the easy part.</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 40 }}>
        Just a few details so Calm Therapist can speak to you, not at you.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Field label="First name">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should Calm Therapist call you?"
            required
          />
        </Field>

        <Field label="Age">
          <select className="input" value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Select your age range</option>
            {AGE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field label="Gender">
          <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select an option</option>
            {GENDER_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field label="Preferred language">
          <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGE_OPTIONS.map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          <p style={{ fontSize: 13, color: "var(--calm-ink-40)", marginTop: 8 }}>
            More languages are coming. Calm Therapist will adapt to whatever language you use.
          </p>
        </Field>

        <button type="submit" className="btn-primary" style={{ marginTop: 24, alignSelf: "flex-start" }}>
          Continue
        </button>
      </form>
    </OnboardingShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="body-micro" style={{ color: "var(--calm-ink-40)" }}>{label}</span>
      {children}
    </label>
  );
}
