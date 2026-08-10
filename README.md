# Thumby — AI Thumbnail Generator 🎨✨

Thumby is an AI-powered platform designed to help YouTube and Instagram creators browse and generate high-converting thumbnails. By leveraging advanced generation models (`gpt-image-2`), Thumby makes professional-quality thumbnails accessible at a fraction of the cost, eliminating the need for expensive freelancers or advanced design skills.

## 🚀 Features

* **AI Image Generation:** Generate thumbnails using text prompts, quality tiers, and aspect ratios.
* **Reference Images:** Upload your own images or pick from the gallery to guide the AI's generation.
* **Gallery Browse:** Explore a curated gallery of high-converting, proven thumbnails across various categories (Gaming, Tech, Vlogs, Beauty, Finance).
* **Favorites & History:** Track your past generations and save your favorite thumbnails for easy access.
* **Secure Authentication:** Built on Supabase Auth, keeping user data and generation history secure.
* **Internal Curation Tools:** Dedicated workflows for founders to curate the featured gallery.

## 🏗 Architecture & Tech Stack

Thumby uses a modern, high-performance stack split into a frontend UI and a lightweight backend for secure AI calls and storage.

* **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [Tailwind CSS v4](https://tailwindcss.com/)
* **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)
* **Database & Auth:** [Supabase](https://supabase.com/) (Postgres + Row Level Security)
* **Object Storage:** [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
* **AI Model:** OpenAI `gpt-image-2`

### Request Flow
1. **Frontend to Supabase:** The Next.js app communicates directly with Supabase via the client SDK for gallery reads, favorites CRUD, and user authentication.
2. **Frontend to FastAPI:** Secure actions like Image Generation (OpenAI) and R2 Image Uploads are routed through the FastAPI backend to keep API keys safe and enforce generation caps.

## 🛠 Local Setup

### Prerequisites
* Node.js (v20+)
* Python 3.12+
* Supabase Account
* Cloudflare Account (for R2)
* OpenAI API Key

### 1. Clone the repository
```bash
git clone https://github.com/Sujithkrys/Thumby.git
cd Thumby
```

### 2. Backend Setup (FastAPI)
The backend handles OpenAI integrations and Cloudflare R2 uploads.

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:
```env
OPENAI_API_KEY=your_openai_key
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret
R2_BUCKET_NAME=thumby-bucket
```

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup (Next.js)
The frontend uses Next.js 16 and Turbopack.

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Run the frontend development server:
```bash
npm run dev
```

## 🔒 Security & Data Privacy
- **Row-Level Security (RLS):** All user data is protected in Supabase so users can only read/write their own content.
- **Backend Enforced Limits:** The generation cap is enforced strictly on the server-side to prevent API abuse.
- **Private Storage:** User-uploaded reference images are strictly scoped and never publicly listable.

## 🤝 Contributing
Since this is an early build, we are continuously improving the platform based on feedback. Note that certain features (like image-to-prompt and advanced editing) are actively under development.

---

*Built with ❤️ for creators.*
