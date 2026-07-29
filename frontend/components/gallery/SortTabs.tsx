"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "popular", label: "Popular" },
] as const;

/**
 * Sort tabs — Featured / Newest / Popular.
 * Right-aligned pill-group style with ink-bg active state.
 */
export function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") || "featured";

  const handleSort = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", key);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 bg-white p-1 rounded-[10px] border border-border-light">
      {SORT_OPTIONS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => handleSort(key)}
          className={`px-[13px] py-[6px] rounded-[8px] text-[12.5px] font-body cursor-pointer border-none transition-colors ${
            activeSort === key
              ? "bg-ink text-studio font-semibold"
              : "bg-transparent text-slate font-normal hover:bg-studio"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
