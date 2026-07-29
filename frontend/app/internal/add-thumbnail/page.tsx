"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { uploadGalleryImage } from "@/lib/api-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AddThumbnailPage() {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("gaming");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !prompt) {
      setError("Please fill out all fields and select an image.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      // 1. Upload image to R2 using internal endpoint
      const imageUrl = await uploadGalleryImage(file, session.access_token);

      // 2. Insert into gallery_thumbnails
      const { error: dbError } = await supabase.from("gallery_thumbnails").insert({
        title,
        prompt,
        image_url: imageUrl,
        category_id: category,
        aspect_ratio: aspectRatio,
        model: "user-upload",
        uploaded_by: session.user.id,
        is_active: true,
      });

      if (dbError) throw new Error(dbError.message);

      setSuccess(true);
      setTitle("");
      setPrompt("");
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to upload thumbnail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto pt-8">
      <h1 className="font-heading font-semibold text-[22px] text-ink mb-6">Internal: Add Thumbnail</h1>
      
      <form onSubmit={handleUpload} className="flex flex-col gap-5 bg-white p-6 rounded-[12px] border border-border-light shadow-sm">
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-2">Image File</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-[13px] text-slate w-full"
          />
        </div>

        <Input
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Thumbnail title..."
        />
        
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-2">Prompt used</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-[100px] text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio text-ink box-border resize-none"
            placeholder="A cinematic view of..."
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[13px] font-semibold text-ink mb-2">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio text-ink box-border"
            >
              <option value="gaming">Gaming</option>
              <option value="tech">Tech</option>
              <option value="vlogs">Vlogs</option>
              <option value="beauty">Beauty</option>
              <option value="finance">Finance</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[13px] font-semibold text-ink mb-2">Aspect Ratio</label>
            <select 
              value={aspectRatio} 
              onChange={(e) => setAspectRatio(e.target.value as any)}
              className="w-full text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio text-ink box-border"
            >
              <option value="16:9">16:9 (YouTube)</option>
              <option value="9:16">9:16 (Shorts/Reels)</option>
              <option value="1:1">1:1 (Instagram)</option>
            </select>
          </div>
        </div>

        {error && <p className="text-[13px] text-flare">{error}</p>}
        {success && <p className="text-[13px] text-emerald-600">Successfully uploaded!</p>}

        <Button variant="primary" disabled={loading} onClick={() => {}} className="mt-4">
          {loading ? "Uploading..." : "Upload Thumbnail"}
        </Button>
      </form>
    </div>
  );
}
