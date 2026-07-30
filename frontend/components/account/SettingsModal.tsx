"use client";

import { useState } from "react";
import { User, Settings as SettingsIcon, LogOut, X, Activity, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase-client";

interface SettingsModalProps {
  activeTab: "profile" | "account" | "usage";
  onTabChange: (tab: "profile" | "account" | "usage") => void;
  onClose: () => void;
}

const TABS = [
  { key: "profile" as const, label: "Profile", icon: User },
  { key: "account" as const, label: "Account", icon: SettingsIcon },
  { key: "usage" as const, label: "Usage", icon: Activity },
];

export function SettingsModal({
  activeTab,
  onTabChange,
  onClose,
}: SettingsModalProps) {
  const { user, profile, generations, updateName } = useStore();
  const supabase = createClient();
  const GEN_CAP = 20;

  // Account tab states
  const [nameInput, setNameInput] = useState(user?.user_metadata?.name || "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });

  const [deleteStep, setDeleteStep] = useState<"initial" | "confirm">("initial");
  const [deleteEmailInput, setDeleteEmailInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleSaveName = async () => {
    setNameSaving(true);
    setNameMsg("");
    try {
      await updateName(nameInput);
      setNameMsg("Name updated successfully.");
      setTimeout(() => setNameMsg(""), 3000);
    } catch (err: any) {
      setNameMsg("Failed to update name.");
    } finally {
      setNameSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setPwdSaving(true);
    setPwdMsg({ type: "", text: "" });
    try {
      // In Supabase, if the user is signed in, you can just update the password
      // Note: we don't necessarily need the current password unless we manually verify it,
      // but standard Supabase auth.updateUser allows changing password without current password
      // if the user's session is active. We just pass new password.
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwdMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdMsg({ type: "", text: "" }), 3000);
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setPwdSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteEmailInput !== user?.email) {
      setDeleteError("Email does not match.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");
      
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to delete account");
      }
      
      await supabase.auth.signOut();
      window.location.href = "/gallery";
    } catch (err: any) {
      setDeleteError(err.message || "An error occurred.");
      setDeleteLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-overlay flex items-center justify-center z-30"
      onClick={onClose}
    >
      <div
        className="w-[720px] max-w-[90vw] h-[540px] max-h-[85vh] bg-white rounded-[16px] flex overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left sidebar tabs */}
        <div className="w-[220px] bg-studio/50 p-6 flex flex-col gap-1 box-border border-r border-border-light">
          <span className="font-body text-[12px] text-slate font-semibold px-3 pb-3 pt-2 tracking-wider">
            SETTINGS
          </span>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                onTabChange(key);
                setDeleteStep("initial");
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-[8px] border-none cursor-pointer font-body text-[14px] text-left transition-colors ${
                activeTab === key
                  ? "bg-white shadow-sm text-ink font-semibold"
                  : "bg-transparent text-slate font-medium hover:bg-black/5"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 p-10 box-border overflow-auto relative custom-scrollbar">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 border-none bg-transparent cursor-pointer text-slate hover:text-ink transition-colors p-2"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>

          {activeTab === "profile" && (
            <div className="max-w-[480px]">
              <span className="font-heading font-semibold text-[24px] text-ink block mb-8">
                Profile
              </span>
              
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
                      {g.imageUrl ? (
                        <img
                          src={g.imageUrl}
                          alt={g.prompt}
                          className="w-full aspect-video object-cover block"
                        />
                      ) : (
                        <div className="w-full aspect-video bg-studio flex items-center justify-center text-[12px] text-slate">
                          Processing
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "account" && (
            <div className="max-w-[420px]">
              <span className="font-heading font-semibold text-[24px] text-ink block mb-8">
                Account Settings
              </span>
              
              <div className="mb-6">
                <label className="block text-[14px] font-medium text-ink mb-2">
                  Name
                </label>
                <div className="flex gap-3">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 text-[14px] px-4 py-2.5 rounded-[8px] border border-border-medium focus:border-ink focus:outline-none transition-colors"
                  />
                  <button 
                    onClick={handleSaveName}
                    disabled={nameSaving}
                    className="px-4 py-2.5 bg-flare text-flare-muted rounded-[8px] font-medium text-[14px] cursor-pointer hover:opacity-90 disabled:opacity-70 transition-opacity border-none"
                  >
                    {nameSaving ? "Saving..." : "Save"}
                  </button>
                </div>
                {nameMsg && <p className="text-[13px] text-green-600 mt-2">{nameMsg}</p>}
              </div>

              <div className="mb-8">
                <label className="block text-[14px] font-medium text-ink mb-2">
                  Email Address
                </label>
                <input
                  value={user?.email || ""}
                  readOnly
                  className="w-full text-[14px] px-4 py-2.5 rounded-[8px] border border-border-medium bg-studio text-slate cursor-not-allowed outline-none"
                />
              </div>
              
              <div className="mb-8 pt-8 border-t border-border-light">
                <h3 className="font-heading font-semibold text-[16px] text-ink mb-4">Change Password</h3>
                <div className="flex flex-col gap-3 mb-4">
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-[14px] px-4 py-2.5 rounded-[8px] border border-border-medium focus:border-ink focus:outline-none transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-[14px] px-4 py-2.5 rounded-[8px] border border-border-medium focus:border-ink focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleSavePassword}
                    disabled={pwdSaving || !newPassword || !confirmPassword}
                    className="px-4 py-2.5 bg-white border border-border-medium text-ink rounded-[8px] font-medium text-[14px] cursor-pointer hover:bg-studio disabled:opacity-50 transition-colors"
                  >
                    {pwdSaving ? "Updating..." : "Update password"}
                  </button>
                  {pwdMsg.text && (
                    <span className={`text-[13px] ${pwdMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                      {pwdMsg.text}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-border-light mb-8">
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/gallery";
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] border border-border-medium bg-white text-ink font-medium text-[14px] cursor-pointer hover:bg-studio transition-colors shadow-sm"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Log out of all devices
                </button>
              </div>

              {/* Danger Zone */}
              <div className="mt-12 p-5 rounded-[12px] border border-red-200 bg-red-50/50">
                <h3 className="font-heading font-semibold text-[16px] text-red-700 flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} />
                  Danger Zone
                </h3>
                
                {deleteStep === "initial" ? (
                  <>
                    <p className="text-[13px] text-red-600/80 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button 
                      onClick={() => setDeleteStep("confirm")}
                      className="px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-[8px] font-medium text-[14px] cursor-pointer hover:bg-red-50 transition-colors"
                    >
                      Delete your account
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[13px] text-red-600/80 mb-4">
                      This action cannot be undone. This will permanently delete your account and all your generations.
                      <br /><br />
                      Please type <strong>{user?.email}</strong> to confirm.
                    </p>
                    <input
                      value={deleteEmailInput}
                      onChange={(e) => setDeleteEmailInput(e.target.value)}
                      placeholder={user?.email}
                      className="w-full text-[14px] px-4 py-2.5 rounded-[8px] border border-red-300 focus:border-red-500 focus:outline-none mb-3 bg-white"
                    />
                    {deleteError && <p className="text-[13px] text-red-600 mb-3">{deleteError}</p>}
                    <div className="flex gap-2">
                      <button 
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading || deleteEmailInput !== user?.email}
                        className="px-4 py-2.5 bg-red-600 text-white border-none rounded-[8px] font-medium text-[14px] cursor-pointer hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {deleteLoading ? "Deleting..." : "I understand, delete my account"}
                      </button>
                      <button 
                        onClick={() => {
                          setDeleteStep("initial");
                          setDeleteEmailInput("");
                          setDeleteError("");
                        }}
                        disabled={deleteLoading}
                        className="px-4 py-2.5 bg-transparent text-slate border-none rounded-[8px] font-medium text-[14px] cursor-pointer hover:bg-red-100/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="max-w-[480px]">
              <span className="font-heading font-semibold text-[24px] text-ink block mb-8">
                Usage
              </span>
              
              <div className="bg-studio rounded-[16px] p-6 border border-border-light">
                <div className="flex justify-between items-end mb-4">
                  <span className="font-body text-[16px] font-medium text-ink">
                    Generations
                  </span>
                  <span className="font-body text-[20px] font-semibold text-ink">
                    {generations.length} <span className="text-[14px] text-slate font-normal">/ {GEN_CAP}</span>
                  </span>
                </div>
                
                <div className="w-full bg-border-light h-3 rounded-full overflow-hidden mb-6">
                  <div 
                    className="bg-flare h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (generations.length / GEN_CAP) * 100)}%` }}
                  />
                </div>
                
                <p className="text-[14px] text-slate font-body leading-relaxed">
                  Each account gets {GEN_CAP} generations. This resets are not yet available — contact us if you need more.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
