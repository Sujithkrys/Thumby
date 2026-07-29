"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Star, PanelLeftClose, PanelLeft } from "lucide-react";
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
 * Persistent left sidebar — 250px expanded, 64px collapsed.
 * Contains: logo, icon nav, generation counter, user row with popup.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { favourites, generations } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside 
      className={`bg-white border-r border-border-light flex flex-col shrink-0 box-border transition-all duration-300 ${
        isExpanded ? "w-[250px] p-[18px_12px] gap-[3px]" : "w-[68px] p-[18px_8px] gap-[3px] items-center"
      }`}
    >
      {/* Logo row */}
      <div className={`flex items-center mb-[18px] w-full ${isExpanded ? "justify-between px-[6px] py-1" : "justify-center"}`}>
        {isExpanded && (
          <div className="flex items-center gap-[9px]">
            <div className="w-6 h-6 rounded-[7px] bg-ink shrink-0" />
            <span className="font-heading font-semibold text-[15px] text-ink">
              thumby
            </span>
          </div>
        )}
        {!isExpanded && <div className="w-6 h-6 rounded-[7px] bg-ink shrink-0 mb-4" />}
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`border-none bg-transparent cursor-pointer text-slate hover:text-ink flex items-center justify-center rounded-[8px] hover:bg-studio transition-colors ${
            isExpanded ? "p-[4px]" : "w-10 h-10 p-[0px]"
          }`}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <PanelLeftClose size={18} /> : <PanelLeft size={20} />}
        </button>
      </div>

      {/* Navigation items */}
      <div className={`flex flex-col gap-[3px] ${isExpanded ? "" : "w-full items-center"}`}>
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href}
            badge={href === "/favourites" ? favourites.size : undefined}
            isExpanded={isExpanded}
          />
        ))}
      </div>

      {/* Spacer + bottom section */}
      <div className={`mt-auto pt-4 ${isExpanded ? "" : "w-full flex flex-col items-center"}`}>
        <GenerationCounter used={generations.length} cap={20} isExpanded={isExpanded} />
        <UserPopup isExpanded={isExpanded} />
      </div>
    </aside>
  );
}
