import { Style } from "@/components/ui/Style";

const LANGS = [
  { name: "English", sample: "I can't switch my head off tonight." },
  { name: "Urdu", sample: "آج رات دماغ بند ہی نہیں ہو رہا۔" },
  { name: "Hindi", sample: "आज रात दिमाग़ बंद ही नहीं हो रहा।" },
  { name: "Arabic", sample: "ما أقدر أوقف تفكيري الليلة." },
  { name: "Spanish", sample: "No puedo apagar la cabeza esta noche." },
  { name: "French", sample: "Je n'arrive pas à éteindre ma tête ce soir." },
];

/** Languages Aura and the safety layer understand. Server-rendered. */
export function Languages() {
  return (
    <section style={{ background: "var(--calm-ink)", color: "white", padding: "96px 24px" }}>
      <div className="container">
        <span className="micro-label" style={{ color: "var(--calm-mist)" }}>Your language</span>
        <h2 style={{ color: "white", marginTop: 16, marginBottom: 16 }}>Say it the way you would say it at home.</h2>
        <p className="body-large" style={{ color: "rgba(255,255,255,0.78)", maxWidth: 620, marginBottom: 40 }}>
          Aura replies in the language you write, and switches when you do, mid-sentence if that is how you talk.
          The safety layer reads all of them too, including Roman Urdu and Hinglish.
        </p>
        <ul className="lang-grid">
          {LANGS.map((l) => (
            <li key={l.name} className="lang-card">
              <span className="body-micro" style={{ color: "var(--calm-mist)" }}>{l.name}</span>
              <p lang={langCode(l.name)} dir={l.name === "Urdu" || l.name === "Arabic" ? "rtl" : "ltr"}>{l.sample}</p>
            </li>
          ))}
        </ul>
      </div>
      <Style>{`
        .lang-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .lang-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 20px 22px; }
        .lang-card p { margin-top: 8px; font-family: var(--font-heading); font-size: 22px; line-height: 1.4; color: white; }
        @media (max-width: 760px) { .lang-grid { grid-template-columns: 1fr; } }
      `}</Style>
    </section>
  );
}

function langCode(name: string): string {
  return { English: "en", Urdu: "ur", Hindi: "hi", Arabic: "ar", Spanish: "es", French: "fr" }[name] ?? "en";
}
