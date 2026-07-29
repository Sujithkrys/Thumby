"use client";

import { User, Settings as SettingsIcon, LogOut, X } from "lucide-react";

interface SettingsModalProps {
  activeTab: "profile" | "account";
  onTabChange: (tab: "profile" | "account") => void;
  onClose: () => void;
}

const TABS = [
  { key: "profile" as const, label: "Profile", icon: User },
  { key: "account" as const, label: "Account", icon: SettingsIcon },
];

/**
 * Settings modal with left-tab navigation.
 * Profile tab: email, generation counter, grid of past generations.
 * Account tab: email (read-only), log out button.
 * Profile is NOT a separate page — it's a tab inside this modal.
 */
export function SettingsModal({
  activeTab,
  onTabChange,
  onClose,
}: SettingsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-overlay flex items-center justify-center z-30"
      onClick={onClose}
    >
      <div
        className="w-[520px] max-w-[90%] h-[380px] bg-white rounded-[--radius-card] flex overflow-hidden shadow-[--shadow-modal]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left sidebar tabs */}
        <div className="w-[150px] bg-studio p-[14px] flex flex-col gap-[2px] box-border">
          <span className="font-body text-[11px] text-slate font-semibold px-2 pb-[10px] pt-1">
            SETTINGS
          </span>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`flex items-center gap-2 px-2 py-2 rounded-[8px] border-none cursor-pointer font-body text-[12.5px] text-left ${
                activeTab === key
                  ? "bg-white text-ink font-semibold"
                  : "bg-transparent text-slate font-normal hover:bg-white/50"
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 p-[22px] box-border overflow-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 border-none bg-transparent cursor-pointer text-slate hover:text-ink"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>

          {activeTab === "profile" && (
            <div>
              <span className="font-heading font-semibold text-[15px] text-ink block mb-1">
                Profile
              </span>
              <p className="font-mono text-[11px] text-slate mb-4">
                test@thumby.app &middot; 0/20 generations used
              </p>
              {/* TODO: Generation history grid */}
              <p className="text-[13px] text-slate">No generations yet.</p>
            </div>
          )}

          {activeTab === "account" && (
            <div>
              <span className="font-heading font-semibold text-[15px] text-ink block mb-4">
                Account
              </span>
              <label className="block text-[12px] text-slate mb-[6px]">
                Email
              </label>
              <input
                value="test@thumby.app"
                readOnly
                className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio text-ink mb-4 box-border"
              />
              <button className="flex items-center gap-[6px] px-[15px] py-[9px] rounded-[--radius-button] border border-border-medium bg-white text-slate text-[13px] cursor-pointer hover:bg-studio">
                <LogOut size={14} aria-hidden="true" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
