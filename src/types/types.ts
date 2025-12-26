export interface Invoice {
  invoiceNumber: string;
  vendor: string;
  fields: Record<string, any>;
  rawText?: string;
}

export interface MemoryUpdate {
  type: 'VendorMemory' | 'CorrectionMemory' | 'ResolutionMemory';
  details: string;
}

export interface AuditEntry {
  step: 'recall' | 'apply' | 'decide' | 'learn';
  timestamp: string;
  details: string;
}

export interface OutputContract {
  normalizedInvoice: Record<string, any>;
  proposedCorrections: string[];
  requiresHumanReview: boolean;
  reasoning: string;
  confidenceScore: number;
  memoryUpdates: string[];
  auditTrail: AuditEntry[];
}
