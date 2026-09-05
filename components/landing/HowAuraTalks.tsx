import { Style } from "@/components/ui/Style";

const RULES = [
  { title: "Short turns", body: "Two to four sentences. One question at a time. Aura never lectures, because nobody reads a lecture at 2am." },
  { title: "Remembers you", body: "Your name, the argument from last Tuesday, what helped before. Held quietly until it matters, never recited back as a list." },
  { title: "Pushes back, kindly", body: "Validate and change. Aura names the loop, the catastrophising, the reassurance-seeking. She agrees with you when you are right, not because you are upset." },
  { title: "Never diagnoses", body: "Aura notices patterns and says so in plain words. She does not label you, prescribe, or pretend to be a clinician. When a professional is the right next step, she says that too." },
  { title: "Your culture, not a template", body: "No default 'set boundaries with your family'. Communal families, diaspora guilt, body-first ways of saying you are not okay: Aura reads the profile you gave her." },
  { title: "Your language", body: "English, Urdu, Hindi, Arabic, Spanish, French, and the mix in between. Switch mid-sentence; Aura switches with you." },
];

const SAMPLE = [
  { who: "You", text: "I said yes to the 6pm call again. I know I should say no. I hear my mother saying we didn't come here to be lazy." },
  { who: "Aura", text: "So the yes isn't really to your manager. It's to her. What would saying no cost you with her, honestly?" },
  { who: "You", text: "Nothing. She'd never even know." },
  { who: "Aura", text: "Then the voice is yours now, not hers. That's harder, and it's also the part you can change. Want to try one sentence you could have said at 5:55?" },
];

/** How Aura actually talks: the rules, and a real exchange. Server-rendered. */
export function HowAuraTalks() {
  return (
    <section style={{ background: "var(--calm-mist)", padding: "112px 24px" }}>
      <div className="container talk-grid">
        <div>
          <span className="micro-label" style={{ color: "var(--calm-forest)" }}>How Aura talks</span>
          <h2 style={{ marginTop: 16, marginBottom: 16 }}>Like a friend who knows how to listen. Not a form.</h2>
          <p className="body-large" style={{ color: "var(--calm-ink-70)", marginBottom: 36 }}>
            Every reply follows the same rules a good therapist keeps and a chatbot forgets.
          </p>
          <dl className="talk-rules">
            {RULES.map((r) => (
              <div key={r.title}>
                <dt>{r.title}</dt>
                <dd>{r.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="talk-sample" aria-label="Example conversation with Aura">
          <p className="body-micro" style={{ color: "var(--calm-forest)", marginBottom: 16 }}>A real shape of conversation</p>
          {SAMPLE.map((m, i) => (
            <div key={i} className="talk-msg" data-who={m.who}>
              <span className="talk-who">{m.who}</span>
              <p>{m.text}</p>
            </div>
          ))}
          <p style={{ fontSize: 12, color: "var(--calm-ink-40)", marginTop: 16 }}>Illustrative. Aura never shares real conversations.</p>
        </div>
      </div>
      <Style>{`
        .talk-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 56px; align-items: start; }
        .talk-rules { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px; margin: 0; }
        .talk-rules dt { font-family: var(--font-heading); font-size: 20px; margin-bottom: 4px; }
        .talk-rules dd { margin: 0; font-size: 14px; line-height: 1.7; color: var(--calm-ink-70); }
        .talk-sample { background: var(--calm-white); border: 1px solid var(--calm-ink-10); border-radius: 18px; padding: 28px; }
        .talk-msg { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
        .talk-msg p { font-size: 15px; line-height: 1.65; padding: 12px 14px; border-radius: 12px; background: var(--calm-mist); max-width: 92%; }
        .talk-msg[data-who="Aura"] p { background: var(--calm-forest-10); align-self: flex-start; }
        .talk-msg[data-who="You"] p { align-self: flex-end; }
        .talk-who { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--calm-ink-40); }
        .talk-msg[data-who="You"] .talk-who { align-self: flex-end; }
        @media (max-width: 900px) { .talk-grid { grid-template-columns: 1fr; gap: 32px; } .talk-rules { grid-template-columns: 1fr; } }
      `}</Style>
    </section>
  );
}
