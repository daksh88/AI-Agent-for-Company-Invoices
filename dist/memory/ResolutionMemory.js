"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolutionMemory = void 0;
const db_1 = __importDefault(require("../db/db"));
class ResolutionMemory {
    static recall(pattern) {
        const row = db_1.default.prepare('SELECT * FROM ResolutionMemory WHERE pattern = ? ORDER BY confidence DESC LIMIT 1').get(pattern);
        return row;
    }
    static learn(record, reinforce = true) {
        const now = new Date().toISOString();
        // Check if exists
        const existing = db_1.default.prepare('SELECT * FROM ResolutionMemory WHERE pattern = ? AND resolution = ?').get(record.pattern, record.resolution);
        if (existing) {
            // Reinforce or decay confidence
            const newConfidence = reinforce
                ? Math.min((existing.confidence ?? 0) + 0.1, 1)
                : Math.max((existing.confidence ?? 0) - 0.2, 0);
            db_1.default.prepare('UPDATE ResolutionMemory SET confidence = ?, lastUpdated = ? WHERE id = ?').run(newConfidence, now, existing.id);
        }
        else {
            db_1.default.prepare('INSERT INTO ResolutionMemory (pattern, resolution, confidence, lastUpdated) VALUES (?, ?, ?, ?)').run(record.pattern, record.resolution, reinforce ? 0.6 : 0.3, now);
        }
    }
    static getAll() {
        return db_1.default.prepare('SELECT * FROM ResolutionMemory').all();
    }
}
exports.ResolutionMemory = ResolutionMemory;
