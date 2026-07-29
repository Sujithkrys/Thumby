"use client";

interface CategoryPillProps {
  label: string;
  slug: string;
  active?: boolean;
  onClick?: () => void;
}

/**
 * Category filter pill.
 * Active: ink bg, studio text, no border.
 * Inactive: white bg, slate text, light border.
 */
export function CategoryPill({
  label,
  slug,
  active = false,
  onClick,
}: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-[14px] py-[6px] rounded-[--radius-pill] text-[12px] font-body cursor-pointer transition-colors ${
        active
          ? "bg-ink text-studio border-none"
          : "bg-white text-slate border border-border-light hover:bg-studio"
      }`}
    >
      {label}
    </button>
  );
}
