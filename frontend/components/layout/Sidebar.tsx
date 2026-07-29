"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Star } from "lucide-react";
import { NavItem } from "./NavItem";
import { GenerationCounter } from "./GenerationCounter";
import { UserPopup } from "@/components/account/UserPopup";
import { useStore } from "@/lib/store";

const NAV_ITEMS = [
  { href: "/gallery", label: "Gallery", icon: Home },
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/favourites", label: "Favourites", icon: Star },
] as const;

/**
 * Persistent left sidebar — 208px wide.
 * Contains: logo, icon nav, generation counter, user row with popup.
 * Ported from thumbnail-generator-preview.jsx sidebar structure.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { favourites, generations } = useStore();

  return (
    <aside className="w-[--sidebar-width] bg-white border-r border-border-light p-[18px_12px] flex flex-col gap-[3px] shrink-0 box-border">
      {/* Logo row */}
      <div className="flex items-center gap-[9px] px-[6px] py-1 mb-[18px]">
        <div className="w-6 h-6 rounded-[7px] bg-ink shrink-0" />
        <span className="font-heading font-semibold text-[15px] text-ink">
          thumby
        </span>
      </div>

      {/* Navigation items */}
      {NAV_ITEMS.map(({ href, label, icon }) => (
        <NavItem
          key={href}
          href={href}
          label={label}
          icon={icon}
          active={pathname === href}
          badge={href === "/favourites" ? favourites.size : undefined}
        />
      ))}

      {/* Spacer + bottom section */}
      <div className="mt-auto pt-4">
        <GenerationCounter used={generations.length} cap={20} />
        <UserPopup />
      </div>
    </aside>
  );
}
