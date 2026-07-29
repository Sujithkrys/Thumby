"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CategoryPill } from "@/components/ui/CategoryPill";

const CATEGORIES = [
  { label: "All categories", slug: "all" },
  { label: "Gaming", slug: "gaming" },
  { label: "Tech", slug: "tech" },
  { label: "Vlogs", slug: "vlogs" },
  { label: "Beauty", slug: "beauty" },
  { label: "Finance", slug: "finance" },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", slug);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 flex-wrap mb-[18px]">
      {CATEGORIES.map((cat) => (
        <CategoryPill
          key={cat.slug}
          label={cat.label}
          slug={cat.slug}
          active={activeCategory === cat.slug}
          onClick={() => handleCategory(cat.slug)}
        />
      ))}
    </div>
  );
}
