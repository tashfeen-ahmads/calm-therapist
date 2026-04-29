import { Style } from "@/components/ui/Style";
import Link from "next/link";
import { Logo } from "./Logo";

const productLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
];

const resourcesLinks = [
  { href: "/blog/why-ai-therapy-forgets-you", label: "Blog" },
  { href: "/privacy", label: "Privacy" },
  { href: "/for/anxiety", label: "For Anxiety" },
  { href: "/for/depression", label: "For Depression" },
  { href: "/for/grief", label: "For Grief" },
  { href: "/for/burnout", label: "For Burnout" },
  { href: "/for/relationships", label: "For Relationships" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

const featureLinks = [
  { href: "/features/voice", label: "Voice Agent" },
  { href: "/features/chat", label: "Chat Agent" },
  { href: "/features/journal", label: "Weekly Journal" },
  { href: "/features/reflect", label: "Monthly Reflect" },
  { href: "/features/crisis", label: "Crisis Safe" },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--calm-ink)", color: "white", padding: "80px 24px 32px" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 64,
          }}
          className="footer-grid"
        >
          <div>
            <Logo animated={false} />
            <p style={{ marginTop: 16, color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7 }}>
              Backed by{" "}
              <a href="http://Implenix.net" style={{ color: "white", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">
                Implenix.net
              </a>
            </p>
            <p style={{ marginTop: 24, color: "rgba(255,255,255,0.85)", fontSize: 14, fontStyle: "italic", maxWidth: 280 }}>
              Your data belongs to you. Always.
            </p>
          </div>

          <FooterColumn title="Product" links={productLinks.concat(featureLinks)} />
          <FooterColumn title="Resources" links={resourcesLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div
          style={{
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span>© {new Date().getFullYear()} Calm Therapist. Backed by Implenix.</span>
          <span style={{ display: "flex", gap: 24 }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/privacy#terms">Terms</Link>
          </span>
        </div>
      </div>

      <Style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</Style>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="body-micro" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
        {title}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, transition: "color 0.2s ease" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
