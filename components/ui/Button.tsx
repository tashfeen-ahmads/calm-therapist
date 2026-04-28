import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "light";

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = BaseProps & { href: string };

const classFor = (v: Variant) =>
  v === "primary" ? "btn-primary" : v === "light" ? "btn-light" : "btn-ghost";

export function Button({ variant = "primary", children, className, ...rest }: ButtonProps) {
  return (
    <button className={`${classFor(variant)} ${className ?? ""}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({ variant = "primary", children, href, className }: LinkButtonProps) {
  return (
    <Link href={href} className={`${classFor(variant)} ${className ?? ""}`}>
      {children}
    </Link>
  );
}
