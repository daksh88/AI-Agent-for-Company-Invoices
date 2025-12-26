import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../data/memory.sqlite');
const db = new Database(dbPath);

// Initialize tables if not exist
// VendorMemory, CorrectionMemory, ResolutionMemory, AuditTrail

db.exec(`
CREATE TABLE IF NOT EXISTS VendorMemory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor TEXT,
  pattern TEXT,
  field TEXT,
  value TEXT,
  confidence REAL,
  lastUpdated TEXT
);
CREATE TABLE IF NOT EXISTS CorrectionMemory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pattern TEXT,
  correction TEXT,
  confidence REAL,
  lastUpdated TEXT
);
CREATE TABLE IF NOT EXISTS ResolutionMemory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pattern TEXT,
  resolution TEXT,
  confidence REAL,
  lastUpdated TEXT
);
CREATE TABLE IF NOT EXISTS AuditTrail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  step TEXT,
  timestamp TEXT,
  details TEXT
);
`);

export default db;
