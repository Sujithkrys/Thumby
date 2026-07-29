import { useState } from "react";
import {
  Star, Loader2, Flag, Upload, Images, Sparkles, User, Settings as SettingsIcon,
  LogOut, Home, X, ImageIcon
} from "lucide-react";

const COLORS = { studio: "#F7F8F6", ink: "#16181C", flare: "#F0402A", slate: "#6B6F76", gold: "#E8A93B" };
const BODY = "'Inter',sans-serif";
const HEAD = "'Poppins',sans-serif";
const heading = { fontFamily: HEAD, fontWeight: 600, fontSize: 15, color: COLORS.ink };

const CATEGORY_LABELS = { gaming: "Gaming", tech: "Tech", vlogs: "Vlogs", beauty: "Beauty", finance: "Finance" };
const CATEGORIES = Object.keys(CATEGORY_LABELS);

const INITIAL_GALLERY = [
  { id: "g1", title: "Boss fight reaction", category: "gaming", ratio: "16:9", pop: 88, img: "https://picsum.photos/seed/g1/400/225" },
  { id: "g2", title: "1v5 clutch highlight", category: "gaming", ratio: "16:9", pop: 61, img: "https://picsum.photos/seed/g2/400/225" },
  { id: "g3", title: "iPhone 17 review", category: "tech", ratio: "16:9", pop: 95, img: "https://picsum.photos/seed/g3/400/225" },
  { id: "g4", title: "This app changed everything", category: "tech", ratio: "16:9", pop: 42, img: "https://picsum.photos/seed/g4/400/225" },
  { id: "g5", title: "A day in my life", category: "vlogs", ratio: "9:16", pop: 73, img: "https://picsum.photos/seed/g5/225/400" },
  { id: "g6", title: "I tried this for 30 days", category: "vlogs", ratio: "9:16", pop: 90, img: "https://picsum.photos/seed/g6/225/400" },
  { id: "g7", title: "Get ready with me", category: "beauty", ratio: "9:16", pop: 55, img: "https://picsum.photos/seed/g7/225/400" },
  { id: "g8", title: "Skincare routine that works", category: "beauty", ratio: "9:16", pop: 68, img: "https://picsum.photos/seed/g8/225/400" },
  { id: "g9", title: "Stock market crash?", category: "finance", ratio: "16:9", pop: 81, img: "https://picsum.photos/seed/g9/400/225" },
  { id: "g10", title: "How I saved my first $10k", category: "finance", ratio: "1:1", pop: 37, img: "https://picsum.photos/seed/g10/400/400" },
  { id: "g11", title: "New season, new meta", category: "gaming", ratio: "1:1", pop: 50, img: "https://picsum.photos/seed/g11/400/400" },
  { id: "g12", title: "Unboxing the setup", category: "tech", ratio: "16:9", pop: 29, img: "https://picsum.photos/seed/g12/400/225" },
];

const RATIOS = ["16:9", "9:16", "1:1"];
const QUALITIES = [{ v: "low", l: "Low" }, { v: "medium", l: "Med" }, { v: "high", l: "High" }];
const GEN_CAP = 20;
const NAV_ITEMS = [{ key: "gallery", label: "Gallery", Icon: Home }, { key: "generate", label: "Generate", Icon: Sparkles }, { key: "favourites", label: "Favourites", Icon: Star }];

function ratioBox(r) { return r === "9:16" ? "9 / 16" : r === "1:1" ? "1 / 1" : "16 / 9"; }

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: "6px 13px", borderRadius: 8, fontSize: 12.5, fontFamily: BODY, cursor: "pointer", border: "none", background: active ? COLORS.ink : "transparent", color: active ? COLORS.studio : COLORS.slate, fontWeight: active ? 600 : 400 }}>
      {children}
    </button>
  );
}

function ThumbnailCard({ item, isFav, onToggleFav, onUse }) {
  return (
    <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <button onClick={() => onUse(item)} style={{ display: "block", width: "100%", padding: 0, border: "none", cursor: "pointer", background: "none" }}>
          <img src={item.img} alt={item.title} style={{ width: "100%", height: 128, objectFit: "cover", display: "block", background: COLORS.studio }} />
        </button>
        <span style={{ position: "absolute", top: 9, left: 9, background: "rgba(22,24,28,0.85)", color: COLORS.studio, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "3px 7px", borderRadius: 5, pointerEvents: "none" }}>{item.ratio}</span>
        <span onClick={(e) => { e.stopPropagation(); onToggleFav(item.id); }} style={{ position: "absolute", top: 9, right: 9, cursor: "pointer", lineHeight: 0 }}>
          <Star size={17} fill={isFav ? COLORS.gold : "none"} color={isFav ? COLORS.gold : "white"} style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.5))" }} />
        </span>
      </div>
      <div style={{ padding: "11px 13px" }}>
        <p style={{ fontFamily: BODY, fontWeight: 600, fontSize: 13, color: COLORS.ink, margin: "0 0 6px 0" }}>{item.title}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ border: `0.5px solid ${COLORS.slate}`, color: COLORS.slate, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontFamily: BODY }}>{CATEGORY_LABELS[item.category]}</span>
          <span style={{ fontFamily: BODY, fontSize: 11, color: COLORS.slate }}>{item.pop}% liked</span>
        </div>
      </div>
    </div>
  );
}

export default function ThumbnailGenPreview() {
  const [view, setView] = useState("gallery");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [favourites, setFavourites] = useState(new Set());
  const [gallery] = useState(INITIAL_GALLERY);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("profile");

  const [prompt, setPrompt] = useState("");
  const [refType, setRefType] = useState("none");
  const [refItem, setRefItem] = useState(null);
  const [ratio, setRatio] = useState("16:9");
  const [quality, setQuality] = useState("medium");
  const [rightsOk, setRightsOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [genError, setGenError] = useState("");
  const [generations, setGenerations] = useState([]);

  function toggleFav(id) { setFavourites((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function useAsReference(item) { setRefType("gallery"); setRefItem(item); setRatio(item.ratio); setResult(null); setView("generate"); }
  function openSettings(tab) { setSettingsTab(tab); setSettingsOpen(true); setUserMenuOpen(false); }
  function handleGenerate() {
    if (!prompt.trim()) { setGenError("Write a prompt before generating."); return; }
    if (refType === "upload" && !rightsOk) { setGenError("Confirm this image is yours or you have permission to use it."); return; }
    if (generations.length >= GEN_CAP) { setGenError(`You've reached the ${GEN_CAP} generation limit.`); return; }
    setGenError(""); setLoading(true); setResult(null);
    setTimeout(() => {
      const seed = Math.floor(Math.random() * 10000);
      const [w, h] = ratio === "9:16" ? [360, 640] : ratio === "1:1" ? [500, 500] : [640, 360];
      const gen = { id: `gen${Date.now()}`, prompt, ratio, img: `https://picsum.photos/seed/gen${seed}/${w}/${h}` };
      setResult(gen); setGenerations((prev) => [gen, ...prev]); setLoading(false);
    }, 1800);
  }

  let filtered = gallery.filter((i) => category === "all" || i.category === category);
  if (sort === "newest") filtered = [...filtered].reverse();
  if (sort === "popular") filtered = [...filtered].sort((a, b) => b.pop - a.pop);
  const remaining = GEN_CAP - generations.length;

  return (
    <div style={{ position: "relative", display: "flex", fontFamily: BODY, minHeight: 560, border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 16, overflow: "hidden", background: COLORS.studio }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600&family=JetBrains+Mono:wght@400;500&display=swap" />

      <div style={{ width: 208, background: "white", borderRight: "0.5px solid rgba(0,0,0,0.08)", padding: "18px 12px", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 6px", marginBottom: 18 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: COLORS.ink, flexShrink: 0 }} />
          <span style={{ ...heading }}>thumby</span>
        </div>

        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const active = view === key;
          return (
            <button key={key} onClick={() => setView(key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: BODY, fontSize: 13, textAlign: "left", background: active ? "rgba(240,64,42,0.1)" : "transparent", color: active ? COLORS.flare : "#3a3d42", fontWeight: active ? 600 : 400 }}>
              <Icon size={16} color={active ? COLORS.flare : COLORS.slate} aria-hidden="true" />
              {label}
              {key === "favourites" && favourites.size > 0 && (<span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: active ? COLORS.flare : COLORS.slate }}>{favourites.size}</span>)}
            </button>
          );
        })}

        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <div style={{ background: COLORS.studio, borderRadius: 12, padding: "11px 12px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BODY, fontSize: 11, color: COLORS.slate, marginBottom: 6 }}><span>Generations</span><span>{generations.length}/{GEN_CAP}</span></div>
            <div style={{ height: 5, background: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${(generations.length / GEN_CAP) * 100}%`, background: COLORS.flare, borderRadius: 3 }} /></div>
          </div>

          <div style={{ position: "relative" }}>
            {userMenuOpen && (
              <>
                <div onClick={() => setUserMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
                <div style={{ position: "absolute", bottom: "100%", left: 0, marginBottom: 8, width: 180, background: "white", borderRadius: 12, border: "0.5px solid rgba(0,0,0,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 6, zIndex: 20 }}>
                  {[
                    { label: "Profile", Icon: User, action: () => openSettings("profile") },
                    { label: "Settings", Icon: SettingsIcon, action: () => openSettings("account") },
                    { label: "Log out", Icon: LogOut, action: () => setUserMenuOpen(false) },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: BODY, fontSize: 12.5, color: COLORS.ink, textAlign: "left" }}>
                      <item.Icon size={14} color={COLORS.slate} aria-hidden="true" />{item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
            <button onClick={() => setUserMenuOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px", width: "100%", border: "none", background: userMenuOpen ? COLORS.studio : "transparent", borderRadius: 10, cursor: "pointer" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#E9EBEA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: BODY, fontWeight: 600, color: COLORS.slate, flexShrink: 0 }}>TU</div>
              <span style={{ fontFamily: BODY, fontSize: 12.5, color: COLORS.ink }}>Test user</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: 22, minWidth: 0, boxSizing: "border-box", overflow: "auto" }}>
        {view === "gallery" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 4, background: "white", padding: 4, borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.08)" }}>
                <Tab active={sort === "featured"} onClick={() => setSort("featured")}>Featured</Tab>
                <Tab active={sort === "newest"} onClick={() => setSort("newest")}>Newest</Tab>
                <Tab active={sort === "popular"} onClick={() => setSort("popular")}>Popular</Tab>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {["all", ...CATEGORIES].map((c) => (
                <button key={c} onClick={() => setCategory(c)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontFamily: BODY, cursor: "pointer", background: category === c ? COLORS.ink : "white", color: category === c ? COLORS.studio : COLORS.slate, border: category === c ? "none" : "0.5px solid rgba(0,0,0,0.1)" }}>
                  {c === "all" ? "All categories" : CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 14 }}>
              {filtered.map((item) => (<ThumbnailCard key={item.id} item={item} isFav={favourites.has(item.id)} onToggleFav={toggleFav} onUse={useAsReference} />))}
            </div>
          </div>
        )}

        {view === "generate" && (
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", height: "100%" }}>
            <div style={{ width: 340, flexShrink: 0, background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={heading}>New thumbnail</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.slate }}>{remaining}/{GEN_CAP} left</span>
              </div>
              <label style={{ display: "block", fontSize: 12, color: COLORS.slate, marginBottom: 6, fontFamily: BODY }}>Prompt</label>
              <textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A shocked face reacting to a boss fight, bold red arrow, dramatic lighting" style={{ width: "100%", fontFamily: BODY, fontSize: 13, padding: 10, borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.12)", marginBottom: 14, boxSizing: "border-box", background: COLORS.studio }} />
              <label style={{ display: "block", fontSize: 12, color: COLORS.slate, marginBottom: 6, fontFamily: BODY }}>Reference</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={() => { setRefType("gallery"); setResult(null); }} style={{ flex: 1, padding: 9, borderRadius: 10, fontSize: 12, fontFamily: BODY, cursor: "pointer", background: refType === "gallery" ? COLORS.ink : "white", color: refType === "gallery" ? COLORS.studio : COLORS.slate, border: refType === "gallery" ? "none" : "0.5px solid rgba(0,0,0,0.12)" }}>From gallery</button>
                <button onClick={() => { setRefType("upload"); setResult(null); }} style={{ flex: 1, padding: 9, borderRadius: 10, fontSize: 12, fontFamily: BODY, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: refType === "upload" ? COLORS.ink : "white", color: refType === "upload" ? COLORS.studio : COLORS.slate, border: refType === "upload" ? "none" : "0.5px solid rgba(0,0,0,0.12)" }}><Upload size={12} aria-hidden="true" /> Upload</button>
              </div>
              {refType === "gallery" && (refItem ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 12, color: COLORS.slate }}><img src={refItem.img} alt={refItem.title} style={{ width: 48, height: 32, objectFit: "cover", borderRadius: 6 }} /><span>{refItem.title}</span></div>
              ) : (<p style={{ fontSize: 12, color: COLORS.slate, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><Images size={14} aria-hidden="true" /> Pick a thumbnail from the gallery first.</p>))}
              {refType === "upload" && (
                <label style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11.5, color: COLORS.slate, marginBottom: 14 }}>
                  <input type="checkbox" checked={rightsOk} onChange={(e) => setRightsOk(e.target.checked)} style={{ marginTop: 2 }} />This image is mine, or I have permission to use it.
                </label>
              )}
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, color: COLORS.slate, marginBottom: 6 }}>Aspect ratio</label>
                  <div style={{ display: "flex", gap: 5 }}>{RATIOS.map((r) => (<button key={r} onClick={() => setRatio(r)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: "5px 8px", borderRadius: 6, cursor: "pointer", background: ratio === r ? COLORS.ink : "white", color: ratio === r ? COLORS.studio : COLORS.slate, border: `0.5px solid ${ratio === r ? COLORS.ink : "rgba(0,0,0,0.12)"}` }}>{r}</button>))}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 12, color: COLORS.slate, marginBottom: 6 }}>Quality</label>
                  <div style={{ display: "flex", gap: 5 }}>{QUALITIES.map((q) => (<button key={q.v} onClick={() => setQuality(q.v)} style={{ fontSize: 11, padding: "5px 8px", borderRadius: 6, cursor: "pointer", background: quality === q.v ? COLORS.ink : "white", color: quality === q.v ? COLORS.studio : COLORS.slate, border: `0.5px solid ${quality === q.v ? COLORS.ink : "rgba(0,0,0,0.12)"}` }}>{q.l}</button>))}</div>
                </div>
              </div>
              {genError && <p style={{ fontSize: 12, color: COLORS.flare, marginBottom: 10 }}>{genError}</p>}
              <button onClick={handleGenerate} disabled={loading} style={{ width: "100%", padding: 13, borderRadius: 11, border: "none", background: COLORS.flare, color: "#FCEBE9", fontFamily: BODY, fontSize: 14, fontWeight: 600, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading && <Loader2 size={14} className="spin" aria-hidden="true" />}{loading ? "Generating..." : "Generate"}
              </button>
            </div>

            <div style={{ flex: 1, background: "white", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", minHeight: 460 }}>
              <span style={{ ...heading, marginBottom: 16 }}>Preview</span>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {result ? (
                  <div style={{ width: "100%", maxWidth: 440 }}>
                    <img src={result.img} alt="Generated thumbnail" style={{ width: "100%", aspectRatio: ratioBox(ratio), objectFit: "cover", borderRadius: 12, display: "block", marginBottom: 10 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: COLORS.slate }}>Saved to your generations</span>
                      <span style={{ fontSize: 12, color: COLORS.slate, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}><Flag size={12} aria-hidden="true" /> Report</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ width: "100%", maxWidth: 440, aspectRatio: ratioBox(ratio), border: "1.5px dashed rgba(0,0,0,0.14)", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: COLORS.slate }}>
                    <ImageIcon size={26} aria-hidden="true" />
                    <span style={{ fontSize: 12.5 }}>Your thumbnail will appear here</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "favourites" && (
          <div>
            <h1 style={{ ...heading, fontSize: 19, marginBottom: 16 }}>Favourites</h1>
            {favourites.size === 0 ? (
              <p style={{ fontSize: 13, color: COLORS.slate }}>Nothing favourited yet &mdash; star a thumbnail in the gallery to save it here.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 14 }}>
                {gallery.filter((i) => favourites.has(i.id)).map((item) => (<ThumbnailCard key={item.id} item={item} isFav={true} onToggleFav={toggleFav} onUse={useAsReference} />))}
              </div>
            )}
          </div>
        )}
      </div>

      {settingsOpen && (
        <div onClick={() => setSettingsOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(22,24,28,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 520, maxWidth: "90%", height: 380, background: "white", borderRadius: 16, display: "flex", overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 150, background: COLORS.studio, padding: 14, display: "flex", flexDirection: "column", gap: 2, boxSizing: "border-box" }}>
              <span style={{ fontFamily: BODY, fontSize: 11, color: COLORS.slate, fontWeight: 600, padding: "4px 8px 10px" }}>SETTINGS</span>
              {[{ k: "profile", l: "Profile", Icon: User }, { k: "account", l: "Account", Icon: SettingsIcon }].map((t) => (
                <button key={t.k} onClick={() => setSettingsTab(t.k)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 8px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: BODY, fontSize: 12.5, textAlign: "left", background: settingsTab === t.k ? "white" : "transparent", color: settingsTab === t.k ? COLORS.ink : COLORS.slate, fontWeight: settingsTab === t.k ? 600 : 400 }}>
                  <t.Icon size={14} aria-hidden="true" />{t.l}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, padding: 22, boxSizing: "border-box", overflow: "auto", position: "relative" }}>
              <button onClick={() => setSettingsOpen(false)} style={{ position: "absolute", top: 16, right: 16, border: "none", background: "transparent", cursor: "pointer", color: COLORS.slate }} aria-label="Close settings"><X size={16} /></button>
              {settingsTab === "profile" && (
                <div>
                  <span style={{ ...heading, display: "block", marginBottom: 4 }}>Profile</span>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: COLORS.slate, marginBottom: 16 }}>test@thumby.app &middot; {generations.length}/{GEN_CAP} generations used</p>
                  {generations.length === 0 ? (
                    <p style={{ fontSize: 13, color: COLORS.slate }}>No generations yet.</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
                      {generations.map((g) => (
                        <div key={g.id} style={{ borderRadius: 10, overflow: "hidden", border: "0.5px solid rgba(0,0,0,0.08)" }}>
                          <img src={g.img} alt={g.prompt} style={{ width: "100%", height: 70, objectFit: "cover", display: "block" }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {settingsTab === "account" && (
                <div>
                  <span style={{ ...heading, display: "block", marginBottom: 16 }}>Account</span>
                  <label style={{ display: "block", fontSize: 12, color: COLORS.slate, marginBottom: 6 }}>Email</label>
                  <input value="test@thumby.app" readOnly style={{ width: "100%", fontSize: 13, padding: 9, borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.12)", boxSizing: "border-box", color: COLORS.ink, background: COLORS.studio, marginBottom: 16 }} />
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 15px", borderRadius: 10, border: "0.5px solid rgba(0,0,0,0.12)", background: "white", color: COLORS.slate, fontSize: 13, cursor: "pointer" }}><LogOut size={14} aria-hidden="true" /> Log out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`.spin { animation: tgspin 0.8s linear infinite; } @keyframes tgspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
