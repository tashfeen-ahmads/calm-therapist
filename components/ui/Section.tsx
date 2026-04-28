import { CSSProperties, ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  background?: "white" | "mist" | "ink" | "forest";
  className?: string;
  id?: string;
}

const bgFor = (bg: SectionProps["background"]) => {
  switch (bg) {
    case "mist": return "var(--calm-mist)";
    case "ink": return "var(--calm-ink)";
    case "forest": return "var(--calm-forest)";
    default: return "var(--calm-white)";
  }
};

export function Section({ children, background = "white", className, id }: SectionProps) {
  const style: CSSProperties = {
    background: bgFor(background),
    color: background === "ink" || background === "forest" ? "white" : "var(--calm-ink)",
  };
  return (
    <section className={`section ${className ?? ""}`} style={style} id={id}>
      <div className="container">{children}</div>
    </section>
  );
}
