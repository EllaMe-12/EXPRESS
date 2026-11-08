# EXPRESS

**Intention over occasion.** EXPRESS is an independently operated writing project that helps people turn thoughts and feelings into personal, editable messages.

## What it does

- Choose a situation or occasion, from celebration to difficult conversations.
- Answer a few prompts in your own words.
- Generate a personalized draft with Google Gemini.
- Edit, copy, download, or turn the message into a styled card.
- Browse About, Contact, Privacy, and Terms from the footer.

## Project structure

```
.
├── src/                 # React interface
├── public/              # Static assets and favicon
├── backend/
│   └── server.js        # Express API and Gemini message generation
├── index.html
├── package.json
└── vite.config.js
```

## Requirements

- Node.js (a current LTS release is recommended)
- A Google Gemini API key for message generation

## Run locally

### 1. Start the frontend

From the repository root:

```bash
npm install
npm run dev
```

Vite prints the local development URL.

### 2. Start the backend

In a second terminal:

```bash
cd backend
npm install
```

Create `backend/.env` and add:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
# Optional:
# GEMINI_MODEL=gemini-3.5-flash
```

Then run:

```bash
npm run dev
```

The API listens on port 5000 by default. The frontend currently uses `http://localhost:5000` unless `VITE_API_URL` is set.

## Deployment

Deploy the frontend and backend separately if your hosting setup requires it. Configure `VITE_API_URL` on the frontend with the deployed backend origin, and set `GEMINI_API_KEY` securely in the backend environment. Do not commit API keys or the `.env` file.

## Operator and contact

EXPRESS is operated independently by its creator (not represented here as a registered company). Questions or feedback: **ellame2048@gmail.com**.

## Current data handling

- The current app has no user-account system or database for saving prompts or generated drafts.
- A generation request sends the selected occasion and submitted answers to the backend, which forwards the prompt to Google Gemini.
- No analytics or advertising tracker is intentionally integrated in the current application code reviewed for this project. Hosting and AI providers may still process technical or operational data under their own configurations and policies.
- Do not submit highly sensitive or confidential information.
- These statements describe the current implementation only. Update the policy and code before adding accounts, subscriptions, payments, saved history, or tracking.

## Note

Generated messages are AI drafts. Review and edit them to make sure they reflect your own intention before sharing.
