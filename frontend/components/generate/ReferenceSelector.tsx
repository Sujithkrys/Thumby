import { Images } from "lucide-react";

interface ReferenceSelectorProps {
  refType: "gallery" | "upload" | "none";
  refItem?: any;
}

export function ReferenceSelector({ refType, refItem }: ReferenceSelectorProps) {
  if (refType === "gallery") {
    if (refItem) {
      return (
        <div className="flex items-center gap-2 mb-[14px] text-[12px] text-slate">
          <img 
            src={refItem.imageUrl || refItem.img} 
            alt={refItem.title} 
            className="w-12 h-8 object-cover rounded-[6px]" 
          />
          <span>{refItem.title}</span>
        </div>
      );
    }
    return (
      <p className="text-[12px] text-slate mb-[14px] flex items-center gap-[6px]">
        <Images size={14} aria-hidden="true" /> Pick a thumbnail from the
        gallery first.
      </p>
    );
  }

  if (refType === "upload") {
    // Phase 1 upload stub
    return null;
  }

  return null;
}
