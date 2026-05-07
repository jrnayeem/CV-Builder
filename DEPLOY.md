# CV Builder — Deployment Guide

A full-featured CV builder with 64+ templates, AI suggestions, CV scoring, cover letter generator, PDF/DOCX export, drag-and-drop reordering, and template search.

---

## Deploy to Netlify

### Step 1 — Prepare the ZIP

Download the zip file you received and extract it. You will have a folder called `cv-builder-fixed/`.

### Step 2 — Deploy

**Option A — Drag & Drop (easiest)**

1. Go to [app.netlify.com](https://app.netlify.com) and log in
2. Click **Add new site → Deploy manually**
3. Run `npm run build` locally first (see below), then drag the `dist/public/` folder onto Netlify
4. Done — site is live instantly

**Option B — Connect to GitHub (recommended for updates)**

1. Push the `cv-builder-fixed/` folder contents to a GitHub repo
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
3. Choose your GitHub repo
4. Set these build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/public`
5. Click **Deploy site**

The `netlify.toml` file in the folder handles all routing and serverless functions automatically.

---

## Enable AI Features (required for AI Generate, CV Score, Cover Letter)

After deploying, the AI buttons will show a setup message until you add your OpenAI key.

### Step 1 — Get an OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create a free account
3. Click **Create new secret key** and copy it

### Step 2 — Add the Key to Netlify

1. In the Netlify dashboard, open your site
2. Go to **Site settings → Environment variables**
3. Click **Add a variable**
4. Set:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** paste your key (starts with `sk-`)
5. Click **Save**

### Step 3 — Redeploy

1. Go to **Deploys** in your Netlify dashboard
2. Click **Trigger deploy → Deploy site**
3. Wait ~1 minute for the build to finish

AI features will now work. The functions use `gpt-4o-mini` which is very affordable (~$0.001 per request).

---

## Build locally (optional, for testing before deploy)

```bash
# Make sure you have Node.js 18+ installed
cd cv-builder-fixed
npm install
npm run build
# Output is in dist/public/ — this is what you deploy
```

To test AI features locally:
```bash
# Create a .env file
echo "OPENAI_API_KEY=sk-your-key-here" > .env
npx netlify dev   # runs frontend + serverless functions together
```

---

## Deploy without AI features

The app works fully without `OPENAI_API_KEY` — PDF, DOCX, templates, drag-and-drop, search, and all editing features work offline. The AI buttons will just show setup instructions.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | For AI features only | From [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

---

## Features

- 64+ CV templates (Classic, Modern, Creative, Executive, Bangladeshi-style, and more)
- Live preview as you type
- PDF download (A4, full color, background preserved)
- DOCX download
- AI Generate — tailors your CV to a job description
- CV Score — ATS analysis with section breakdown
- Cover Letter generator with tone selection + DOCX download
- Drag-and-drop reorder for all sections
- Template comparison mode
- Search templates by name or category
- Custom sections (Certifications, Projects, etc.)
- Local storage — your CV auto-saves in the browser
