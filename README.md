# GTM OS — AI-Powered GTM Intelligence for Crustdata

Built in 2 hours as a working demo of what a GTM Engineer can ship with AI.

Paste any company name and description. GTM OS enriches the account, scores ICP fit 
against Crustdata's buyer criteria, surfaces buy signals, generates a personalized 
3-touch outbound sequence, and routes the lead — all in under 10 seconds.

## What it does

- **ICP Scoring** — rates each account 0–100 against Crustdata's actual criteria: are they building AI agents, do they need live data, are buyers technical, right stage, right use case
- **Signal Detection** — surfaces green/yellow/red buy signals per account
- **Champion Persona** — infers the likely champion at the company with a hyper-specific pain quote
- **Outbound Sequences** — generates a personalized Day 1 / Day 4 / Day 9 email sequence per account
- **Lead Routing** — auto-routes to Book Meeting, Nurture, or Disqualify with reasoning
- **Pipeline View** — CRM-style view across all enriched accounts

## Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS
- Anthropic Claude API (claude-sonnet-4-20250514)
- Deployed on Vercel

## Running locally

1. Clone the repo
2. Install dependencies using `npm install`
3. Create `.env.local` in the project root with `ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx`
4. Run the dev server: `npm run dev`
5. Open `localhost:3000`

## What's next

Right now the tool uses Claude to infer all enrichment data. The obvious v2 replaces 
inference with Crustdata's actual APIs:

- **Company Search API** → replace estimated firmographics with verified headcount, funding stage, total raised
- **People Search API** → replace inferred personas with real champions, real titles, real verified emails
- **Watcher API** → replace static signals with live triggers — funding rounds, promotions, job changes — and fire outbound automatically when they hit
- **Web Search API** → pull recent news and job postings per account before generating emails so every sequence references something that happened in the last 30 days

**For actually sending outbound**, the stack would be:
- **Resend** for email delivery — clean developer API, 3k free emails/month, simple to set up
- Flow: company name in → Crustdata People Search finds the champion + verified email → Claude writes the personalized sequence → Resend fires Day 1 immediately and schedules Day 4 and Day 9 automatically

The full loop: one company name input → fully automated outbound. 

## Built by

Aashni Joshi — [LinkedIn](https://linkedin.com/in/aashnijoshi) · [GitHub](https://github.com/aashnijoshi)
