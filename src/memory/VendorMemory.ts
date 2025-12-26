import db from '../db/db';

export interface VendorMemoryRecord {
  id?: number;
  vendor: string;
  pattern: string;
  field: string;
  value: string;
  confidence: number;
  lastUpdated: string;
}

export class VendorMemory {
  static recall(vendor: string, pattern: string, field: string): VendorMemoryRecord | undefined {
    const row = db.prepare(
      'SELECT * FROM VendorMemory WHERE vendor = ? AND pattern = ? AND field = ? ORDER BY confidence DESC LIMIT 1'
    ).get(vendor, pattern, field) as VendorMemoryRecord | undefined;
    return row;
  }

  static learn(record: Omit<VendorMemoryRecord, 'id' | 'lastUpdated'>, reinforce = true) {
    const now = new Date().toISOString();
  
    const existing = db.prepare(
      'SELECT * FROM VendorMemory WHERE vendor = ? AND pattern = ? AND field = ? AND value = ?'
    ).get(record.vendor, record.pattern, record.field, record.value) as VendorMemoryRecord | undefined;
    if (existing) {
     //Reinforce or decay confidence
      const newConfidence = reinforce
        ? Math.min((existing.confidence ?? 0) + 0.1, 1)
        : Math.max((existing.confidence ?? 0) - 0.2, 0);
      db.prepare(
        'UPDATE VendorMemory SET confidence = ?, lastUpdated = ? WHERE id = ?'
      ).run(newConfidence, now, existing.id);
    } else {
      db.prepare(
        'INSERT INTO VendorMemory (vendor, pattern, field, value, confidence, lastUpdated) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(record.vendor, record.pattern, record.field, record.value, reinforce ? 0.6 : 0.3, now);
    }
  }

  static getAllForVendor(vendor: string): VendorMemoryRecord[] {
    return db.prepare('SELECT * FROM VendorMemory WHERE vendor = ?').all(vendor) as VendorMemoryRecord[];
  }
}
