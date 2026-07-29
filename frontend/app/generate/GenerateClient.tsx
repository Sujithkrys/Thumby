"use client";

import { useState, useEffect } from "react";
import { GenerateForm } from "@/components/generate/GenerateForm";
import { PreviewPanel } from "@/components/generate/PreviewPanel";
import { useStore } from "@/lib/store";

export function GenerateClient() {
  const [prompt, setPrompt] = useState("");
  const [refType, setRefType] = useState<"gallery" | "upload" | "none">("none");
  const [refItem, setRefItem] = useState<any>(null);
  const [ratio, setRatio] = useState("16:9");
  const [quality, setQuality] = useState("medium");
  const [rightsOk, setRightsOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const { generations, addGeneration, draftReference, setDraftReference } = useStore();
  const GEN_CAP = 20;

  useEffect(() => {
    if (draftReference) {
      setRefType("gallery");
      setRefItem(draftReference);
      setRatio(draftReference.aspectRatio || "16:9");
      // Clear it so it doesn't override next time they visit manually
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

    // Mock generation from prototype
    setTimeout(() => {
      const seed = Math.floor(Math.random() * 10000);
      const [w, h] = ratio === "9:16" ? [360, 640] : ratio === "1:1" ? [500, 500] : [640, 360];
      const gen = { 
        id: `gen${Date.now()}`, 
        prompt, 
        ratio, 
        img: `https://picsum.photos/seed/gen${seed}/${w}/${h}` 
      };
      
      setResult(gen);
      addGeneration(gen);
      setLoading(false);
    }, 1800);
  }

  return (
    <div className="flex gap-5 items-start h-full">
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
