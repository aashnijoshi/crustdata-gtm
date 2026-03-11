import { NextRequest, NextResponse } from 'next/server';

const SCORE_PROMPT = `You are a GTM intelligence engine for Crustdata (YC F24) — a real-time B2B data infrastructure company. Crustdata provides live people and company data via APIs: Company Search API, People Search API, Web Search API (AI agent-native), and Watcher API (real-time signals on job changes, promotions, funding rounds).

Crustdata's ICP: technical teams (engineers, founders, CTOs) at Series A-C companies with 20-200 employees building AI SDRs, AI recruiting platforms, sales automation tools, or investment due diligence platforms that need a real-time data layer. Key customers include Y Combinator, agent.ai, and MNTN.

Do NOT score data enrichment platforms, outbound automation tools, or GTM workflow products highly -- companies like Clay, Apollo, ZoomInfo, Lusha, or Clearbit are competitors or adjacent vendors, not customers. A high-fit customer is a company building a product that needs Crustdata's data as an input, not a company that aggregates or resells data themselves.

Score each account on:
1. Are they building AI agents or automation that needs live data?
2. Do they need real-time people or company data specifically?
3. Are buyers technical / developer-led?
4. Right stage -- Series A-C, 20-200 employees?
5. GTM, sales, recruiting, or investment use case fit?

Return a single JSON object with this exact shape:
{
  "tagline": "string",
  "industry": "string",
  "employees": "string e.g. 40-60",
  "stage": "string e.g. Series A",
  "arr": "string e.g. $2-4M",
  "icpScore": 0-100,
  "icpFit": {
    "buildsAIAgents": boolean,
    "needsLiveData": boolean,
    "technicalBuyers": boolean,
    "rightStage": boolean,
    "useCaseFit": boolean
  },
  "routing": {
    "decision": "Book Meeting" | "Nurture" | "Disqualify",
    "reason": "string"
  }
}
Return ONLY valid JSON, no markdown formatting or code blocks.`;

const DETAILS_PROMPT = `You are a GTM intelligence engine for Crustdata (YC F24) — a real-time B2B data infrastructure company.

Given the company info below and its ICP score, generate the remaining enrichment data.

Return a single JSON object with this exact shape:
{
  "signals": [
    { "type": "green" | "yellow" | "red", "label": "string", "detail": "string" }
  ],
  "persona": {
    "name": "string",
    "role": "string",
    "painQuote": "string",
    "founderName": "string"
  },
  "emails": [
    { "step": "Day 1", "subject": "string", "body": "string" },
    { "step": "Day 4", "subject": "string", "body": "string" },
    { "step": "Day 9", "subject": "string", "body": "string" }
  ]
}
For the persona, do real reasoning about who the likely champion is at this specific
company. If it's a small startup (under 50 people), the champion is often a founder
or CTO. If it's Series B+, it's likely a Head of Sales, VP of GTM, or growth lead.
Give them a realistic full name, specific title, and a pain quote that is hyper-specific
to their company -- reference their actual product or use case, not generic pain points.

Also add a "founderName" field: your best guess at the actual founder or CEO's name
based on what you know about this company. If you don't know, make a reasonable inference
or leave as "Unknown".

For the emails: Include the likely founder or CEO first name in the Day 1 email subject line
and opening line where it feels natural, not forced. For example, if the founder is "John Smith",
the subject could reference them or the opening could say "Hi John," naturally.

IMPORTANT: Do NOT use em dashes (--) anywhere in the email bodies. Use commas, periods, or
rewrite sentences to avoid them entirely.

Return ONLY valid JSON, no markdown formatting or code blocks.`;

interface ClearbitCompany {
  name: string;
  domain: string;
  logo: string;
}

async function fetchClearbitData(companyName: string): Promise<ClearbitCompany | null> {
  try {
    const response = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(companyName)}`
    );
    if (!response.ok) return null;
    const results = await response.json();
    if (results && results.length > 0) {
      return {
        name: results[0].name,
        domain: results[0].domain,
        logo: results[0].logo,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function callClaude(apiKey: string, systemPrompt: string, userMessage: string, maxTokens: number) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Anthropic API error:', errorText);
    throw new Error('Failed to call Claude API');
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;
  if (!content) throw new Error('No response from AI');
  return JSON.parse(content);
}

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, description, phase, scoreData } = body;

    if (!company || !description) {
      return NextResponse.json(
        { error: 'Company name and description are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Phase 1: Quick score + Clearbit lookup
    if (phase === 'score') {
      const [clearbitData, scoreResult] = await Promise.all([
        fetchClearbitData(company),
        callClaude(
          apiKey,
          SCORE_PROMPT,
          `Analyze this company for Crustdata ICP fit:\n\nCompany: ${company}\nDescription: ${description}`,
          200
        ),
      ]);

      return NextResponse.json({
        ...scoreResult,
        clearbit: clearbitData,
      });
    }

    // Phase 2: Full details (signals, persona, emails)
    if (phase === 'details') {
      const detailsData = await callClaude(
        apiKey,
        DETAILS_PROMPT,
        `Company: ${company}\nDescription: ${description}\nICP Score: ${scoreData?.icpScore || 'unknown'}\nRouting: ${scoreData?.routing?.decision || 'unknown'}`,
        800
      );

      return NextResponse.json(detailsData);
    }

    // Default: full enrichment (both phases combined for backward compat)
    const clearbitData = await fetchClearbitData(company);

    const clearbitContext = clearbitData
      ? `\nVerified company info from Clearbit:\n- Domain: ${clearbitData.domain}\n- Official name: ${clearbitData.name}`
      : '';

    const fullPrompt = `${SCORE_PROMPT}

Additionally, include these fields in your response:
"signals": [
  { "type": "green" | "yellow" | "red", "label": "string", "detail": "string" }
],
"persona": {
  "name": "string",
  "role": "string",
  "painQuote": "string",
  "founderName": "string"
},
"emails": [
  { "step": "Day 1", "subject": "string", "body": "string" },
  { "step": "Day 4", "subject": "string", "body": "string" },
  { "step": "Day 9", "subject": "string", "body": "string" }
]
For the persona, do real reasoning about who the likely champion is at this specific
company. If it's a small startup (under 50 people), the champion is often a founder
or CTO. If it's Series B+, it's likely a Head of Sales, VP of GTM, or growth lead.
Give them a realistic full name, specific title, and a pain quote that is hyper-specific
to their company -- reference their actual product or use case, not generic pain points.

Also add a "founderName" field: your best guess at the actual founder or CEO's name
based on what you know about this company. If you don't know, make a reasonable inference
or leave as "Unknown".

For the emails: Include the likely founder or CEO first name in the Day 1 email subject line
and opening line where it feels natural, not forced.

IMPORTANT: Do NOT use em dashes (--) anywhere in the email bodies. Use commas, periods, or
rewrite sentences to avoid them entirely.`;

    const enrichedData = await callClaude(
      apiKey,
      fullPrompt,
      `Analyze this company for Crustdata ICP fit:\n\nCompany: ${company}\nDescription: ${description}${clearbitContext}`,
      800
    );

    return NextResponse.json({
      ...enrichedData,
      clearbit: clearbitData,
    });
  } catch (error) {
    console.error('Enrich API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
