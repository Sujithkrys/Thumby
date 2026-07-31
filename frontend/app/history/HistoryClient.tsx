"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Search } from "lucide-react";

export function HistoryClient() {
  const { generations } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGenerations = generations.filter((g) =>
    g.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-semibold text-[24px] text-ink mb-1">
            Generation History
          </h1>
          <p className="font-body text-[14px] text-slate">
            All your generated thumbnails in one place.
          </p>
        </div>
        
        <div className="relative w-full md:w-[320px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
          <input
            type="text"
            placeholder="Search by prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[14px] pl-[34px] pr-4 py-2.5 rounded-[8px] border border-border-medium focus:border-ink focus:outline-none transition-colors"
          />
        </div>
      </div>

      {filteredGenerations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[16px] border border-border-light shadow-sm">
          <p className="text-[14px] text-slate">
            {searchQuery ? "No generations match your search." : "You haven't generated any thumbnails yet."}
          </p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-[14px]">
          {filteredGenerations.map((g) => (
            <div
              key={g.id}
              className="mb-[14px] break-inside-avoid relative group rounded-[12px] overflow-hidden border border-border-light shadow-sm bg-white hover:border-ink transition-colors cursor-pointer"
              onClick={() => {
                if (g.imageUrl) window.open(g.imageUrl, "_blank");
              }}
            >
              <div 
                className="w-full bg-studio relative flex items-center justify-center"
                style={{ aspectRatio: g.aspectRatio === '16:9' ? '16/9' : g.aspectRatio === '9:16' ? '9/16' : '1/1' }}
              >
                {g.imageUrl ? (
                  <img
                    src={g.imageUrl}
                    alt={g.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-[12px] text-slate font-medium">Processing</span>
                )}
                
                <span className="absolute bottom-2 right-2 bg-ink/80 text-studio font-mono text-[10px] px-1.5 py-0.5 rounded-[4px] backdrop-blur-sm shadow-sm leading-none z-10 pointer-events-none">
                  {g.aspectRatio}
                </span>
              </div>
              
              <div className="p-[10px]">
                <p 
                  className="font-body text-[12px] text-ink leading-snug line-clamp-2"
                  title={g.prompt}
                >
                  {g.prompt}
                </p>
                <div className="mt-2 text-[10px] text-slate font-medium uppercase tracking-wider">
                  {new Date(g.createdAt).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
