import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Reusable button primitive.
 * Primary: flare bg, flare-muted text (generate button style).
 * Secondary: white bg, border, slate text.
 * Ghost: transparent bg, no border.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-body font-semibold cursor-pointer transition-all border-none";

  const variants = {
    primary: "bg-flare text-flare-muted hover:opacity-90",
    secondary:
      "bg-white text-slate border border-border-medium hover:bg-studio",
    ghost: "bg-transparent text-slate hover:bg-studio",
  };

  const sizes = {
    sm: "px-3 py-[5px] text-[11px] rounded-[6px]",
    md: "px-[15px] py-[9px] text-[13px] rounded-[--radius-button]",
    lg: "w-full p-[13px] text-[14px] rounded-[11px]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-70 cursor-default" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
