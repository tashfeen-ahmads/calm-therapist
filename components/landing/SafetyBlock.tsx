import Link from "next/link";
import { Style } from "@/components/ui/Style";

const STEPS = [
  { title: "Every message is read for risk", body: "Before Aura replies, a safety layer checks the message in your language, including slang, idiom, and the quiet phrasings people actually use. It looks for intent, plan, means, and time." },
  { title: "The right line for your country", body: "If something serious surfaces, Aura slows down, stays with you, and shows a real crisis line for where you live. Never a number from another country." },
  { title: "It does not forget the next message", body: "A serious moment stays in view for the rest of the conversation. Aura does not bounce back to cheerful because you changed the subject." },
  { title: "Honest about what it is", body: "Aura is support, not a substitute for care. When a licensed professional is the right next step, she says so, plainly." },
];

/** The crisis pathway in plain words. Server-rendered. */
export function SafetyBlock() {
  return (
    <section style={{ background: "var(--calm-white)", padding: "112px 24px" }}>
      <div className="container">
        <div className="safety-head">
          <div>
            <span className="micro-label" style={{ color: "var(--calm-forest)" }}>Safety</span>
            <h2 style={{ marginTop: 16, marginBottom: 16 }}>Built for the hard nights, not just the easy ones.</h2>
            <p className="body-large" style={{ color: "var(--calm-ink-70)", maxWidth: 560 }}>
              Most AI chat apps hope the hard message never comes. Aura is built assuming it will.
            </p>
          </div>
          <Link href="/features/crisis" className="btn-ghost" style={{ alignSelf: "center" }}>How crisis support works</Link>
        </div>
        <ol className="safety-grid">
          {STEPS.map((s, i) => (
            <li key={s.title} className="safety-card">
              <span className="safety-num">{String(i + 1).padStart(2, "0")}</span>
              <h4 style={{ marginBottom: 8 }}>{s.title}</h4>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--calm-ink-70)" }}>{s.body}</p>
            </li>
          ))}
        </ol>
        <p style={{ marginTop: 32, fontSize: 14, color: "var(--calm-ink-40)", maxWidth: 640 }}>
          If you are in immediate danger, contact your local emergency number now. Aura will show you the crisis line
          for your country the moment it matters, and you can find it any time in Settings.
        </p>
      </div>
      <Style>{`
        .safety-head { display: flex; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 48px; }
        .safety-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .safety-card { background: var(--calm-white); border: 1px solid var(--calm-ink-10); border-radius: 16px; padding: 28px 24px; }
        .safety-num { display: block; font-family: var(--font-heading); font-size: 26px; color: var(--calm-forest); margin-bottom: 12px; }
        @media (max-width: 960px) { .safety-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .safety-grid { grid-template-columns: 1fr; } }
      `}</Style>
    </section>
  );
}
