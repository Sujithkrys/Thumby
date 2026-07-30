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

  const recentGenerations = generations.slice(0, 8);

  return (
    <div className="w-full max-w-[1240px] mx-auto flex flex-col gap-8 pb-12">
      <div className="flex gap-5 items-start">
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

      {recentGenerations.length > 0 && (
        <div className="w-full">
          <h2 className="font-heading font-semibold text-[15px] text-ink mb-4">Recent generations</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {recentGenerations.map(gen => (
              <div 
                key={gen.id}
                onClick={() => {
                  if (gen.imageUrl) window.open(gen.imageUrl, '_blank');
                }}
                className="shrink-0 relative cursor-pointer group rounded-[12px] overflow-hidden border border-border-light shadow-sm bg-white p-1.5 hover:border-ink transition-colors"
                style={{ width: '132px' }}
              >
                <div 
                  className="w-[120px] rounded-[8px] overflow-hidden bg-studio relative flex items-center justify-center"
                  style={{ aspectRatio: gen.aspectRatio === '16:9' ? '16/9' : gen.aspectRatio === '9:16' ? '9/16' : '1/1' }}
                >
                  {gen.imageUrl ? (
                    <img 
                      src={gen.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      alt={gen.prompt} 
                    />
                  ) : (
                    <span className="text-[11px] text-slate font-medium">Processing</span>
                  )}
                  <span className="absolute bottom-1.5 left-1.5 bg-ink/80 text-studio font-mono text-[10px] px-1.5 py-0.5 rounded-[4px] backdrop-blur-sm shadow-sm leading-none">
                    {gen.aspectRatio}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
