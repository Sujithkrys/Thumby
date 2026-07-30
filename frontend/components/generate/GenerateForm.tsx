"use client";

import { useState } from "react";
import { Upload, Images, Loader2 } from "lucide-react";
import { ReferenceSelector } from "./ReferenceSelector";
import { RightsCheckbox } from "./RightsCheckbox";

const RATIOS = ["16:9", "9:16", "1:1"] as const;
const QUALITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Med" },
  { value: "high", label: "High" },
] as const;

interface GenerateFormProps {
  prompt: string;
  setPrompt: (v: string) => void;
  refType: "gallery" | "upload" | "none";
  setRefType: (v: "gallery" | "upload" | "none") => void;
  ratio: string;
  setRatio: (v: string) => void;
  quality: string;
  setQuality: (v: string) => void;
  rightsOk: boolean;
  setRightsOk: (v: boolean) => void;
  loading: boolean;
  error: string;
  handleGenerate: () => void;
  remaining: number;
  refItem: any;
}

export function GenerateForm({
  prompt, setPrompt,
  refType, setRefType,
  ratio, setRatio,
  quality, setQuality,
  rightsOk, setRightsOk,
  loading, error,
  handleGenerate,
  remaining,
  refItem
}: GenerateFormProps) {

  return (
    <div className="w-[340px] shrink-0 flex flex-col bg-white border border-border-light rounded-[--radius-card] p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-heading font-semibold text-[15px] text-ink">
          New thumbnail
        </span>
        <span className="font-mono text-[11px] text-slate">
          {remaining}/20 left
        </span>
      </div>

      {/* Prompt */}
      <label className="block text-[12px] text-slate mb-[6px] font-body">
        Prompt
      </label>
      <textarea
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="A shocked face reacting to a boss fight, bold red arrow, dramatic lighting"
        className="w-full font-body text-[13px] p-[10px] rounded-[--radius-button] border border-border-medium mb-[14px] box-border bg-studio resize-none"
      />

      {/* Reference type selector */}
      <label className="block text-[12px] text-slate mb-[6px] font-body">
        Reference
      </label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setRefType("gallery")}
          className={`flex-1 p-[9px] rounded-[--radius-button] text-[12px] font-body cursor-pointer border transition-colors ${
            refType === "gallery"
              ? "bg-ink text-studio border-ink"
              : "bg-white text-slate border-border-medium"
          }`}
        >
          From gallery
        </button>
        <button
          onClick={() => setRefType("upload")}
          className={`flex-1 p-[9px] rounded-[--radius-button] text-[12px] font-body cursor-pointer border flex items-center justify-center gap-1 transition-colors ${
            refType === "upload"
              ? "bg-ink text-studio border-ink"
              : "bg-white text-slate border-border-medium"
          }`}
        >
          <Upload size={12} aria-hidden="true" /> Upload
        </button>
      </div>

      {/* Reference content */}
      <ReferenceSelector refType={refType} refItem={refItem} />

      {/* Upload rights checkbox */}
      {refType === "upload" && (
        <RightsCheckbox checked={rightsOk} onChange={setRightsOk} />
      )}

      {/* Aspect ratio + Quality */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-[12px] text-slate mb-[6px]">
            Aspect ratio
          </label>
          <div className="flex gap-[5px]">
            {RATIOS.map((r) => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                className={`font-mono text-[11px] px-2 py-[5px] rounded-[6px] cursor-pointer border transition-colors ${
                  ratio === r
                    ? "bg-ink text-studio border-ink"
                    : "bg-white text-slate border-border-medium"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-[12px] text-slate mb-[6px]">
            Quality
          </label>
          <div className="flex gap-[5px]">
            {QUALITIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setQuality(value)}
                className={`text-[11px] px-2 py-[5px] rounded-[6px] cursor-pointer border transition-colors ${
                  quality === value
                    ? "bg-ink text-studio border-ink"
                    : "bg-white text-slate border-border-medium"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[12px] text-flare mb-[10px]">{error}</p>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full p-[13px] mt-auto rounded-[11px] border-none bg-flare text-flare-muted font-body text-[14px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-opacity disabled:opacity-70 disabled:cursor-default"
      >
        {loading && (
          <Loader2
            size={14}
            className="animate-thumby-spin"
            aria-hidden="true"
          />
        )}
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
