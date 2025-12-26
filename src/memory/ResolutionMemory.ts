import db from '../db/db';

export interface ResolutionMemoryRecord {
  id?: number;
  pattern: string;
  resolution: string; // e.g., 'approved', 'rejected'
  confidence: number;
  lastUpdated: string;
}

export class ResolutionMemory {
  static recall(pattern: string): ResolutionMemoryRecord | undefined {
    const row = db.prepare(
      'SELECT * FROM ResolutionMemory WHERE pattern = ? ORDER BY confidence DESC LIMIT 1'
    ).get(pattern) as ResolutionMemoryRecord | undefined;
    return row;
  }

  static learn(record: Omit<ResolutionMemoryRecord, 'id' | 'lastUpdated'>, reinforce = true) {
    const now = new Date().toISOString();
    // Check if exists
    const existing = db.prepare(
      'SELECT * FROM ResolutionMemory WHERE pattern = ? AND resolution = ?'
    ).get(record.pattern, record.resolution) as ResolutionMemoryRecord | undefined;
    if (existing) {
      // Reinforce or decay confidence
      const newConfidence = reinforce
        ? Math.min((existing.confidence ?? 0) + 0.1, 1)
        : Math.max((existing.confidence ?? 0) - 0.2, 0);
      db.prepare(
        'UPDATE ResolutionMemory SET confidence = ?, lastUpdated = ? WHERE id = ?'
      ).run(newConfidence, now, existing.id);
    } else {
      db.prepare(
        'INSERT INTO ResolutionMemory (pattern, resolution, confidence, lastUpdated) VALUES (?, ?, ?, ?)'
      ).run(record.pattern, record.resolution, reinforce ? 0.6 : 0.3, now);
    }
  }

  static getAll(): ResolutionMemoryRecord[] {
    return db.prepare('SELECT * FROM ResolutionMemory').all() as ResolutionMemoryRecord[];
  }
}
