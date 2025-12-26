import db from '../db/db';

export interface CorrectionMemoryRecord {
  id?: number;
  pattern: string;
  correction: string;
  confidence: number;
  lastUpdated: string;
}

export class CorrectionMemory {
  static recall(pattern: string): CorrectionMemoryRecord | undefined {
    const row = db.prepare(
      'SELECT * FROM CorrectionMemory WHERE pattern = ? ORDER BY confidence DESC LIMIT 1'
    ).get(pattern) as CorrectionMemoryRecord | undefined;
    return row;
  }

  static learn(record: Omit<CorrectionMemoryRecord, 'id' | 'lastUpdated'>, reinforce = true) {
    const now = new Date().toISOString();
    // Check if exists
    const existing = db.prepare(
      'SELECT * FROM CorrectionMemory WHERE pattern = ? AND correction = ?'
    ).get(record.pattern, record.correction) as CorrectionMemoryRecord | undefined;
    if (existing) {
      // Reinforce or decay confidence
      const newConfidence = reinforce
        ? Math.min((existing.confidence ?? 0) + 0.1, 1)
        : Math.max((existing.confidence ?? 0) - 0.2, 0);
      db.prepare(
        'UPDATE CorrectionMemory SET confidence = ?, lastUpdated = ? WHERE id = ?'
      ).run(newConfidence, now, existing.id);
    } else {
      db.prepare(
        'INSERT INTO CorrectionMemory (pattern, correction, confidence, lastUpdated) VALUES (?, ?, ?, ?)'
      ).run(record.pattern, record.correction, reinforce ? 0.6 : 0.3, now);
    }
  }

  static getAll(): CorrectionMemoryRecord[] {
    return db.prepare('SELECT * FROM CorrectionMemory').all() as CorrectionMemoryRecord[];
  }
}
