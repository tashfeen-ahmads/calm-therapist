"use client";

import Link from "next/link";
import { BRAND } from "@/lib/brand";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  href?: string | null;
  animated?: boolean;
}

/**
 * Wire-to-circle SVG logo. The path animates in via stroke-dashoffset on mount
 * and settles into a clean circle with a single gap at the top (rotated C).
 */
export function Logo({ size = 36, showWordmark = true, href = "/", animated = true }: LogoProps) {
  const content = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        className={animated ? "logo-wire" : undefined}
        aria-hidden="true"
      >
        {/* Loose tangle that resolves into a near-complete circle with a gap at top */}
        <path
          d="M 32 8
             C 18 8, 8 18, 8 32
             C 8 46, 18 56, 32 56
             C 46 56, 56 46, 56 32
             C 56 22, 50 14, 40 10"
          stroke="var(--calm-forest)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
            fontSize: 24,
            color: "var(--calm-ink)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {BRAND.name}
        </span>
      )}
    </span>
  );

  if (href) {
    return <Link href={href} aria-label={`${BRAND.name} home`}>{content}</Link>;
  }
  return content;
}
