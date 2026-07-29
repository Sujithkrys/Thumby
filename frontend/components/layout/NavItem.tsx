import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: number;
  isExpanded?: boolean;
}

/**
 * Sidebar navigation item.
 * Active state: flare background (10% opacity) + flare text.
 * Inactive: transparent bg + nav-inactive text.
 */
export function NavItem({ href, label, icon: Icon, active = false, badge, isExpanded = true }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center transition-colors no-underline font-body ${
        isExpanded
          ? `gap-[10px] px-[10px] py-2 rounded-[9px] text-[13px] ${
              active
                ? "bg-flare-bg text-flare font-semibold"
                : "bg-transparent text-nav-inactive font-normal hover:bg-studio"
            }`
          : `justify-center w-10 h-10 rounded-[8px] ${
              active
                ? "bg-flare-bg text-flare"
                : "bg-transparent text-nav-inactive hover:bg-studio"
            }`
      }`}
      title={!isExpanded ? label : undefined}
    >
      <Icon
        size={16}
        className={active ? "text-flare" : "text-slate"}
        aria-hidden="true"
      />
      {isExpanded && label}
      {isExpanded && badge !== undefined && badge > 0 && (
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
