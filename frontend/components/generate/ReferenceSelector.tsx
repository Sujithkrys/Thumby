import { Images } from "lucide-react";

interface ReferenceSelectorProps {
  refType: "gallery" | "upload" | "none";
}

/**
 * Reference selector content area.
 * Shows gallery reference thumbnail or upload guidance based on refType.
 */
export function ReferenceSelector({ refType }: ReferenceSelectorProps) {
  if (refType === "gallery") {
    // TODO: Show selected gallery item or prompt to pick one
    return (
      <p className="text-[12px] text-slate mb-[14px] flex items-center gap-[6px]">
        <Images size={14} aria-hidden="true" /> Pick a thumbnail from the
        gallery first.
      </p>
    );
  }

  if (refType === "upload") {
    // TODO: File upload input
    return (
      <div className="mb-[14px]">
        <input
          type="file"
          accept="image/*"
          className="text-[12px] text-slate"
        />
      </div>
    );
  }

  return null;
}
