/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentStep, LogEntry, MemoryItem, AgentTask, Workflow } from '../types/agent';

export const MOCK_STEPS: AgentStep[] = [
  {
    id: '1',
    number: 1,
    tool: 'Browser',
    action: 'Navigate to https://google.com',
    status: 'success',
    timestamp: '14:30:01',
    details: 'Page loaded in 1.2s'
  },
  {
    id: '2',
    number: 2,
    tool: 'Browser',
    action: 'Search for "latest product prices"',
    status: 'success',
    timestamp: '14:30:05',
    details: 'Found 12 search results'
  },
  {
    id: '3',
    number: 3,
    tool: 'Scraper',
    action: 'Extract pricing data from page',
    status: 'running',
    timestamp: '14:30:12',
    details: 'Processing dynamic elements...'
  },
  {
    id: '4',
    number: 4,
    tool: 'Memory',
    action: 'Save extracted pricing to session',
    status: 'pending',
    timestamp: '-',
  }
];

export const MOCK_LOGS: LogEntry[] = [
  { id: 'l1', level: 'info', message: 'Agent initialized with version 2.4.0', timestamp: '14:30:00.123' },
  { id: 'l2', level: 'info', message: 'Navigating to target URL...', timestamp: '14:30:01.456' },
  { id: 'l3', level: 'debug', message: 'Chrome instance spawned on port 9222', timestamp: '14:30:01.890' },
  { id: 'l4', level: 'info', message: 'Successfully navigated. Page title: Google', timestamp: '14:30:02.345' },
  { id: 'l5', level: 'warning', message: 'Cookie banner detected. Attempting to bypass...', timestamp: '14:30:03.111' },
  { id: 'l6', level: 'info', message: 'Cookie banner accepted.', timestamp: '14:30:04.222' },
  { id: 'l7', level: 'info', message: 'Executing search query: "latest product prices"', timestamp: '14:30:05.678' },
  { id: 'l8', level: 'error', message: 'Rate limit hit on primary scraper. Retrying with proxy...', timestamp: '14:30:10.999' },
];

export const MOCK_MEMORY: MemoryItem[] = [
  { id: 'm1', type: 'short-term', key: 'product_count', value: '42', relevance: 0.95, source: 'Amazon Scraper', createdAt: '2026-04-18T14:30:00Z' },
  { id: 'm2', type: 'short-term', key: 'last_url', value: 'https://amazon.com/search?q=prices', relevance: 0.88, source: 'Browser Tool', createdAt: '2026-04-18T14:31:00Z' },
  { id: 'm3', type: 'embedding', key: 'user_intent', value: 'Search for high-quality minimalist furniture', relevance: 1.0, source: 'Gemini LLM', createdAt: '2026-04-18T14:32:00Z' },
  { id: 'm4', type: 'long-term', key: 'historical_avg_price', value: '$249.99', relevance: 0.75, source: 'Database', createdAt: '2026-04-10T10:00:00Z' },
  { id: 'm5', type: 'fact', key: 'client_name', value: 'Acme Corp', relevance: 1.0, source: 'CRM', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'm6', type: 'fact', key: 'primary_goal', value: 'Market Sentiment Analysis', relevance: 0.9, source: 'System', createdAt: '2026-04-18T14:00:00Z' },
];

export const CURRENT_TASK: AgentTask = {
  id: 'TASK-2024-0815',
  title: 'Scrape furniture prices from major retailers',
  status: 'running',
  progress: 65,
  runtime: '00:12:45',
  retryCount: 1,
  createdAt: '2026-04-18T14:30:00Z',
};

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Daily Research Digest',
    description: 'Scrapes arXiv for new AI papers and summarizes them.',
    status: 'active',
    lastRun: '2 hours ago',
    steps: [
      { id: '1', type: 'trigger', label: 'Schedule: Daily 8AM', icon: 'Hash', position: { x: 50, y: 50 }, config: {}, executionStatus: 'idle' },
      { id: '2', type: 'action', label: 'Scrape arXiv', icon: 'Globe', position: { x: 50, y: 150 }, config: {}, executionStatus: 'idle' },
      { id: '3', type: 'action', label: 'Extract Summaries', icon: 'Cpu', position: { x: 50, y: 250 }, config: {}, executionStatus: 'idle' },
      { id: '4', type: 'output', label: 'Send Email', icon: 'Mail', position: { x: 50, y: 350 }, config: {}, executionStatus: 'idle' },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ],
    history: [
      { id: 'h1', timestamp: '2026-04-18T08:00:00Z', status: 'success', duration: '45s', stepsExecuted: 4 },
      { id: 'h2', timestamp: '2026-04-17T08:00:00Z', status: 'success', duration: '42s', stepsExecuted: 4 },
    ],
    schedule: { enabled: true, frequency: 'daily', nextRun: '2026-04-19T08:00:00Z' }
  },
  {
    id: 'wf-2',
    name: 'Competitor Price Tracker',
    description: 'Monitors competitor websites for price drops.',
    status: 'draft',
    lastRun: 'Never',
    steps: [],
    edges: [],
  }
];

export const WORKFLOW_TEMPLATES: Workflow[] = [
  {
    id: 'tmpl-1',
    name: 'Web Scraper to Email',
    description: 'Extract data from any website and send it directly to your inbox.',
    category: 'Automation',
    status: 'draft',
    steps: [
      { id: '1', type: 'trigger', label: 'Manual Trigger', icon: 'Circle', position: { x: 250, y: 50 }, config: {} },
      { id: '2', type: 'action', label: 'Search Content', icon: 'Search', position: { x: 250, y: 150 }, config: {} },
      { id: '3', type: 'action', label: 'Extract Data', icon: 'FileText', position: { x: 250, y: 250 }, config: {} },
      { id: '4', type: 'output', label: 'Send Email', icon: 'Mail', position: { x: 250, y: 350 }, config: {} },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
    ],
  },
  {
    id: 'tmpl-2',
    name: 'AI Content Digest',
    description: 'Summarize multiple news sources using AI and post to a webhook.',
    category: 'Intelligence',
    status: 'draft',
    steps: [
      { id: '1', type: 'trigger', label: 'RSS Feed', icon: 'Hash', position: { x: 250, y: 50 }, config: {} },
      { id: '2', type: 'action', label: 'AI Summarize', icon: 'Cpu', position: { x: 250, y: 150 }, config: {} },
      { id: '3', type: 'output', label: 'Webhook POST', icon: 'Webhook', position: { x: 250, y: 250 }, config: {} },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
    ],
  },
  {
    id: 'tmpl-3',
    name: 'Lead Enrichment',
    description: 'Verify and enrich lead data using search and logical filters.',
    category: 'Sales',
    status: 'draft',
    steps: [
      { id: '1', type: 'trigger', label: 'New Lead', icon: 'Circle', position: { x: 250, y: 50 }, config: {} },
      { id: '2', type: 'action', label: 'Extract Entities', icon: 'FileText', position: { x: 250, y: 150 }, config: {} },
      { id: '3', type: 'logic', label: 'Validate Input', icon: 'Cpu', position: { x: 250, y: 250 }, config: {} },
      { id: '4', type: 'output', label: 'Database Update', icon: 'Webhook', position: { x: 250, y: 350 }, config: {} },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
    ],
  }
];
