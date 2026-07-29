import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: number;
}

/**
 * Sidebar navigation item.
 * Active state: flare background (10% opacity) + flare text.
 * Inactive: transparent bg + nav-inactive text.
 */
export function NavItem({ href, label, icon: Icon, active = false, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-[10px] px-[10px] py-2 rounded-[9px] no-underline text-[13px] font-body transition-colors ${
        active
          ? "bg-flare-bg text-flare font-semibold"
          : "bg-transparent text-nav-inactive font-normal hover:bg-studio"
      }`}
    >
      <Icon
        size={16}
        className={active ? "text-flare" : "text-slate"}
        aria-hidden="true"
      />
      {label}
      {badge !== undefined && badge > 0 && (
        <span
          className={`ml-auto font-mono text-[10.5px] ${
            active ? "text-flare" : "text-slate"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
