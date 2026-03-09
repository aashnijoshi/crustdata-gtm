'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Types
interface IcpFit {
  buildsAIAgents: boolean;
  needsLiveData: boolean;
  technicalBuyers: boolean;
  rightStage: boolean;
  useCaseFit: boolean;
}

interface Signal {
  type: 'green' | 'yellow' | 'red';
  label: string;
  detail: string;
}

interface Persona {
  name: string;
  role: string;
  painQuote: string;
}

interface Routing {
  decision: 'Book Meeting' | 'Nurture' | 'Disqualify';
  reason: string;
}

interface Email {
  step: string;
  subject: string;
  body: string;
}

interface EnrichedData {
  tagline: string;
  industry: string;
  employees: string;
  stage: string;
  arr: string;
  icpScore: number;
  icpFit: IcpFit;
  signals: Signal[];
  persona: Persona;
  routing: Routing;
  emails: Email[];
}

interface Lead {
  id: string;
  company: string;
  description: string;
  enrichedData: EnrichedData;
}

// Seed data
const seedLeads: Lead[] = [
  {
    id: '1',
    company: 'Clay',
    description: 'B2B data enrichment and outbound automation platform. Series B, ~80 employees. Helps GTM teams build enriched lead lists and run personalized outbound at scale.',
    enrichedData: {
      tagline: 'B2B data enrichment and outbound automation',
      industry: 'Sales Technology',
      employees: '70–90',
      stage: 'Series B',
      arr: '$15–25M',
      icpScore: 94,
      icpFit: {
        buildsAIAgents: true,
        needsLiveData: true,
        technicalBuyers: true,
        rightStage: true,
        useCaseFit: true,
      },
      signals: [
        { type: 'green', label: 'Data Infrastructure Play', detail: 'Core product relies on real-time data enrichment — direct competitor to parts of Crustdata' },
        { type: 'green', label: 'Technical Leadership', detail: 'Engineering-led GTM with strong developer advocacy' },
        { type: 'yellow', label: 'Competitive Dynamics', detail: 'May view Crustdata as competitive rather than complementary' },
        { type: 'green', label: 'Scale Requirements', detail: 'Processing millions of records requires reliable data infrastructure' },
      ],
      persona: {
        name: 'Marcus Chen',
        role: 'Head of Data Engineering',
        painQuote: 'We spend 40% of our engineering cycles maintaining data pipelines that should just work.',
      },
      routing: {
        decision: 'Book Meeting',
        reason: 'High ICP fit with clear data infrastructure needs. Strategic partnership potential despite competitive overlap.',
      },
      emails: [
        {
          step: 'Day 1',
          subject: 'Data infrastructure at Clay',
          body: 'Hi Marcus,\n\nNoticed Clay is processing massive volumes of B2B data for enrichment. Curious how you handle real-time signals like job changes and funding rounds at scale.\n\nWe power the data layer for teams like agent.ai — might be interesting to compare notes on infrastructure approaches.\n\nWorth a 15-min chat?\n\nAashni from Crustdata',
        },
        {
          step: 'Day 4',
          subject: 'Re: Data infrastructure at Clay',
          body: 'Hi Marcus,\n\nFollowing up — saw Clay just launched the new waterfall enrichment feature. Impressive engineering.\n\nWe recently shipped our Watcher API for real-time job change signals. Some of our customers use it to trigger enrichment workflows automatically.\n\nHappy to share how we built it if useful.\n\nAashni from Crustdata',
        },
        {
          step: 'Day 9',
          subject: 'Quick data question',
          body: 'Hi Marcus,\n\nLast note — we just published benchmarks on our Company Search API latency (sub-100ms p99).\n\nIf data infrastructure is ever a bottleneck for Clay, would love to show you what we have built.\n\nAashni from Crustdata',
        },
      ],
    },
  },
  {
    id: '2',
    company: 'Unify',
    description: 'AI-powered outbound platform for revenue teams. Series A, ~35 employees. Combines intent signals with AI to automate personalized outbound sequences.',
    enrichedData: {
      tagline: 'AI-powered outbound automation',
      industry: 'Sales Technology',
      employees: '30–40',
      stage: 'Series A',
      arr: '$3–5M',
      icpScore: 88,
      icpFit: {
        buildsAIAgents: true,
        needsLiveData: true,
        technicalBuyers: true,
        rightStage: true,
        useCaseFit: true,
      },
      signals: [
        { type: 'green', label: 'AI Agent Architecture', detail: 'Building autonomous outbound agents that require real-time data signals' },
        { type: 'green', label: 'Intent Data Consumer', detail: 'Product relies heavily on buying signals and intent data' },
        { type: 'green', label: 'Right Stage', detail: 'Series A with 35 employees — ideal technical buyer profile' },
        { type: 'yellow', label: 'Early Revenue', detail: 'May have budget constraints typical of Series A' },
      ],
      persona: {
        name: 'Sarah Kim',
        role: 'CTO & Co-founder',
        painQuote: 'Our AI agents are only as good as the data we feed them. Stale data means irrelevant outreach.',
      },
      routing: {
        decision: 'Book Meeting',
        reason: 'Perfect ICP fit. AI-native company building exactly what Crustdata enables.',
      },
      emails: [
        {
          step: 'Day 1',
          subject: 'Data for Unify AI agents',
          body: 'Hi Sarah,\n\nLove what you are building at Unify — AI agents for outbound is the future.\n\nCurious how you are handling real-time signals like job changes and promotions. We power that layer for similar AI-native companies.\n\nWould love to learn more about your data architecture.\n\nAashni from Crustdata',
        },
        {
          step: 'Day 4',
          subject: 'Re: Data for Unify AI agents',
          body: 'Hi Sarah,\n\nFollowing up — we just shipped a feature that might be relevant: real-time job change webhooks.\n\nImagine triggering an AI-generated email the moment a prospect gets promoted. Some of our customers are seeing 3x reply rates.\n\nHappy to show you a quick demo.\n\nAashni from Crustdata',
        },
        {
          step: 'Day 9',
          subject: 'Unify + Crustdata',
          body: 'Hi Sarah,\n\nLast reach out — we have a few AI SDR companies using our APIs and would love to add Unify to that list.\n\nNo pressure, but if real-time B2B data ever becomes a bottleneck, we should talk.\n\nAashni from Crustdata',
        },
      ],
    },
  },
];

const loadingMessages = [
  'Enriching account...',
  'Scoring ICP fit...',
  'Building outbound sequence...',
  'Routing lead...',
];

export default function GTMOSPage() {
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(seedLeads[0].id);
  const [activeTab, setActiveTab] = useState<'icp' | 'signals' | 'outbound' | 'routing'>('icp');
  const [showPipeline, setShowPipeline] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleAddAccount = async () => {
    if (!newCompany.trim() || !newDescription.trim()) return;

    setIsLoading(true);
    setLoadingMessageIndex(0);

    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: newCompany, description: newDescription }),
      });

      if (!response.ok) throw new Error('Failed to enrich');

      const enrichedData: EnrichedData = await response.json();

      const newLead: Lead = {
        id: Date.now().toString(),
        company: newCompany,
        description: newDescription,
        enrichedData,
      };

      setLeads((prev) => [newLead, ...prev]);
      setSelectedLeadId(newLead.id);
      setNewCompany('');
      setNewDescription('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error enriching account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getRoutingColor = (decision: string) => {
    if (decision === 'Book Meeting') return 'bg-green-100 text-green-700';
    if (decision === 'Nurture') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getRoutingEmoji = (decision: string) => {
    if (decision === 'Book Meeting') return '📅';
    if (decision === 'Nurture') return '🔄';
    return '✗';
  };

  const getSignalDotColor = (type: string) => {
    if (type === 'green') return 'bg-green-500';
    if (type === 'yellow') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const highFitCount = leads.filter((l) => l.enrichedData.icpScore >= 80).length;
  const avgScore = Math.round(leads.reduce((sum, l) => sum + l.enrichedData.icpScore, 0) / leads.length);

  return (
    <div className={cn('min-h-screen bg-background', !mounted && 'opacity-0')}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-card px-4">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight text-foreground">
              GTM OS
            </h1>
            <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs font-medium text-accent">
              Crustdata
            </span>
          </div>
          <button
            onClick={() => setShowPipeline(!showPipeline)}
            className={cn(
              'rounded-md border border-border px-3 py-1.5 font-mono text-xs font-medium transition-colors',
              showPipeline ? 'bg-foreground text-background' : 'bg-card text-foreground hover:bg-muted'
            )}
          >
            Pipeline
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-0">
        {/* Sidebar */}
        <aside className="sticky top-14 h-[calc(100vh-56px)] w-80 shrink-0 border-r border-border bg-card">
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Accounts
                </h2>
                <span className="font-mono text-xs text-muted-foreground">{leads.length}</span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full rounded-md border border-dashed border-border bg-background px-3 py-2 font-mono text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                + Add Account
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="border-b border-border bg-muted/50 p-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Company name"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full rounded-md border border-border bg-card px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <textarea
                    placeholder="Brief description..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    onClick={handleAddAccount}
                    disabled={isLoading || !newCompany.trim() || !newDescription.trim()}
                    className="w-full rounded-md bg-foreground px-3 py-2 font-mono text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? 'Enriching...' : 'Enrich Account'}
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="border-b border-border bg-accent/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  <span className="animate-pulse font-mono text-xs text-accent">
                    {loadingMessages[loadingMessageIndex]}
                  </span>
                </div>
              </div>
            )}

            {/* Leads List */}
            <div className="flex-1 overflow-y-auto p-2">
              {leads.map((lead, index) => (
                <button
                  key={lead.id}
                  onClick={() => {
                    setSelectedLeadId(lead.id);
                    setShowPipeline(false);
                  }}
                  className={cn(
                    'mb-1 w-full rounded-md p-3 text-left transition-all',
                    mounted && 'animate-in fade-in slide-in-from-left-2',
                    selectedLeadId === lead.id ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-medium text-foreground">{lead.company}</h3>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {lead.enrichedData.tagline}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'font-mono text-xs font-semibold',
                        getScoreColor(lead.enrichedData.icpScore)
                      )}
                    >
                      {lead.enrichedData.icpScore}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="font-mono text-xs text-muted-foreground">Claude AI · Live enrichment</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-56px)] flex-1 p-6">
          {showPipeline ? (
            // Pipeline View
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="mb-6 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-foreground">
                Pipeline
              </h2>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Total Accounts
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-foreground">
                    {leads.length}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    High Fit (80+)
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-green-600">
                    {highFitCount}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Avg ICP Score
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-accent">
                    {avgScore}
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Stage
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        ICP Score
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Routing
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          setShowPipeline(false);
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted font-mono text-sm font-medium text-foreground">
                              {lead.company[0]}
                            </div>
                            <span className="font-sans text-sm font-medium text-foreground">
                              {lead.company}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                            {lead.enrichedData.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('font-mono text-sm font-semibold', getScoreColor(lead.enrichedData.icpScore))}>
                            {lead.enrichedData.icpScore}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('rounded-md px-2 py-1 font-mono text-xs font-medium', getRoutingColor(lead.enrichedData.routing.decision))}>
                            {lead.enrichedData.routing.decision}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedLead ? (
            // Account Detail View
            <div className="animate-in fade-in slide-in-from-bottom-2">
              {/* Header */}
              <div className="mb-6">
                <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-foreground">
                  {selectedLead.company}
                </h2>
                <p className="mt-1 font-sans text-sm text-muted-foreground">{selectedLead.description}</p>
              </div>

              {/* Tabs */}
              <div className="mb-6 flex gap-1 border-b border-border">
                {(['icp', 'signals', 'outbound', 'routing'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'border-b-2 px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider transition-colors',
                      activeTab === tab
                        ? 'border-accent text-accent'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab === 'icp' ? 'ICP Profile' : tab === 'outbound' ? 'Outbound' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="animate-in fade-in slide-in-from-bottom-1">
                {activeTab === 'icp' && (
                  <div className="space-y-6">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">ICP Score</p>
                        <div className="mt-2 flex items-end gap-2">
                          <p className={cn('font-[family-name:var(--font-fraunces)] text-3xl font-semibold', getScoreColor(selectedLead.enrichedData.icpScore))}>
                            {selectedLead.enrichedData.icpScore}
                          </p>
                          <span className="mb-1 font-mono text-xs text-muted-foreground">/ 100</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-accent transition-all duration-700"
                            style={{ width: `${selectedLead.enrichedData.icpScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Routing</p>
                        <div className="mt-2">
                          <span className={cn('inline-block rounded-md px-2 py-1 font-mono text-sm font-medium', getRoutingColor(selectedLead.enrichedData.routing.decision))}>
                            {selectedLead.enrichedData.routing.decision}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Stage</p>
                        <p className="mt-2 font-[family-name:var(--font-fraunces)] text-xl font-semibold text-foreground">
                          {selectedLead.enrichedData.stage}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Est. ARR</p>
                        <p className="mt-2 font-[family-name:var(--font-fraunces)] text-xl font-semibold text-foreground">
                          {selectedLead.enrichedData.arr}
                        </p>
                      </div>
                    </div>

                    {/* ICP Fit Criteria */}
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                      <h3 className="mb-4 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        ICP Fit Criteria
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: 'buildsAIAgents', label: 'Builds AI agents or automation' },
                          { key: 'needsLiveData', label: 'Needs real-time people/company data' },
                          { key: 'technicalBuyers', label: 'Technical/developer-led buyers' },
                          { key: 'rightStage', label: 'Right stage (Series A–C, 20–200 employees)' },
                          { key: 'useCaseFit', label: 'GTM, sales, recruiting, or investment use case' },
                        ].map((criterion) => (
                          <div key={criterion.key} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                            <span className="font-sans text-sm text-foreground">{criterion.label}</span>
                            {selectedLead.enrichedData.icpFit[criterion.key as keyof IcpFit] ? (
                              <span className="font-mono text-sm font-medium text-green-600">✓ Yes</span>
                            ) : (
                              <span className="font-mono text-sm font-medium text-red-600">✗ No</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Champion Persona */}
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                      <h3 className="mb-4 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Champion Persona
                      </h3>
                      <div className="border-l-2 border-accent pl-4">
                        <p className="font-mono text-sm font-medium text-foreground">{selectedLead.enrichedData.persona.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{selectedLead.enrichedData.persona.role}</p>
                        <p className="mt-3 font-sans text-sm italic text-muted-foreground">
                          &ldquo;{selectedLead.enrichedData.persona.painQuote}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'signals' && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLead.enrichedData.signals.map((signal, index) => (
                      <div key={index} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', getSignalDotColor(signal.type))} />
                          <div>
                            <p className="font-sans text-sm font-medium text-foreground">{signal.label}</p>
                            <p className="mt-1 font-sans text-sm text-muted-foreground">{signal.detail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'outbound' && (
                  <div className="space-y-4">
                    {selectedLead.enrichedData.emails.map((email, index) => (
                      <div key={index} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                        <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
                          <span className="rounded-md bg-foreground px-2 py-1 font-mono text-xs font-medium text-background">
                            {email.step}
                          </span>
                          <span className="font-sans text-sm font-medium text-foreground">{email.subject}</span>
                        </div>
                        <div className="p-4">
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
                            {email.body}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'routing' && (
                  <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
                    <div className="text-center">
                      <span className="text-5xl">{getRoutingEmoji(selectedLead.enrichedData.routing.decision)}</span>
                      <p className={cn('mt-4 inline-block rounded-lg px-4 py-2 font-mono text-lg font-semibold', getRoutingColor(selectedLead.enrichedData.routing.decision))}>
                        {selectedLead.enrichedData.routing.decision}
                      </p>
                      <p className="mx-auto mt-4 max-w-md font-sans text-sm text-muted-foreground">
                        {selectedLead.enrichedData.routing.reason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Empty State
            <div className="flex h-full items-center justify-center">
              <p className="font-mono text-sm text-muted-foreground">Select an account to view details</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
