"use client";

import { useState } from "react";
import { Star, Copy, Check } from "lucide-react";
import type { GalleryThumbnail } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";

interface ThumbnailDetailModalProps {
  item: GalleryThumbnail;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onUseAsPrompt: () => void;
  onUseAsReference: () => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  gaming: "Gaming",
  tech: "Tech",
  vlogs: "Vlogs",
  beauty: "Beauty",
  finance: "Finance",
};

export function ThumbnailDetailModal({
  item,
  isFav,
  onToggleFav,
  onUseAsPrompt,
  onUseAsReference,
  onClose,
}: ThumbnailDetailModalProps) {
  const [showMore, setShowMore] = useState(false);
  const [copied, setCopied] = useState(false);

  const aspectRatioString = item.aspectRatio.replace(":", "/");
  const PROMPT_TRUNCATE_LEN = 150;
  
  const isTruncated = item.prompt.length > PROMPT_TRUNCATE_LEN;
  const displayPrompt = (!showMore && isTruncated) 
    ? item.prompt.slice(0, PROMPT_TRUNCATE_LEN) + "..."
    : item.prompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal onClose={onClose} width="480px">
      {/* Image header area */}
      <div 
        className="w-full bg-studio relative overflow-hidden" 
        style={{ aspectRatio: aspectRatioString, maxHeight: '350px' }}
      >
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
        
        {/* Star button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(item.id);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-colors border-none flex items-center justify-center cursor-pointer shadow-sm"
          aria-label="Toggle Favourite"
        >
          <Star
            size={18}
            fill={isFav ? "var(--color-gold)" : "none"}
            color={isFav ? "var(--color-gold)" : "white"}
          />
        </button>
      </div>

      {/* Details body */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-heading font-semibold text-[17px] text-ink m-0 mb-2 leading-tight">
            {item.title}
          </h2>
          <span className="bg-studio text-slate text-[11px] px-2 py-[2px] rounded-[--radius-pill] border border-border-light font-body">
            {CATEGORY_LABELS[item.categorySlug] || item.categorySlug}
          </span>
        </div>

        {/* Prompt Section */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <h3 className="font-heading font-semibold text-[13px] text-ink m-0">Prompt</h3>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer text-slate hover:text-ink transition-colors"
            >
              {copied ? (
                <span className="text-[11px] font-body text-green-600 flex items-center gap-1">
                  <Check size={12} /> Copied
                </span>
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
          <div className="bg-studio p-3 rounded-[--radius-card] border border-border-light">
            <p className="font-body text-[13px] text-slate m-0 leading-relaxed whitespace-pre-wrap">
              {displayPrompt}
            </p>
            {isTruncated && (
              <button 
                onClick={() => setShowMore(!showMore)}
                className="mt-2 text-[12px] font-body text-ink font-medium bg-transparent border-none p-0 cursor-pointer hover:underline"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button 
            onClick={() => { onClose(); onUseAsPrompt(); }}
            className="w-full py-2.5 rounded-[--radius-button] border border-border-medium bg-white text-ink font-body text-[13px] font-medium cursor-pointer hover:bg-studio transition-colors"
          >
            Use as prompt
          </button>
          <button 
            onClick={() => { onClose(); onUseAsReference(); }}
            className="w-full py-2.5 rounded-[--radius-button] border-none bg-ink text-white font-body text-[13px] font-medium cursor-pointer hover:bg-ink/90 transition-colors shadow-sm"
          >
            Use as reference
          </button>
        </div>
      </div>
    </Modal>
  );
}
