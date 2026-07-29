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
export function UserPopup({ isExpanded = true }: UserPopupProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "account">(
    "profile"
  );

  function openSettings(tab: "profile" | "account") {
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
              onClick={() => setMenuOpen(false)}
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
        onClick={() => setMenuOpen((v) => !v)}
        className={`flex items-center gap-[9px] border-none rounded-[10px] cursor-pointer transition-colors ${
          menuOpen ? "bg-studio" : "bg-transparent hover:bg-studio"
        } ${isExpanded ? "p-[6px] w-full" : "p-[6px] w-10 h-10 justify-center"}`}
        title={!isExpanded ? "Test user" : undefined}
      >
        <div className="w-[26px] h-[26px] rounded-full bg-avatar-bg flex items-center justify-center text-[11px] font-body font-semibold text-slate shrink-0">
          TU
        </div>
        {isExpanded && <span className="font-body text-[12.5px] text-ink">Test user</span>}
      </button>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal
          activeTab={settingsTab}
          onTabChange={setSettingsTab}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
