/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = 'idle' | 'running' | 'completed' | 'failed' | 'paused' | 'awaiting_intervention';

export interface AgentStep {
  id: string;
  number: number;
  tool: string;
  action: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  timestamp: string;
  details?: string;
  screenshot?: string;
}

export interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: string;
}

export interface MemoryItem {
  id: string;
  type: 'short-term' | 'long-term' | 'embedding' | 'fact';
  key: string;
  value: string;
  relevance: number;
  source?: string;
  createdAt?: string;
}

export interface AgentTask {
  id: string;
  title: string;
  status: TaskStatus;
  progress: number;
  runtime: string;
  retryCount: number;
  createdAt: string;
  interventionReason?: string;
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'trigger' | 'output' | 'logic';
  label: string;
  icon?: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  executionStatus?: 'idle' | 'running' | 'success' | 'failed' | 'awaiting_approval';
  outputVariables?: string[];
  thoughts?: string[];
  logs?: string[];
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowHistory {
  id: string;
  timestamp: string;
  status: 'success' | 'failed';
  duration: string;
  stepsExecuted: number;
}

export interface WorkflowSchedule {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'custom';
  cronExpression?: string;
  nextRun?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  edges: WorkflowEdge[];
  lastRun?: string;
  status: 'active' | 'draft' | 'archived';
  history?: WorkflowHistory[];
  schedule?: WorkflowSchedule;
  category?: string;
}
