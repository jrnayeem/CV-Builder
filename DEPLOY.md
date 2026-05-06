# CV Builder — Deployment Guide

A full-featured CV builder with 40+ templates, custom sections, AI suggestions, CV scoring, template comparison, and PDF/DOCX export.

---

## Deploy to Vercel (Recommended)

### Step 1 — Get the code

**Option A — From Replit:** Download the `artifacts/cv-builder/` folder as a ZIP.

**Option B — From GitHub:** Push to a GitHub repo, then import in Vercel.

### Step 2 — Prepare the standalone project

The `artifacts/cv-builder/` directory is a self-contained deployable project.

Replace `package.json` with `package.standalone.json`:
```bash
cp package.standalone.json package.json
```

### Step 3 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo (or drag-drop the folder)
3. Set **Root Directory** to `artifacts/cv-builder` (if using the full repo)
4. Vercel auto-detects Vite — confirm:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/public`
5. Add **Environment Variable:**
   - `OPENAI_API_KEY` = your OpenAI API key (from [platform.openai.com](https://platform.openai.com))
6. Click **Deploy** ✓

The `vercel.json` file in the folder handles all routing automatically.

---

## Deploy to Netlify

### Step 1 — Prepare (same as above)

Replace `package.json` with `package.standalone.json`:
```bash
cp package.standalone.json package.json
```

### Step 2 — Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
2. Set **Base directory:** `artifacts/cv-builder` (if using full repo)
3. **Build command:** `npm run build`
4. **Publish directory:** `dist/public`
5. Add **Environment variable:**
   - `OPENAI_API_KEY` = your OpenAI API key
6. Click **Deploy site** ✓

The `netlify.toml` handles function routing automatically.

---

## Deploy without AI features (free, no API key needed)

The app fully works without `OPENAI_API_KEY` — AI Generate and CV Score buttons will just show an error. All other features (templates, PDF, DOCX, custom sections, compare) work offline.

To remove the AI buttons entirely, delete these lines from `src/pages/editor.tsx`:
```tsx
import { GenerateFromJobDialog } from "@/components/generate-from-job-dialog";
import { CvScoreDialog } from "@/components/cv-score-dialog";
// And remove <GenerateFromJobDialog /> and <CvScoreDialog /> from the JSX
```

---

## Project Structure

```
cv-builder/
├── api/                       # Vercel serverless functions
│   └── cv/
│       ├── generate-from-job.ts
│       └── score.ts
├── netlify/                   # Netlify serverless functions
│   └── functions/
│       ├── cv-generate.ts
│       └── cv-score.ts
├── src/
│   ├── components/            # UI components
│   │   ├── compare-templates-dialog.tsx
│   │   ├── cv-score-dialog.tsx
│   │   ├── generate-from-job-dialog.tsx
│   │   └── template-switcher-sheet.tsx
│   ├── contexts/
│   │   └── cv-context.tsx     # Global CV state
│   ├── lib/
│   │   ├── cv-data.ts         # CV data types + defaults
│   │   └── docx-generator.ts  # DOCX export
│   ├── pages/
│   │   ├── home.tsx           # Template gallery
│   │   └── editor.tsx         # Main editor
│   └── templates/             # 40+ CV templates
│       ├── classic.tsx
│       ├── modern.tsx
│       ├── creative.tsx
│       ├── minimal.tsx
│       ├── executive.tsx
│       ├── bd.tsx
│       └── bd-extra.tsx
├── vercel.json                # Vercel config
├── netlify.toml               # Netlify config
├── package.standalone.json    # Use this as package.json for deployment
└── vite.config.standalone.ts  # Standalone vite config (no Replit deps)
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | For AI features | From [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

---

## Local Development (standalone)

```bash
cd artifacts/cv-builder
cp package.standalone.json package.json
cp vite.config.standalone.ts vite.config.local.ts
npm install
npm run dev   # http://localhost:3000
```

> Note: For local AI features, create a `.env` file:
> ```
> OPENAI_API_KEY=sk-...
> ```
> Vercel dev server: `npx vercel dev` (serves both frontend + functions)
> Netlify dev server: `npx netlify dev` (serves both frontend + functions)
