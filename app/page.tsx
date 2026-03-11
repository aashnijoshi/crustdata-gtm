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
  founderName?: string;
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

interface ClearbitData {
  name: string;
  domain: string;
  logo: string;
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
  clearbit?: ClearbitData | null;
}

interface Lead {
  id: string;
  company: string;
  description: string;
  enrichedData: EnrichedData;
  isLoadingDetails?: boolean;
}

// Seed data
const seedLeads: Lead[] = [
  {
    id: '1',
    company: 'Gem',
    description: 'AI-powered recruiting platform, Series C, ~150 employees. Helps talent teams source, engage, and hire candidates. Heavy data enrichment needs -- relies on live people data to surface candidates and track job changes in real time.',
    enrichedData: {
      tagline: 'AI-powered recruiting platform',
      industry: 'HR Technology',
      employees: '130-170',
      stage: 'Series C',
      arr: '$20-35M',
      icpScore: 91,
      icpFit: {
        buildsAIAgents: true,
        needsLiveData: true,
        technicalBuyers: true,
        rightStage: true,
        useCaseFit: true,
      },
      signals: [
        { type: 'green', label: 'Live People Data Consumer', detail: 'Core product depends on real-time candidate data and job change signals' },
        { type: 'green', label: 'Recruiting Use Case', detail: 'Direct fit for Crustdata People Search and Watcher APIs' },
        { type: 'green', label: 'Technical Buyers', detail: 'Engineering-led team building data-intensive recruiting infrastructure' },
        { type: 'yellow', label: 'Series C Scale', detail: 'Larger org may have existing data vendor relationships to displace' },
      ],
      persona: {
        name: 'Priya Nair',
        role: 'Head of Engineering',
        painQuote: 'Candidate data goes stale within weeks. We need job change signals the moment they happen, not after they\'ve already moved on.',
        founderName: 'Steve Bartel',
      },
      routing: {
        decision: 'Book Meeting',
        reason: 'Strong ICP fit. Gem is a data consumer building on live people data, exactly what Crustdata enables.',
      },
      emails: [
        {
          step: 'Day 1',
          subject: 'Steve, real-time candidate signals for Gem',
          body: 'Hi Priya,\n\nLove what you\'re building at Gem. AI-powered recruiting is a massive opportunity.\n\nCurious how you handle real-time job change signals today. We power that layer for recruiting and GTM teams that need to act on candidate moves the moment they happen.\n\nWorth a 15-min chat?\n\nAashni from Crustdata',
        },
        {
          step: 'Day 4',
          subject: 'Re: Real-time candidate signals for Gem',
          body: 'Hi Priya,\n\nFollowing up. We just shipped our Watcher API, which fires webhooks the moment someone changes jobs, gets promoted, or joins a target company.\n\nFor a platform like Gem, that could mean triggering outreach or surfacing warm candidates automatically.\n\nHappy to show you a quick demo.\n\nAashni from Crustdata',
        },
        {
          step: 'Day 9',
          subject: 'Gem + Crustdata',
          body: 'Hi Priya,\n\nLast note. We work with several recruiting platforms that use our People Search API to enrich candidate profiles with live data.\n\nIf candidate data freshness is ever a bottleneck, we should talk.\n\nAashni from Crustdata',
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
      employees: '30-40',
      stage: 'Series A',
      arr: '$3-5M',
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
        { type: 'green', label: 'Right Stage', detail: 'Series A with 35 employees, ideal technical buyer profile' },
        { type: 'yellow', label: 'Early Revenue', detail: 'May have budget constraints typical of Series A' },
      ],
      persona: {
        name: 'Sarah Kim',
        role: 'CTO & Co-founder',
        painQuote: 'Our AI agents are only as good as the data we feed them. Stale data means irrelevant outreach.',
        founderName: 'Austin Hughes',
      },
      routing: {
        decision: 'Book Meeting',
        reason: 'Perfect ICP fit. AI-native company building exactly what Crustdata enables.',
      },
      emails: [
        {
          step: 'Day 1',
          subject: 'Austin, data for Unify AI agents',
          body: 'Hi Sarah,\n\nLove what you are building at Unify. AI agents for outbound is the future.\n\nCurious how you are handling real-time signals like job changes and promotions. We power that layer for similar AI-native companies.\n\nWould love to learn more about your data architecture.\n\nAashni from Crustdata',
        },
        {
          step: 'Day 4',
          subject: 'Re: Data for Unify AI agents',
          body: 'Hi Sarah,\n\nFollowing up. We just shipped a feature that might be relevant: real-time job change webhooks.\n\nImagine triggering an AI-generated email the moment a prospect gets promoted. Some of our customers are seeing 3x reply rates.\n\nHappy to show you a quick demo.\n\nAashni from Crustdata',
        },
        {
          step: 'Day 9',
          subject: 'Unify + Crustdata',
          body: 'Hi Sarah,\n\nLast reach out. We have a few AI SDR companies using our APIs and would love to add Unify to that list.\n\nNo pressure, but if real-time B2B data ever becomes a bottleneck, we should talk.\n\nAashni from Crustdata',
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

export default function OrbitPage() {
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
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

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

    const company = newCompany;
    const description = newDescription;
    const id = Date.now().toString() + Math.random().toString(36).slice(2);

    setIsLoading(true);
    setIsLoadingScore(true);
    setLoadingMessageIndex(0);
    setNewCompany('');
    setNewDescription('');
    setShowAddForm(false);

    try {
      // Phase 1: Get score quickly + Clearbit data
      const scoreResponse = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, description, phase: 'score' }),
      });

      if (!scoreResponse.ok) throw new Error('Failed to enrich (score phase)');
      const scoreData = await scoreResponse.json();

      // Create lead with score data immediately, mark details as loading
      const partialLead: Lead = {
        id,
        company,
        description,
        isLoadingDetails: true,
        enrichedData: {
          tagline: scoreData.tagline || '',
          industry: scoreData.industry || '',
          employees: scoreData.employees || '',
          stage: scoreData.stage || '',
          arr: scoreData.arr || '',
          icpScore: scoreData.icpScore || 0,
          icpFit: scoreData.icpFit || {
            buildsAIAgents: false,
            needsLiveData: false,
            technicalBuyers: false,
            rightStage: false,
            useCaseFit: false,
          },
          routing: scoreData.routing || { decision: 'Nurture' as const, reason: '' },
          signals: [],
          persona: { name: '', role: '', painQuote: '' },
          emails: [],
          clearbit: scoreData.clearbit || null,
        },
      };

      // Render score data immediately
      setLeads((prev) => [partialLead, ...prev]);
      setSelectedLeadId(id);
      setIsLoadingScore(false);

      // Phase 2: Get full details in background
      const detailsResponse = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, description, phase: 'details', scoreData }),
      });

      if (!detailsResponse.ok) throw new Error('Failed to enrich (details phase)');
      const detailsData = await detailsResponse.json();

      // Update lead with full details
      setLeads((prev) => prev.map((l) => (l.id === id ? {
        ...partialLead,
        isLoadingDetails: false,
        enrichedData: {
          ...partialLead.enrichedData,
          signals: detailsData.signals || [],
          persona: detailsData.persona || { name: '', role: '', painQuote: '' },
          emails: detailsData.emails || [],
        },
      } : l)));
    } catch (error) {
      console.error('Error enriching account:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingScore(false);
    }
  };

  const handleSendSequence = async () => {
    if (!sendEmail.trim() || !selectedLead) return;

    setIsSending(true);
    setSendSuccess(false);

    try {
      const response = await fetch('/api/send-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: selectedLead.enrichedData.emails,
          toEmail: sendEmail,
          toName: selectedLead.enrichedData.persona.name,
        }),
      });

      if (!response.ok) throw new Error('Failed to send');
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        setShowSendForm(false);
        setSendEmail('');
      }, 3000);
    } catch (error) {
      console.error('Error sending sequence:', error);
    } finally {
      setIsSending(false);
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
    if (decision === 'Book Meeting') return '\u{1F4C5}';
    if (decision === 'Nurture') return '\u{1F504}';
    return '\u2717';
  };

  const getSignalDotColor = (type: string) => {
    if (type === 'green') return 'bg-green-500';
    if (type === 'yellow') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const CompanyAvatar = ({ lead, size = 'sm' }: { lead: Lead; size?: 'sm' | 'md' }) => {
    const sizeClass = size === 'md' ? 'h-10 w-10' : 'h-8 w-8';
    const textSize = size === 'md' ? 'text-base' : 'text-sm';
    if (lead.enrichedData.clearbit?.logo) {
      return (
        <img
          src={lead.enrichedData.clearbit.logo}
          alt={lead.company}
          className={cn(sizeClass, 'rounded-md object-contain')}
        />
      );
    }
    return (
      <div className={cn('flex items-center justify-center rounded-md bg-muted font-mono font-medium text-foreground', sizeClass, textSize)}>
        {lead.company[0]}
      </div>
    );
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
              Orbit
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
                    <div className="flex items-start gap-2">
                      <CompanyAvatar lead={lead} size="sm" />
                      <div>
                        <h3 className="font-sans text-sm font-medium text-foreground">{lead.company}</h3>
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {lead.enrichedData.tagline || 'Loading...'}
                        </p>
                      </div>
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
                            <CompanyAvatar lead={lead} size="sm" />
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
              <div className="mb-6 flex items-start gap-4">
                <CompanyAvatar lead={selectedLead} size="md" />
                <div>
                  <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-foreground">
                    {selectedLead.company}
                  </h2>
                  <p className="mt-1 font-sans text-sm text-muted-foreground">{selectedLead.description}</p>
                </div>
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
                      {isLoadingScore && selectedLead.enrichedData.icpScore === 0 ? (
                        <>
                          {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                              <div className="mt-4 h-8 w-12 animate-pulse rounded bg-muted" />
                              {i === 0 && <div className="mt-3 h-2 w-full animate-pulse rounded-full bg-muted" />}
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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
                          { key: 'rightStage', label: 'Right stage (Series A-C, 20-200 employees)' },
                          { key: 'useCaseFit', label: 'GTM, sales, recruiting, or investment use case' },
                        ].map((criterion) => (
                          <div key={criterion.key} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                            <span className="font-sans text-sm text-foreground">{criterion.label}</span>
                            {selectedLead.enrichedData.icpFit[criterion.key as keyof IcpFit] ? (
                              <span className="font-mono text-sm font-medium text-green-600">{'\u2713'} Yes</span>
                            ) : (
                              <span className="font-mono text-sm font-medium text-red-600">{'\u2717'} No</span>
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
                      {selectedLead.isLoadingDetails ? (
                        <div className="flex items-center gap-3 py-4">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                          <span className="animate-pulse font-mono text-xs text-accent">Loading persona...</span>
                        </div>
                      ) : (
                        <div className="border-l-2 border-accent pl-4">
                          <p className="font-mono text-sm font-medium text-foreground">{selectedLead.enrichedData.persona.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">{selectedLead.enrichedData.persona.role}</p>
                          <p className="mt-3 font-sans text-sm italic text-muted-foreground">
                            &ldquo;{selectedLead.enrichedData.persona.painQuote}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'signals' && (
                  selectedLead.isLoadingDetails ? (
                    <div className="flex items-center gap-3 py-8">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      <span className="animate-pulse font-mono text-xs text-accent">Loading signals...</span>
                    </div>
                  ) : (
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
                  )
                )}

                {activeTab === 'outbound' && (
                  selectedLead.isLoadingDetails ? (
                    <div className="flex items-center gap-3 py-8">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      <span className="animate-pulse font-mono text-xs text-accent">Generating outbound sequence...</span>
                    </div>
                  ) : (
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

                      {/* Send Sequence */}
                      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        {sendSuccess ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <span className="font-mono text-sm font-medium">{'\u2713'} Day 1 email sent successfully!</span>
                          </div>
                        ) : showSendForm ? (
                          <div className="space-y-3">
                            <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Send Day 1 Email
                            </p>
                            <input
                              type="email"
                              placeholder="Recipient email address"
                              value={sendEmail}
                              onChange={(e) => setSendEmail(e.target.value)}
                              className="w-full rounded-md border border-border bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSendSequence}
                                disabled={isSending || !sendEmail.trim()}
                                className="rounded-md bg-foreground px-4 py-2 font-mono text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                              >
                                {isSending ? 'Sending...' : 'Send Email'}
                              </button>
                              <button
                                onClick={() => { setShowSendForm(false); setSendEmail(''); }}
                                className="rounded-md border border-border px-4 py-2 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowSendForm(true)}
                            className="w-full rounded-md bg-foreground px-4 py-2 font-mono text-xs font-medium text-background transition-opacity hover:opacity-90"
                          >
                            Send Sequence
                          </button>
                        )}
                      </div>
                    </div>
                  )
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
