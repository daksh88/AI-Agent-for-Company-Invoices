"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorMemory = void 0;
const db_1 = __importDefault(require("../db/db"));
class VendorMemory {
    static recall(vendor, pattern, field) {
        const row = db_1.default.prepare('SELECT * FROM VendorMemory WHERE vendor = ? AND pattern = ? AND field = ? ORDER BY confidence DESC LIMIT 1').get(vendor, pattern, field);
        return row;
    }
    static learn(record, reinforce = true) {
        const now = new Date().toISOString();
        // Check if exists
        const existing = db_1.default.prepare('SELECT * FROM VendorMemory WHERE vendor = ? AND pattern = ? AND field = ? AND value = ?').get(record.vendor, record.pattern, record.field, record.value);
        if (existing) {
            // Reinforce or decay confidence
            const newConfidence = reinforce
                ? Math.min((existing.confidence ?? 0) + 0.1, 1)
                : Math.max((existing.confidence ?? 0) - 0.2, 0);
            db_1.default.prepare('UPDATE VendorMemory SET confidence = ?, lastUpdated = ? WHERE id = ?').run(newConfidence, now, existing.id);
        }
        else {
            db_1.default.prepare('INSERT INTO VendorMemory (vendor, pattern, field, value, confidence, lastUpdated) VALUES (?, ?, ?, ?, ?, ?)').run(record.vendor, record.pattern, record.field, record.value, reinforce ? 0.6 : 0.3, now);
        }
    }
    static getAllForVendor(vendor) {
        return db_1.default.prepare('SELECT * FROM VendorMemory WHERE vendor = ?').all(vendor);
    }
}
exports.VendorMemory = VendorMemory;
