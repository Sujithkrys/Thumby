"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  addAdminThumbnail, 
  getAdminThumbnails, 
  deleteAdminThumbnail, 
  updateAdminThumbnail 
} from "@/lib/api-client";
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
  
  const [verifiedAdmin, setVerifiedAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<"Sujith" | "Gopal" | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminError, setAdminError] = useState("");

  const [thumbnails, setThumbnails] = useState<Record<string, unknown>[]>([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAspectRatio, setEditAspectRatio] = useState("");

  const fetchThumbnails = useCallback(async () => {
    if (!adminEmail) return;
    setLoadingThumbnails(true);
    try {
      const data = await getAdminThumbnails(adminEmail);
      setThumbnails(data);
    } catch (err: unknown) {
      console.error("Failed to fetch thumbnails:", err);
    } finally {
      setLoadingThumbnails(false);
    }
  }, [adminEmail]);

  useEffect(() => {
    if (verifiedAdmin) {
      fetchThumbnails();
    }
  }, [verifiedAdmin, fetchThumbnails]);

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
      await addAdminThumbnail(file, adminEmail, title, prompt, category, aspectRatio);
      setSuccess(true);
      setTitle("");
      setPrompt("");
      setFile(null);
      // Refresh the list
      fetchThumbnails();
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to upload thumbnail.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAdmin === "Sujith" && adminEmail === "thalathotysujith@gmail.com") {
      setVerifiedAdmin(true);
    } else if (selectedAdmin === "Gopal" && adminEmail === "phanniuddandam1@gmail.com") {
      setVerifiedAdmin(true);
    } else {
      setAdminError("Incorrect email for this admin.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this thumbnail?")) return;
    try {
      await deleteAdminThumbnail(id, adminEmail);
      fetchThumbnails();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to delete.");
    }
  };

  const startEdit = (t: Record<string, unknown>) => {
    setEditingId(t.id as string);
    setEditTitle(t.title as string);
    setEditPrompt(t.prompt as string);
    setEditCategory(t.category_id as string);
    setEditAspectRatio(t.aspect_ratio as string);
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateAdminThumbnail(id, adminEmail, editTitle, editPrompt, editCategory, editAspectRatio);
      setEditingId(null);
      fetchThumbnails();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to update.");
    }
  };

  if (!verifiedAdmin) {
    return (
      <div className="max-w-[400px] mx-auto pt-20">
        <h1 className="font-heading font-semibold text-[24px] text-ink mb-6 text-center">Admins</h1>
        
        {!selectedAdmin ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setSelectedAdmin("Sujith")}
              className="w-full bg-white border border-border-medium rounded-[--radius-button] py-[12px] text-[15px] font-semibold text-ink hover:bg-studio transition-colors cursor-pointer"
            >
              Sujith
            </button>
            <button 
              onClick={() => setSelectedAdmin("Gopal")}
              className="w-full bg-white border border-border-medium rounded-[--radius-button] py-[12px] text-[15px] font-semibold text-ink hover:bg-studio transition-colors cursor-pointer"
            >
              Gopal
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminVerify} className="bg-white p-6 rounded-[12px] border border-border-light shadow-sm flex flex-col gap-4">
            <h2 className="font-heading font-semibold text-[17px] text-ink">Verify as {selectedAdmin}</h2>
            <Input
              label="Admin Email"
              type="email"
              value={adminEmail}
              onChange={setAdminEmail}
              placeholder="Enter your admin email"
            />
            {adminError && <p className="text-[13px] text-flare">{adminError}</p>}
            <Button variant="primary" onClick={() => {}} className="mt-2">
              Verify
            </Button>
            <button 
              type="button"
              onClick={() => {
                setSelectedAdmin(null);
                setAdminError("");
                setAdminEmail("");
              }}
              className="text-[13px] text-slate hover:text-ink mt-2 cursor-pointer bg-transparent border-none"
            >
              Back
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto pt-8 pb-12 px-4">
      <h1 className="font-heading font-semibold text-[22px] text-ink mb-6">Internal: Add Thumbnail</h1>
      
      <form onSubmit={handleUpload} className="flex flex-col gap-5 bg-white p-6 rounded-[12px] border border-border-light shadow-sm mb-12">
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

      <h2 className="font-heading font-semibold text-[20px] text-ink mb-6">Your Uploads</h2>
      {loadingThumbnails ? (
        <p className="text-[13px] text-slate">Loading...</p>
      ) : thumbnails.length === 0 ? (
        <p className="text-[13px] text-slate">No uploads yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {thumbnails.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-[12px] border border-border-light shadow-sm flex flex-col md:flex-row gap-4">
              <img src={t.image_url} alt={t.title} className="w-full md:w-[160px] h-auto object-cover rounded-[8px] bg-studio" />
              
              <div className="flex-1 flex flex-col gap-2">
                {editingId === t.id ? (
                  <>
                    <Input label="Title" value={editTitle} onChange={setEditTitle} />
                    <textarea 
                      value={editPrompt} 
                      onChange={(e) => setEditPrompt(e.target.value)}
                      className="w-full h-[60px] text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio text-ink box-border resize-none mt-2"
                    />
                    <div className="flex gap-2 mt-2">
                      <select 
                        value={editCategory} 
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio text-ink"
                      >
                        <option value="gaming">Gaming</option>
                        <option value="tech">Tech</option>
                        <option value="vlogs">Vlogs</option>
                        <option value="beauty">Beauty</option>
                        <option value="finance">Finance</option>
                      </select>
                      <select 
                        value={editAspectRatio} 
                        onChange={(e) => setEditAspectRatio(e.target.value)}
                        className="text-[13px] p-[9px] rounded-[--radius-button] border border-border-medium bg-studio text-ink"
                      >
                        <option value="16:9">16:9</option>
                        <option value="9:16">9:16</option>
                        <option value="1:1">1:1</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="primary" onClick={() => handleUpdate(t.id)}>Save</Button>
                      <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-[15px] text-ink">{t.title}</h3>
                    <p className="text-[13px] text-slate line-clamp-2">{t.prompt}</p>
                    <div className="flex gap-2 text-[12px] text-slate mt-1">
                      <span className="bg-studio px-2 py-1 rounded-full">{t.category_id}</span>
                      <span className="bg-studio px-2 py-1 rounded-full">{t.aspect_ratio}</span>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2">
                      <button onClick={() => startEdit(t)} className="text-[13px] text-indigo-600 hover:underline bg-transparent border-none cursor-pointer p-0">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-[13px] text-flare hover:underline bg-transparent border-none cursor-pointer p-0">Delete</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
