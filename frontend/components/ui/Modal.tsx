"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  width?: string;
}

/**
 * Modal primitive — overlay backdrop with centered content panel.
 * Used by SettingsModal and potential future modals (report, etc.).
 */
export function Modal({ children, onClose, width = "520px" }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-overlay flex items-center justify-center z-30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[--radius-card] overflow-hidden shadow-[--shadow-modal] relative flex flex-col"
        style={{ width, maxWidth: "90%", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 border-none bg-transparent cursor-pointer text-slate hover:text-ink z-10"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
