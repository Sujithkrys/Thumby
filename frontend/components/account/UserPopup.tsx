"use client";

import { useState } from "react";
import { User, Settings as SettingsIcon, LogOut } from "lucide-react";
import { SettingsModal } from "./SettingsModal";

interface UserPopupProps {
  isExpanded?: boolean;
}

/**
 * User popup — triggered from user row at bottom of sidebar.
 * Menu items: Profile (→ settings modal, Profile tab),
 * Settings (→ settings modal, Account tab), Log out.
 */
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export function UserPopup({ isExpanded = true }: UserPopupProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "account" | "usage">("profile");
  
  const { user, profile } = useStore();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/gallery");
  };

  function openSettings(tab: "profile" | "account" | "usage") {
    setSettingsTab(tab);
    setSettingsOpen(true);
    setMenuOpen(false);
  }

  return (
    <div className="relative">
      {/* Popup menu */}
      {menuOpen && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-[180px] bg-white rounded-[12px] border border-border-light shadow-[--shadow-popup] p-[6px] z-20">
            <button
              onClick={() => openSettings("profile")}
              className="flex items-center gap-[9px] w-full px-[10px] py-2 rounded-[8px] border-none bg-transparent cursor-pointer font-body text-[12.5px] text-ink text-left hover:bg-studio"
            >
              <User size={14} className="text-slate" aria-hidden="true" />
              Profile
            </button>
            <button
              onClick={() => openSettings("account")}
              className="flex items-center gap-[9px] w-full px-[10px] py-2 rounded-[8px] border-none bg-transparent cursor-pointer font-body text-[12.5px] text-ink text-left hover:bg-studio"
            >
              <SettingsIcon
                size={14}
                className="text-slate"
                aria-hidden="true"
              />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-[9px] w-full px-[10px] py-2 rounded-[8px] border-none bg-transparent cursor-pointer font-body text-[12.5px] text-ink text-left hover:bg-studio"
            >
              <LogOut size={14} className="text-slate" aria-hidden="true" />
              Log out
            </button>
          </div>
        </>
      )}

      {/* User row button */}
      <button
        onClick={() => {
          if (user) setMenuOpen((v) => !v);
          else window.location.href = "/auth/login";
        }}
        className={`flex items-center gap-[9px] border-none rounded-[10px] cursor-pointer transition-colors ${
          menuOpen ? "bg-studio" : "bg-transparent hover:bg-studio"
        } ${isExpanded ? "p-[6px] w-full" : "p-[6px] w-10 h-10 justify-center"}`}
        title={!isExpanded ? (user ? (user.user_metadata?.name || user.email) : "Log in") : undefined}
      >
        <div className="w-[26px] h-[26px] rounded-full bg-avatar-bg flex items-center justify-center text-[11px] font-body font-semibold text-slate shrink-0 overflow-hidden">
          {user ? (
            profile?.profile_picture ? (
              <img src={profile.profile_picture} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              (user.user_metadata?.name || user.email || "?").charAt(0).toUpperCase()
            )
          ) : (
            "?"
          )}
        </div>
        {isExpanded && (
          <span className="font-body text-[12.5px] text-ink truncate flex-1 text-left">
            {user ? (user.user_metadata?.name || user.email?.split("@")[0]) : "Log in"}
          </span>
        )}
      </button>

      {/* Settings modal */}
      {settingsOpen && user && (
        <SettingsModal
          activeTab={settingsTab}
          onTabChange={setSettingsTab}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
