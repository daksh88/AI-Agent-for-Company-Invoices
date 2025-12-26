"use strict";
// Confidence logic: reinforcement and decay helpers
Object.defineProperty(exports, "__esModule", { value: true });
exports.reinforceConfidence = reinforceConfidence;
exports.decayConfidence = decayConfidence;
function reinforceConfidence(current, amount = 0.1, max = 1) {
    return Math.min(current + amount, max);
}
function decayConfidence(current, amount = 0.2, min = 0) {
    return Math.max(current - amount, min);
}
