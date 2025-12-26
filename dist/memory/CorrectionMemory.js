"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrectionMemory = void 0;
const db_1 = __importDefault(require("../db/db"));
class CorrectionMemory {
    static recall(pattern) {
        const row = db_1.default.prepare('SELECT * FROM CorrectionMemory WHERE pattern = ? ORDER BY confidence DESC LIMIT 1').get(pattern);
        return row;
    }
    static learn(record, reinforce = true) {
        const now = new Date().toISOString();
        // Check if exists
        const existing = db_1.default.prepare('SELECT * FROM CorrectionMemory WHERE pattern = ? AND correction = ?').get(record.pattern, record.correction);
        if (existing) {
            // Reinforce or decay confidence
            const newConfidence = reinforce
                ? Math.min((existing.confidence ?? 0) + 0.1, 1)
                : Math.max((existing.confidence ?? 0) - 0.2, 0);
            db_1.default.prepare('UPDATE CorrectionMemory SET confidence = ?, lastUpdated = ? WHERE id = ?').run(newConfidence, now, existing.id);
        }
        else {
            db_1.default.prepare('INSERT INTO CorrectionMemory (pattern, correction, confidence, lastUpdated) VALUES (?, ?, ?, ?)').run(record.pattern, record.correction, reinforce ? 0.6 : 0.3, now);
        }
    }
    static getAll() {
        return db_1.default.prepare('SELECT * FROM CorrectionMemory').all();
    }
}
exports.CorrectionMemory = CorrectionMemory;
