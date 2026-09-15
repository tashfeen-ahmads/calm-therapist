"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell, readState, writeState } from "@/components/onboarding/OnboardingShell";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ur", label: "اردو / Urdu" },
  { code: "hi", label: "हिंदी / Hindi" },
  { code: "ar", label: "العربية / Arabic" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

/**
 * One name and one tap.
 *
 * This screen used to ask for name, age, gender and language. Age and gender
 * were never read by anything: they were collected from someone at a low
 * moment, stored, and used for nothing, which is a cost with no benefit on
 * both counts. Country is now inferred from the browser rather than typed,
 * because asking someone to remember their own ISO code is a strange thing
 * to do to a person who came here to feel better.
 */
export default function Step1Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const s = readState() as Record<string, unknown>;
    if (typeof s.name === "string") setName(s.name);
    if (typeof s.language === "string") setLanguage(s.language);
    else {
      // Their browser already knows. Start there; they can change it.
      try {
        const guess = navigator.language.slice(0, 2).toLowerCase();
        if (LANGUAGES.some((l) => l.code === guess)) setLanguage(guess);
      } catch {}
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let country: string | undefined;
    try {
      // Quietly, from the timezone, so nobody has to type "PK".
      country = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {}
    writeState({ name: name.trim() || "friend", language, timezone: country });
    router.push("/onboarding/step-2");
  };

  return (
    <OnboardingShell step={1}>
      <h2 style={{ marginBottom: 16 }}>What should Aura call you?</h2>
      <p className="body-large" style={{ color: "var(--calm-ink-40)", marginBottom: 32 }}>
        A first name is plenty. It is the only thing we ask you to type.
      </p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          autoComplete="given-name"
          autoFocus
          maxLength={40}
          style={{ fontSize: 18 }}
        />

        <div>
          <p className="body-micro" style={{ color: "var(--calm-ink-40)", marginBottom: 12 }}>
            Which language feels most like yours? Aura follows if you switch mid-sentence.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {LANGUAGES.map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`pill ${language === l.code ? "active" : ""}`}
                aria-pressed={language === l.code}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
          Continue
        </button>
      </form>
    </OnboardingShell>
  );
}
