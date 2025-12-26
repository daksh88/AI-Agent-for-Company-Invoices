"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(__dirname, '../../data/memory.sqlite');
const db = new better_sqlite3_1.default(dbPath);
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
exports.default = db;
