"use client";

import { Style } from "@/components/ui/Style";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(250,250,248,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 1px 0 var(--calm-ink-10)" : "none",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
            padding: "0 24px",
          }}
        >
          <Logo />
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/how-it-works" className="nav-link">How it works</Link>
            <Link href="/features" className="nav-link">Features</Link>
            <Link href="/circles" className="nav-link">Circles</Link>
            <Link href="/auth/login" className="nav-link">Continue</Link>
            <Link href="/auth/signup" className="btn-primary">Let's talk</Link>
          </div>
          <button
            className="nav-burger"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            style={{ display: "none" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, zIndex: 100, background: "rgba(45,45,45,0.4)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: "100%", background: "var(--calm-white)", padding: 32,
              borderTopLeftRadius: 16, borderTopRightRadius: 16,
              display: "flex", flexDirection: "column", gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/how-it-works" onClick={() => setOpen(false)} style={{ fontSize: 20, fontFamily: "var(--font-heading)" }}>How it works</Link>
            <Link href="/features" onClick={() => setOpen(false)} style={{ fontSize: 20, fontFamily: "var(--font-heading)" }}>Features</Link>
            <Link href="/circles" onClick={() => setOpen(false)} style={{ fontSize: 20, fontFamily: "var(--font-heading)" }}>Circles</Link>
            <Link href="/auth/login" onClick={() => setOpen(false)} style={{ fontSize: 20, fontFamily: "var(--font-heading)" }}>Continue</Link>
            <Link href="/auth/signup" className="btn-primary" onClick={() => setOpen(false)}>Let's talk</Link>
          </div>
        </div>
      )}

      <Style>{`
        .nav-link {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--calm-ink);
          padding: 10px 16px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        .nav-link:hover { background: var(--calm-ink-10); }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-burger { display: inline-flex !important; align-items: center; justify-content: center; width: 40px; height: 40px; }
        }
      `}</Style>
    </>
  );
}
