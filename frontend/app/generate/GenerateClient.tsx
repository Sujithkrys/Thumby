"use client";

import { useState, useEffect } from "react";
import { GenerateForm } from "@/components/generate/GenerateForm";
import { PreviewPanel } from "@/components/generate/PreviewPanel";
import { generateThumbnail, uploadReferenceImage } from "@/lib/api-client";
import { createClient } from "@/lib/supabase-client";
import { useStore } from "@/lib/store";

export function GenerateClient() {
  const [prompt, setPrompt] = useState("");
  const [refType, setRefType] = useState<"gallery" | "upload" | "none">("none");
  const [refItem, setRefItem] = useState<any>(null);
  const [ratio, setRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [quality, setQuality] = useState<"standard" | "hd">("standard");
  const [rightsOk, setRightsOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const { generations, addGeneration, draftReference, setDraftReference } = useStore();
  const supabase = createClient();
  const GEN_CAP = 20;

  useEffect(() => {
    if (draftReference) {
      setRefType("gallery");
      setRefItem(draftReference);
      setRatio(draftReference.aspectRatio as "16:9" | "9:16" | "1:1");
      setDraftReference(null);
    }
  }, [draftReference, setDraftReference]);

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError("Write a prompt before generating.");
      return;
    }
    if (refType === "upload" && !rightsOk) {
      setError("Confirm this image is yours or you have permission to use it.");
      return;
    }
    if (generations.length >= GEN_CAP) {
      setError(`You've reached the ${GEN_CAP} generation limit.`);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("You must be logged in to generate thumbnails.");
        setLoading(false);
        return;
      }

      let referenceUrl = undefined;
      
      if (refType === "gallery" && refItem?.imageUrl) {
        referenceUrl = refItem.imageUrl;
      } else if (refType === "upload" && refItem) {
        // refItem is a File here (assuming GenerateForm sets it as such)
        referenceUrl = await uploadReferenceImage(refItem, session.access_token);
      }

      const res = await generateThumbnail({
        prompt,
        aspectRatio: ratio,
        qualityTier: quality,
        referenceType: refType,
        referenceUrl,
        rightsConfirmed: rightsOk,
      }, session.access_token);
      
      const newGen = {
        id: res.id,
        userId: session.user.id,
        prompt,
        aspectRatio: ratio,
        referenceType: refType,
        referenceUrl,
        qualityTier: quality,
        status: res.status,
        imageUrl: res.imageUrl,
        createdAt: new Date().toISOString(),
      };
      
      setResult(newGen);
      addGeneration(newGen);
    } catch (err: any) {
      setError(err.message || "Failed to generate thumbnail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[1240px] mx-auto flex gap-5 items-stretch min-h-[75vh]">
      <GenerateForm 
        prompt={prompt} setPrompt={setPrompt}
        refType={refType} setRefType={setRefType}
        ratio={ratio} setRatio={setRatio}
        quality={quality} setQuality={setQuality}
        rightsOk={rightsOk} setRightsOk={setRightsOk}
        loading={loading} error={error}
        handleGenerate={handleGenerate}
        remaining={GEN_CAP - generations.length}
        refItem={refItem}
      />
      <PreviewPanel 
        result={result}
        ratio={ratio}
      />
    </div>
  );
}
