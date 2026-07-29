# Architecture — Thumby

---

## Flagged Ambiguities & Gaps

Before building, these items in the source documents are too thin or ambiguous to resolve silently:

> [!IMPORTANT]
> ### 1. `test_gptimage.py` doesn't pass `quality` or `size`
> The working test calls `client.images.generate(model=MODEL, prompt=prompt)` without `quality` or `size`. The GPT Image 2 API accepts `quality` (`low`/`medium`/`high`/`auto`) and `size` (arbitrary `WIDTHxHEIGHT`, divisible by 16, aspect ratio between 1:3 and 3:1). The prototype exposes both controls. **I'll wire quality and size through to the API call.** Confirm this is intended, or should we always use a fixed quality/size?

> [!IMPORTANT]
> ### 2. Generation cap — per what period?
> Scope-lock says "generation cost cap per user" and the prototype hardcodes `GEN_CAP = 20`. Is this 20 generations **lifetime**, **per day**, **per month**, or **resettable via credits later**? This affects schema design (do we need a `period_start` column?). I'll default to **lifetime until credits ship** — flag if wrong.

> [!IMPORTANT]
> ### 3. "Featured" sort — what determines it?
> The prototype has Featured / Newest / Popular tabs. Popular is `favouriteCount` descending, Newest is `createdAt` descending. **Featured** has no defined logic — the prototype just returns insertion order. Options: (a) manual `isFeatured` boolean set by founders on the upload page, (b) a computed score (recency × popularity), (c) random/curated order. I'll go with **(a) `isFeatured` boolean** — flag if you want something else.

> [!IMPORTANT]
> ### 4. Reporting mechanism — what happens after a report?
> Scope-lock requires "reporting mechanism on generated output." The prototype shows a `Flag` icon with "Report" text. **What data do we collect?** I'll create a `Report` table (userId, generationId, reason enum, createdAt) and show a simple reason-select modal. Founders see reports on the internal page. Confirm or expand.

> [!IMPORTANT]
> ### 5. Account disable / content removal — scope of "capability"
> Scope-lock says "account disable / content removal capability for the two founders." Is this: (a) a button on the internal upload page that takes a user ID/email, (b) a Supabase dashboard operation documented in a runbook, or (c) a dedicated moderation panel? I'll go with **(a) minimal controls on the internal page** — a disable-user input and a remove-generation input. Flag if you want more.

> [!IMPORTANT]
> ### 6. Founder allow-list — how identified?
> The internal upload page is "allow-listed to the two founders." I'll gate this with an `is_founder` boolean column on the `users` table (or a Supabase custom claim), seeded for your two email addresses. **I'll need those two email addresses before the auth slice ships.** For now I'll use env-var `FOUNDER_EMAILS` as a comma-separated list.

> [!IMPORTANT]
> ### 7. R2 upload flow — who writes to R2?
> You said FastAPI handles "the R2 upload." Clarifying: (a) user-uploaded reference images go to R2 via FastAPI before generation, (b) generated output images (base64 from OpenAI) are decoded and stored in R2 by FastAPI, (c) founder-uploaded gallery images also go via FastAPI. I'll implement **all three through FastAPI** since it already has the R2 credentials. The frontend never talks to R2 directly. Confirm.

> [!WARNING]
> ### 8. Image-to-prompt (should-have) — deferred?
> Scope-lock lists "image to prompt" as should-have. The prototype doesn't show this UI. I'll include it in the schema and folder structure but **not build it in the first pass**. Confirm.

---

## Proposed Architecture

### (1) Stack

| Layer | Technology | Deployment |
|---|---|---|
| Frontend | Next.js 16 (App Router, TypeScript, Turbopack) | Cloudflare Workers via `@opennextjs/cloudflare` |
| Styling | Tailwind CSS v4 | Bundled with Next.js |
| Backend API | FastAPI (Python 3.12) | Render Web Service |
| Database | Supabase (Postgres + Auth + RLS) | Supabase Cloud |
| Object Storage | Cloudflare R2 | Cloudflare |
| Image Generation | OpenAI `gpt-image-2` via `images.generate` | Called from FastAPI |

**Routing rules:**
- **FastAPI handles only:** image generation (OpenAI API call) + R2 upload (store generated/uploaded images) + generation cap enforcement (server-side count check before calling OpenAI).
- **Everything else** (gallery reads, favourites CRUD, profile reads, auth) goes **Next.js → Supabase client SDK** with Row-Level Security. No FastAPI involvement.

**API call pattern** (from [test_gptimage.py](file:///e:/Thumby/test_gptimage.py)):
```python
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
result = client.images.generate(
    model="gpt-image-2",
    prompt=user_prompt,
    quality=quality_tier,      # "low" | "medium" | "high"
    size=f"{width}x{height}",  # e.g. "1536x864", must be divisible by 16
)
image_bytes = base64.b64decode(result.data[0].b64_json)
```

**Size mapping for aspect ratios** (divisible by 16):
| Aspect Ratio | Size String |
|---|---|
| 16:9 | `1536x864` |
| 9:16 | `864x1536` |
| 1:1 | `1024x1024` |

---

### (2) Design Tokens

Extracted directly from [thumbnail-generator-preview.jsx](file:///e:/Thumby/thumbnail-generator-preview.jsx) lines 7–10:

#### Colors (from `COLORS` constant, line 7)

| Token Name | Hex Value | Usage |
|---|---|---|
| `studio` | `#F7F8F6` | Page background, input backgrounds, light surfaces |
| `ink` | `#16181C` | Primary text, active dark buttons, logo icon bg |
| `flare` | `#F0402A` | Primary accent — generate button, active nav highlight |
| `slate` | `#6B6F76` | Secondary text, labels, icons, muted elements |
| `gold` | `#E8A93B` | Favourited star fill |

#### Extended Colors (used inline in the prototype)

| Token Name | Value | Source Line | Usage |
|---|---|---|---|
| `flare-muted` | `#FCEBE9` | Line 220 | Generate button text color |
| `flare-bg` | `rgba(240,64,42,0.1)` | Line 123 | Active nav item background |
| `nav-inactive` | `#3a3d42` | Line 123 | Inactive nav text color |
| `avatar-bg` | `#E9EBEA` | Line 155 | User avatar circle background |
| `overlay` | `rgba(22,24,28,0.4)` | Line 238 | Modal backdrop |
| `border-light` | `rgba(0,0,0,0.08)` | Multiple | Cards, sidebar, panels |
| `border-medium` | `rgba(0,0,0,0.12)` | Multiple | Inputs, inactive buttons |
| `border-dashed` | `rgba(0,0,0,0.14)` | Line 231 | Preview placeholder dashed border |
| `ratio-badge-bg` | `rgba(22,24,28,0.85)` | Line 50 | Aspect ratio badge on cards |
| `shadow-popup` | `0 8px 24px rgba(0,0,0,0.12)` | Line 140 | User menu popup |
| `shadow-modal` | `0 16px 40px rgba(0,0,0,0.2)` | Line 239 | Settings modal |

#### Typography (from lines 8–10)

| Token | Font Family | Weight | Size | Usage |
|---|---|---|---|---|
| `font-heading` | `'Poppins', sans-serif` | 600 (SemiBold) | 15px (headings), 19px (page titles) | Section headings, logo text, modal titles |
| `font-body` | `'Inter', sans-serif` | 400/500/600/700 | 12–14px | Body text, labels, buttons, nav items |
| `font-mono` | `'JetBrains Mono', monospace` | 400/500 | 10.5–11px | Aspect ratio badges, counters, generation stats |

#### Spacing & Radii (representative values from prototype)

| Token | Value | Usage |
|---|---|---|
| `radius-card` | 16px | Cards, panels, modals |
| `radius-button` | 10–11px | Buttons, inputs |
| `radius-pill` | 20px | Category pills, tags |
| `radius-badge` | 5px | Aspect ratio badges |
| `radius-avatar` | 50% | User avatar |
| `sidebar-width` | 208px | Left sidebar |

All of these will be set as the **Tailwind config's single source of truth** — no raw hex/font values anywhere else in the codebase.

---

### (3) Reference Implementation

[thumbnail-generator-preview.jsx](file:///e:/Thumby/thumbnail-generator-preview.jsx) is the exact visual and interaction spec. The following structure will be ported into real components:

**Layout:**
- Persistent left sidebar (208px) with: logo row, icon nav (Gallery / Generate / Favourites), generation counter bar, user row (avatar + name)
- Main content area (flex: 1, scrollable)

**Gallery view:**
- Sort tabs (Featured / Newest / Popular) — right-aligned, pill-group style
- Category filter pills (All / Gaming / Tech / Vlogs / Beauty / Finance)
- Responsive card grid (`repeat(auto-fit, minmax(155px, 1fr))`)
- Card: image (128px height), aspect-ratio badge (top-left), star toggle (top-right), title, category pill, popularity percentage

**Generate view:**
- Two-column layout: form panel (340px, left) + preview panel (flex: 1, right)
- Form: prompt textarea, reference toggle (From gallery / Upload), gallery reference display or upload rights checkbox, aspect ratio buttons (16:9 / 9:16 / 1:1), quality buttons (Low / Med / High), error text, Generate button with loading spinner
- Preview: dashed placeholder before generation, generated image with "Saved to your generations" + Report link after

**Favourites view:**
- Same card grid as gallery, filtered to starred items
- Empty state: "Nothing favourited yet" message

**Account popup** (triggered from user row):
- Profile → opens settings modal at Profile tab
- Settings → opens settings modal at Account tab
- Log out

**Settings modal:**
- Left tab sidebar (Profile / Account)
- Profile tab: email, generation counter, grid of past generations
- Account tab: email (read-only), log out button

---

### (4) Data Model

```
┌─────────────────────────────────────────┐
│ users (Supabase Auth + public.profiles) │
├─────────────────────────────────────────┤
│ id           UUID  PK (= auth.users.id) │
│ name         TEXT                        │
│ email        TEXT  UNIQUE                │
│ profile_picture TEXT NULL                │
│ is_founder   BOOLEAN DEFAULT false       │
│ is_disabled  BOOLEAN DEFAULT false       │
│ generation_count INT DEFAULT 0           │
│ generation_cap   INT DEFAULT 20          │
│ created_at   TIMESTAMPTZ                 │
│ updated_at   TIMESTAMPTZ                 │
└─────────────────────────────────────────┘

┌────────────────────────┐
│ categories             │
├────────────────────────┤
│ id    UUID  PK         │
│ name  TEXT  UNIQUE     │
│ slug  TEXT  UNIQUE     │
└────────────────────────┘
Seeded: gaming, tech, vlogs, beauty, finance

┌──────────────────────────────────────────────┐
│ gallery_thumbnails                           │
├──────────────────────────────────────────────┤
│ id            UUID  PK                       │
│ title         TEXT  NOT NULL                 │
│ image_url     TEXT  NOT NULL                 │
│ prompt        TEXT  NOT NULL                 │
│ aspect_ratio  TEXT  NOT NULL  ('16:9'|'9:16'|'1:1') │
│ category_id   UUID  FK → categories.id      │
│ uploaded_by   UUID  FK → profiles.id        │
│ favourite_count INT DEFAULT 0               │
│ is_featured   BOOLEAN DEFAULT false         │
│ is_active     BOOLEAN DEFAULT true          │
│ created_at    TIMESTAMPTZ                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────┐
│ favourites                           │
├──────────────────────────────────────┤
│ id            UUID  PK               │
│ user_id       UUID  FK → profiles.id │
│ thumbnail_id  UUID  FK → gallery_thumbnails.id │
│ created_at    TIMESTAMPTZ            │
│ UNIQUE(user_id, thumbnail_id)        │
└──────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ generations                                      │
├──────────────────────────────────────────────────┤
│ id              UUID  PK                         │
│ user_id         UUID  FK → profiles.id           │
│ prompt          TEXT  NOT NULL                    │
│ aspect_ratio    TEXT  NOT NULL                    │
│ reference_type  TEXT  NOT NULL  ('gallery'|'upload'|'none') │
│ reference_url   TEXT  NULL                        │
│ quality_tier    TEXT  NOT NULL  ('low'|'medium'|'high') │
│ status          TEXT  NOT NULL  ('pending'|'completed'|'failed') │
│ image_url       TEXT  NULL                        │
│ created_at      TIMESTAMPTZ                      │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ reports                                      │
├──────────────────────────────────────────────┤
│ id             UUID  PK                      │
│ user_id        UUID  FK → profiles.id        │
│ generation_id  UUID  FK → generations.id     │
│ reason         TEXT  NOT NULL                │
│ created_at     TIMESTAMPTZ                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ user_uploads (reference images for gen)      │
├──────────────────────────────────────────────┤
│ id          UUID  PK                         │
│ user_id     UUID  FK → profiles.id           │
│ r2_key      TEXT  NOT NULL                   │
│ r2_url      TEXT  NOT NULL                   │
│ created_at  TIMESTAMPTZ                      │
└──────────────────────────────────────────────┘
```

**RLS rules:**
- `profiles`: users can read/update their own row only
- `gallery_thumbnails`: anyone authenticated can read active thumbnails; only founders can insert
- `favourites`: users can CRUD their own; read count is public
- `generations`: users can read their own only
- `reports`: users can insert their own
- `user_uploads`: users can read their own only — **never publicly listable**

---

### (5) Folder Structure

```
thumby/
├── frontend/                          # Next.js 16 app
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (fonts, sidebar, providers)
│   │   ├── page.tsx                   # Redirect to /gallery
│   │   ├── gallery/
│   │   │   └── page.tsx               # Gallery browse page
│   │   ├── generate/
│   │   │   └── page.tsx               # Generate page (two-column)
│   │   ├── favourites/
│   │   │   └── page.tsx               # Favourites page
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── callback/
│   │   │       └── route.ts           # Supabase auth callback
│   │   └── internal/
│   │       └── add-thumbnail/
│   │           └── page.tsx           # Founder-only upload page
│   ├── components/
│   │   ├── ui/                        # Reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Tab.tsx
│   │   │   ├── CategoryPill.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── NavItem.tsx
│   │   │   └── GenerationCounter.tsx
│   │   ├── gallery/
│   │   │   ├── ThumbnailCard.tsx
│   │   │   ├── GalleryGrid.tsx
│   │   │   └── SortTabs.tsx
│   │   ├── generate/
│   │   │   ├── GenerateForm.tsx
│   │   │   ├── PreviewPanel.tsx
│   │   │   ├── ReferenceSelector.tsx
│   │   │   └── RightsCheckbox.tsx
│   │   └── account/
│   │       ├── UserPopup.tsx          # Profile / Settings / Log out popup
│   │       └── SettingsModal.tsx      # Profile tab + Account tab
│   ├── lib/
│   │   ├── supabase-client.ts         # Supabase browser client
│   │   ├── supabase-server.ts         # Supabase server client (for RSC)
│   │   ├── api-client.ts             # FastAPI HTTP client
│   │   └── types.ts                   # Shared TypeScript types
│   ├── tailwind.config.ts             # Design tokens single source of truth
│   ├── open-next.config.ts            # OpenNext Cloudflare config
│   ├── wrangler.jsonc                 # Cloudflare Workers config
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                           # FastAPI service
│   ├── app/
│   │   ├── main.py                    # FastAPI app, CORS, lifespan
│   │   ├── config.py                  # Settings from env vars
│   │   ├── routers/
│   │   │   └── generate.py            # POST /generate — cap check, OpenAI call, R2 upload
│   │   ├── services/
│   │   │   ├── openai_service.py      # OpenAI images.generate wrapper
│   │   │   ├── r2_service.py          # Cloudflare R2 upload via boto3/S3-compat
│   │   │   └── supabase_service.py    # Server-side Supabase client (cap check, write generation record)
│   │   └── models/
│   │       └── schemas.py             # Pydantic request/response models
│   ├── requirements.txt
│   └── Dockerfile                     # For Render deployment
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql     # All tables, RLS policies, seed data
│   └── config.toml
│
├── problem-statement.md
├── scope-lock.md
├── thumbnail-generator-preview.jsx    # Reference prototype (read-only)
├── test_gptimage.py                   # API verification script (read-only)
└── architecture.md                    # This document (generated)
```

---

### (6) Non-Negotiables

Copied verbatim from [scope-lock.md](file:///e:/Thumby/scope-lock.md):

- Every endpoint that reads or writes a specific user's data checks both authentication and record ownership
- Upload confirmation checkbox affirming rights to the uploaded image, required before an upload-referenced generation can submit
- Reporting mechanism on generated output
- Account disable / content removal capability for the two founders
- Uploaded images stored with access scoped to the uploading user only — never publicly listable
- The generation cap is enforced server-side, not just shown in the UI
- Secrets live only in environment variables

---

### (7) Build Order

| Phase | Slice | Key Deliverable | Auth Required? |
|---|---|---|---|
| 1 | **Gallery** | Seeded gallery data, card grid, category filter, sort tabs | No |
| 2 | **Auth** | Supabase Auth (email + OAuth), login/signup pages, RLS policies | Yes (enables all below) |
| 3 | **Generate** | Prompt form → FastAPI → OpenAI → R2 → preview, generation cap enforcement | Yes |
| 4 | **Favourites** | Star toggle, favourites page, favourite_count sync | Yes |
| 5 | **Account** | User popup (Profile/Settings/Log out), settings modal (Profile tab + Account tab) | Yes |
| 6 | **Internal Upload** | Founder-only upload page, report viewing, account disable, content removal | Yes (founder-gated) |

---

## Verification Plan

### Automated Tests
- `npm run build` — Next.js compiles without errors
- `npm run lint` — No ESLint errors
- FastAPI: `pytest` for generate endpoint (mocked OpenAI + R2)
- Supabase: migration applies cleanly via `supabase db push`

### Manual Verification
- Visual diff of each component against the prototype screenshot
- Generation flow end-to-end: prompt → API → R2 → preview
- RLS: verify a user cannot read another user's generations or uploads
- Generation cap: verify server rejects at cap boundary
- Founder gate: verify non-founder gets 403 on internal upload page
