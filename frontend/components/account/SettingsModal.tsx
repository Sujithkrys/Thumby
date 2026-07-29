"use client";

import { User, Settings as SettingsIcon, LogOut, X } from "lucide-react";
import { useStore } from "@/lib/store";

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
  const { generations } = useStore();

  return (
    <div
      className="fixed inset-0 bg-overlay flex items-center justify-center z-30"
      onClick={onClose}
    >
      <div
        className="w-[720px] max-w-[95vw] h-[550px] max-h-[90vh] bg-white rounded-[16px] flex overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left sidebar tabs */}
        <div className="w-[200px] bg-studio/50 p-4 flex flex-col gap-1 box-border border-r border-border-light">
          <span className="font-body text-[12px] text-slate font-semibold px-3 pb-2 pt-2 tracking-wider">
            SETTINGS
          </span>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] border-none cursor-pointer font-body text-[14px] text-left transition-colors ${
                activeTab === key
                  ? "bg-white shadow-sm text-ink font-semibold"
                  : "bg-transparent text-slate font-medium hover:bg-black/5"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 p-8 box-border overflow-auto relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 border-none bg-transparent cursor-pointer text-slate hover:text-ink transition-colors"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>

          {activeTab === "profile" && (
            <div className="max-w-[480px]">
              <span className="font-heading font-semibold text-[22px] text-ink block mb-2">
                Profile
              </span>
              <p className="font-body text-[14px] text-slate mb-6 pb-6 border-b border-border-light">
                test@thumby.app &middot; {generations.length}/20 generations used
              </p>
              
              <h3 className="font-heading font-medium text-[16px] text-ink mb-4">Your Generations</h3>
              {generations.length === 0 ? (
                <p className="text-[14px] text-slate bg-studio p-4 rounded-[8px]">No generations yet.</p>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
                  {generations.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-[12px] overflow-hidden border border-border-light shadow-sm"
                    >
                      <img
                        src={g.img}
                        alt={g.prompt}
                        className="w-full aspect-video object-cover block"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "account" && (
            <div className="max-w-[400px]">
              <span className="font-heading font-semibold text-[22px] text-ink block mb-6">
                Account Settings
              </span>
              
              <div className="mb-6">
                <label className="block text-[14px] font-medium text-ink mb-2">
                  Email Address
                </label>
                <input
                  value="test@thumby.app"
                  readOnly
                  className="w-full text-[14px] p-3 rounded-[8px] border border-border-medium bg-studio text-slate mb-2 box-border outline-none"
                />
                <p className="text-[12px] text-slate">Your email address is used for billing and login.</p>
              </div>
              
              <div className="pt-6 border-t border-border-light">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] border border-border-medium bg-white text-ink font-medium text-[14px] cursor-pointer hover:bg-studio transition-colors shadow-sm">
                  <LogOut size={16} aria-hidden="true" />
                  Log out of all devices
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
