# Skilldify Developers - The Palatial Website

This project is a premium real-estate website and guided property advisor for **The Palatial by Hero Homes**, Sector 104, Dwarka Expressway.

It does not show NotebookLM to customers. NotebookLM is used privately to prepare and refine the knowledge base.

## Run The Website

```powershell
cd "C:\Users\Lakshit Bhatia\Documents\Codex\2026-06-09\q-what-s-the-primary-use"
npm install
npm start
```

Open:

```text
http://localhost:3000
```

If port 3000 is already busy:

```powershell
$env:PORT=3001
npm start
```

Then open:

```text
http://localhost:3001
```

## NotebookLM Workflow

Create a new NotebookLM notebook named:

```text
Hero Palatial - Skilldify Developers Knowledge Base
```

Upload the files from:

```text
outputs/notebooklm_upload
```

Also upload the original PDFs from Downloads if you want NotebookLM to cite the original pages:

```text
C:\Users\Lakshit Bhatia\Downloads\Corporate Presentation.pdf
C:\Users\Lakshit Bhatia\Downloads\PALATIAL UNIT PLANS -New.pdf
C:\Users\Lakshit Bhatia\Downloads\5 Updated Updoc.pdf
```

Use the prompts in:

```text
outputs/notebooklm_upload/00-upload-instructions.md
```

## Private Knowledge Files

The website/advisor content is organized here:

```text
knowledge/project-summary.md
knowledge/unit-plans.md
knowledge/payment-plan.md
knowledge/amenities-and-specifications.md
knowledge/location-and-competitors.md
knowledge/buyer-faqs.md
```

Use these files as the internal source for future AI backend work.

## Current Website Features

- Cinematic luxury hero section.
- Skilldify Developers branding.
- Project highlights.
- Unit plan cards.
- Payment plan explanation.
- Amenities section.
- Competitor list.
- Palatial Matchmaker guided advisor.
- Ask The Advisor AI response panel powered by Claude when `ANTHROPIC_API_KEY` is configured.
- WhatsApp/site visit CTA placeholder.

## Important Note

NotebookLM is not exposed on the public website. Customers only see Skilldify Developers.

For a later AI backend, use the `knowledge/` files with Claude, Gemini, or another API. That gives you a stable branded tool without depending on unofficial NotebookLM automation.

## Enable Claude Advisor

Create `.env` from the example:

```powershell
copy .env.example .env
notepad .env
```

Set:

```text
ANTHROPIC_API_KEY=your_actual_key_here
ANTHROPIC_MODEL=claude-3-5-haiku-latest
WHATSAPP_NUMBER=919812345678
PORT=3000
```

Restart:

```powershell
npm start
```

The advisor uses concise answers and a small knowledge context to reduce token usage. For even lower cost later, you can swap to Gemini Flash or another low-cost model, but Claude Haiku is a good simple starting point with this code.

## Free Hosting Recommendation

Fastest beginner-friendly option for this exact app:

1. Push the project to GitHub.
2. Create a free Render Web Service.
3. Connect the GitHub repo.
4. Use build command:

```text
npm install
```

5. Use start command:

```text
npm start
```

6. Add environment variables in Render:

```text
ANTHROPIC_API_KEY=your_actual_key_here
ANTHROPIC_MODEL=claude-3-5-haiku-latest
WHATSAPP_NUMBER=919812345678
```

Use your WhatsApp number with country code and no plus sign. For India, it should look like `919812345678`.

Do not add `PORT` in Render. Render provides it automatically.

Render provides free Node.js web services, but free services can sleep after inactivity. For a fully free static/edge setup later, convert this Express backend into Cloudflare Pages Functions or Vercel Functions.
