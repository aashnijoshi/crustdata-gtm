import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a GTM intelligence engine for Crustdata (YC F24) — a real-time B2B data infrastructure company. Crustdata provides live people and company data via APIs: Company Search API, People Search API, Web Search API (AI agent-native), and Watcher API (real-time signals on job changes, promotions, funding rounds).

Crustdata's ICP: technical teams (engineers, founders, CTOs) at Series A–C companies with 20–200 employees building AI SDRs, AI recruiting platforms, sales automation tools, or investment due diligence platforms that need a real-time data layer. Key customers include Y Combinator, agent.ai, and MNTN.

Score each account on:
1. Are they building AI agents or automation that needs live data?
2. Do they need real-time people or company data specifically?
3. Are buyers technical / developer-led?
4. Right stage — Series A–C, 20–200 employees?
5. GTM, sales, recruiting, or investment use case fit?

Return a single JSON object with this exact shape:
{
  "tagline": "string",
  "industry": "string",
  "employees": "string e.g. 40–60",
  "stage": "string e.g. Series A",
  "arr": "string e.g. $2–4M",
  "icpScore": 0-100,
  "icpFit": {
    "buildsAIAgents": boolean,
    "needsLiveData": boolean,
    "technicalBuyers": boolean,
    "rightStage": boolean,
    "useCaseFit": boolean
  },
  "signals": [
    { "type": "green" | "yellow" | "red", "label": "string", "detail": "string" }
  ],
  "persona": {
    "name": "string",
    "role": "string",
    "painQuote": "string",
    "founderName": "string"
  },
  "routing": {
    "decision": "Book Meeting" | "Nurture" | "Disqualify",
    "reason": "string"
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
to their company — reference their actual product or use case, not generic pain points.

Also add a "founderName" field: your best guess at the actual founder or CEO's name 
based on what you know about this company. If you don't know, make a reasonable inference 
or leave as "Unknown".
Return ONLY valid JSON, no markdown formatting or code blocks.`;

export async function POST(request: NextRequest) {
  try {
    const { company, description } = await request.json();

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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Analyze this company for Crustdata ICP fit:\n\nCompany: ${company}\nDescription: ${description}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to enrich account' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    const enrichedData = JSON.parse(content);

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error('Enrich API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
