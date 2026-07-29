import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Thumbnail — Thumby Internal",
  description: "Internal page for founders to add gallery thumbnails.",
};

/**
 * Internal upload page — founder-only.
 * Single form: image, prompt, category, title.
 * Build order: Phase 6.
 */
export default function AddThumbnailPage() {
  return (
    <div className="max-w-[600px]">
      <h1 className="font-heading font-semibold text-[19px] text-ink mb-2">
        Add Gallery Thumbnail
      </h1>
      <p className="text-[12px] text-slate mb-6">
        Founder-only — add a new thumbnail to the public gallery.
      </p>

      {/* TODO: Founder gate check — redirect non-founders */}

      <div className="bg-white border border-border-light rounded-[--radius-card] p-6 space-y-5">
        <div>
          <label className="block text-[12px] text-slate mb-1.5">Title</label>
          <input
            type="text"
            placeholder="e.g. Boss fight reaction"
            className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio"
          />
        </div>

        <div>
          <label className="block text-[12px] text-slate mb-1.5">Prompt</label>
          <textarea
            rows={3}
            placeholder="The prompt used to generate this thumbnail"
            className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio resize-none"
          />
        </div>

        <div>
          <label className="block text-[12px] text-slate mb-1.5">
            Category
          </label>
          <select className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio">
            <option value="">Select a category</option>
            <option value="gaming">Gaming</option>
            <option value="tech">Tech</option>
            <option value="vlogs">Vlogs</option>
            <option value="beauty">Beauty</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        <div>
          <label className="block text-[12px] text-slate mb-1.5">
            Aspect Ratio
          </label>
          <div className="flex gap-2">
            {["16:9", "9:16", "1:1"].map((ratio) => (
              <button
                key={ratio}
                className="font-mono text-[11px] px-2 py-[5px] rounded-[6px] border border-border-medium bg-white text-slate cursor-pointer"
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[12px] text-slate mb-1.5">Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-[13px] text-slate"
          />
        </div>

        <div className="flex items-start gap-1.5">
          <input type="checkbox" className="mt-0.5" />
          <span className="text-[11.5px] text-slate">
            I confirm I have the rights to upload this image.
          </span>
        </div>

        <button className="w-full p-[13px] rounded-[11px] border-none bg-flare text-flare-muted font-body text-[14px] font-semibold cursor-pointer">
          Upload to Gallery
        </button>
      </div>

      {/* TODO: Reports viewer + Account disable / Content removal controls */}
    </div>
  );
}
