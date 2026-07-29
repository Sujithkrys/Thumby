"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { GalleryThumbnail } from "./types";

interface GenerationMock {
  id: string;
  prompt: string;
  ratio: string;
  img: string;
}

interface StoreContextType {
  favourites: Set<string>;
  toggleFav: (id: string) => void;
  generations: GenerationMock[];
  addGeneration: (gen: GenerationMock) => void;
  draftReference: GalleryThumbnail | null;
  setDraftReference: (item: GalleryThumbnail | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [generations, setGenerations] = useState<GenerationMock[]>([]);
  const [draftReference, setDraftReference] = useState<GalleryThumbnail | null>(null);

  // Optional: load from localStorage if we want it to persist across reloads
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem("thumby_favs");
      if (savedFavs) setFavourites(new Set(JSON.parse(savedFavs)));
      const savedGens = localStorage.getItem("thumby_gens");
      if (savedGens) setGenerations(JSON.parse(savedGens));
    } catch (e) {}
  }, []);

  const toggleFav = (id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("thumby_favs", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const addGeneration = (gen: GenerationMock) => {
    setGenerations((prev) => {
      const next = [gen, ...prev];
      localStorage.setItem("thumby_gens", JSON.stringify(next));
      return next;
    });
  };

  return (
    <StoreContext.Provider value={{ favourites, toggleFav, generations, addGeneration, draftReference, setDraftReference }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
