"use client";

import { useState, useEffect } from "react";
import { GenerateForm } from "@/components/generate/GenerateForm";
import { PreviewPanel } from "@/components/generate/PreviewPanel";
import { generateThumbnail, uploadReferenceImage } from "@/lib/api-client";
import { createClient } from "@/lib/supabase-client";
import { useStore } from "@/lib/store";

export function GenerateClient({ initialInspirations = [] }: { initialInspirations?: any[] }) {
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

  const handleInspirationClick = (item: any) => {
    setPrompt(item.prompt);
    setRatio(item.aspect_ratio);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {initialInspirations && initialInspirations.length > 0 && (
        <div className="w-full">
          <h2 className="font-heading font-semibold text-[15px] text-ink">Need inspiration?</h2>
          <p className="text-[13px] text-slate font-body mb-4">Start from a prompt that's already working.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {initialInspirations.map(item => (
              <div 
                key={item.id}
                onClick={() => handleInspirationClick(item)}
                className="bg-white border border-border-light rounded-[12px] p-[10px] cursor-pointer hover:border-ink transition-colors flex gap-3 shadow-sm items-center"
              >
                <div className="relative w-[60px] h-[60px] shrink-0 rounded-[8px] overflow-hidden bg-studio flex items-center justify-center">
                  <img 
                    src={item.image_url} 
                    className="max-w-full max-h-full object-cover"
                    style={{ aspectRatio: item.aspect_ratio === '16:9' ? '16/9' : item.aspect_ratio === '9:16' ? '9/16' : '1/1' }}
                    alt="" 
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-slate uppercase mb-[2px]">{item.category_id}</span>
                  <p className="text-[12px] text-ink font-body line-clamp-2 leading-snug" title={item.prompt}>
                    {item.prompt.length > 60 ? item.prompt.substring(0, 60) + '...' : item.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
