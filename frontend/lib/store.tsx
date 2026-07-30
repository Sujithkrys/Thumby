"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { GalleryThumbnail, Generation } from "./types";
import { createClient } from "./supabase-client";
import type { User } from "@supabase/supabase-js";

interface StoreContextType {
  user: User | null;
  profile: any | null; // public.profiles row
  favourites: Set<string>;
  toggleFav: (id: string) => Promise<void>;
  generations: Generation[];
  addGeneration: (gen: Generation) => void;
  draftReference: GalleryThumbnail | null;
  setDraftReference: (item: GalleryThumbnail | null) => void;
  updateName: (newName: string) => Promise<void>;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [draftReference, setDraftReference] = useState<GalleryThumbnail | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      if (!mounted) return;
      
      setUser(currentUser);

      if (currentUser) {
        // Load profile
        const { data: profData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        if (profData && mounted) setProfile(profData);

        // Load favourites
        const { data: favData } = await supabase
          .from("favourites")
          .select("thumbnail_id")
          .eq("user_id", currentUser.id);
        if (favData && mounted) {
          setFavourites(new Set(favData.map(f => f.thumbnail_id)));
        }

        // Load generations
        const { data: genData } = await supabase
          .from("generations")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });
        if (genData && mounted) {
          // Map to frontend Generation type
          setGenerations(genData.map(g => ({
            id: g.id,
            userId: g.user_id,
            prompt: g.prompt,
            aspectRatio: g.aspect_ratio,
            referenceType: g.reference_type,
            referenceUrl: g.reference_url,
            qualityTier: g.quality_tier,
            status: g.status,
            imageUrl: g.image_url,
            createdAt: g.created_at,
          })));
        }
      } else {
        setProfile(null);
        setFavourites(new Set());
        setGenerations([]);
      }
      setLoading(false);
    }

    loadData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        loadData();
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleFav = async (id: string) => {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Optimistic delete
        supabase.from("favourites").delete().eq("thumbnail_id", id).eq("user_id", user.id).then();
      } else {
        next.add(id);
        // Optimistic insert
        supabase.from("favourites").insert({ thumbnail_id: id, user_id: user.id }).then();
      }
      return next;
    });
  };

  const addGeneration = (gen: Generation) => {
    setGenerations((prev) => [gen, ...prev]);
  };

  const updateName = async (newName: string) => {
    if (!user) return;
    
    // Optimistic UI update
    setProfile((prev: any) => prev ? { ...prev, name: newName } : null);
    
    // Also update user metadata in state
    setUser((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        user_metadata: {
          ...(prev.user_metadata || {}),
          name: newName
        }
      };
    });

    // Update Supabase Auth metadata
    await supabase.auth.updateUser({ data: { name: newName } });
    
    // Update public.profiles table
    await supabase.from("profiles").update({ name: newName }).eq("id", user.id);
  };

  return (
    <StoreContext.Provider value={{ user, profile, favourites, toggleFav, generations, addGeneration, draftReference, setDraftReference, updateName, loading }}>
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
