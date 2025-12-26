"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionEngine = void 0;
const VendorMemory_1 = require("../memory/VendorMemory");
const CorrectionMemory_1 = require("../memory/CorrectionMemory");
const ResolutionMemory_1 = require("../memory/ResolutionMemory");
class DecisionEngine {
    static processInvoice(invoice) {
        const auditTrail = [];
        const memoryUpdates = [];
        let confidenceScore = 0.5;
        let requiresHumanReview = true;
        let proposedCorrections = [];
        let reasoning = '';
        let normalizedInvoice = { ...invoice.fields };
        // 1. Recall vendor memory
        auditTrail.push({ step: 'recall', timestamp: new Date().toISOString(), details: 'Recalling vendor memory.' });
        const vendorMemories = VendorMemory_1.VendorMemory.getAllForVendor(invoice.vendor);
        vendorMemories.forEach(mem => {
            if (normalizedInvoice[mem.pattern] && !normalizedInvoice[mem.field]) {
                normalizedInvoice[mem.field] = normalizedInvoice[mem.pattern];
                proposedCorrections.push(`Mapped ${mem.pattern} to ${mem.field}`);
                confidenceScore += mem.confidence * 0.2;
                memoryUpdates.push(`VendorMemory applied: ${mem.pattern}→${mem.field}`);
                auditTrail.push({ step: 'apply', timestamp: new Date().toISOString(), details: `Applied vendor memory: ${mem.pattern}→${mem.field}` });
            }
        });
        // 2. Recall correction memory
        auditTrail.push({ step: 'recall', timestamp: new Date().toISOString(), details: 'Recalling correction memory.' });
        Object.entries(normalizedInvoice).forEach(([field, value]) => {
            const corr = CorrectionMemory_1.CorrectionMemory.recall(`${invoice.vendor}:${field}:${value}`);
            if (corr && corr.confidence > 0.5) {
                proposedCorrections.push(`Suggest correction for ${field}: ${corr.correction}`);
                confidenceScore += corr.confidence * 0.1;
                memoryUpdates.push(`CorrectionMemory applied: ${field}`);
                auditTrail.push({ step: 'apply', timestamp: new Date().toISOString(), details: `Applied correction memory: ${field}` });
            }
        });
        // 3. Recall resolution memory
        auditTrail.push({ step: 'recall', timestamp: new Date().toISOString(), details: 'Recalling resolution memory.' });
        const resMem = ResolutionMemory_1.ResolutionMemory.recall(invoice.vendor + ':' + invoice.invoiceNumber);
        if (resMem && resMem.confidence > 0.7) {
            if (resMem.resolution === 'approved') {
                requiresHumanReview = false;
                confidenceScore += 0.2;
                memoryUpdates.push('ResolutionMemory: auto-approve');
                auditTrail.push({ step: 'decide', timestamp: new Date().toISOString(), details: 'Auto-approved based on resolution memory.' });
            }
            else if (resMem.resolution === 'rejected') {
                requiresHumanReview = true;
                confidenceScore -= 0.2;
                memoryUpdates.push('ResolutionMemory: escalate');
                auditTrail.push({ step: 'decide', timestamp: new Date().toISOString(), details: 'Escalated based on resolution memory.' });
            }
        }
        // 4. Decide and reason
        if (confidenceScore > 0.8) {
            reasoning = 'High confidence due to strong memory matches.';
        }
        else if (confidenceScore > 0.6) {
            reasoning = 'Moderate confidence, some memory applied.';
        }
        else {
            reasoning = 'Low confidence, requires human review.';
        }
        auditTrail.push({ step: 'decide', timestamp: new Date().toISOString(), details: reasoning });
        // Clamp confidence
        confidenceScore = Math.max(0, Math.min(1, confidenceScore));
        return {
            normalizedInvoice,
            proposedCorrections,
            requiresHumanReview,
            reasoning,
            confidenceScore,
            memoryUpdates,
            auditTrail
        };
    }
}
exports.DecisionEngine = DecisionEngine;
