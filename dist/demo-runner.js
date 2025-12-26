"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VendorMemory_1 = require("./memory/VendorMemory");
const CorrectionMemory_1 = require("./memory/CorrectionMemory");
const ResolutionMemory_1 = require("./memory/ResolutionMemory");
function printMemoryVisualization() {
    console.log('\n--- Memory Visualization ---');
    console.log('Vendor Memory:');
    VendorMemory_1.VendorMemory.getAllForVendor('Supplier GmbH').forEach(mem => {
        console.log(`  [${mem.vendor}] ${mem.pattern} → ${mem.field} | value: ${mem.value} | confidence: ${mem.confidence.toFixed(2)}`);
    });
    console.log('Correction Memory:');
    CorrectionMemory_1.CorrectionMemory.getAll().forEach(mem => {
        console.log(`  ${mem.pattern} → ${mem.correction} | confidence: ${mem.confidence.toFixed(2)}`);
    });
    console.log('Resolution Memory:');
    ResolutionMemory_1.ResolutionMemory.getAll().forEach(mem => {
        console.log(`  ${mem.pattern} → ${mem.resolution} | confidence: ${mem.confidence.toFixed(2)}`);
    });
    console.log('----------------------------\n');
}
// Demo runner for Invoice Memory Layer
const DecisionEngine_1 = require("./decision/DecisionEngine");
// 1. Process first invoice (no memory yet)
const invoice1 = {
    invoiceNumber: 'INV-A-001',
    vendor: 'Supplier GmbH',
    fields: {
        'Leistungsdatum': '2025-12-01',
        'amount': 1000,
        'currency': 'EUR'
    },
    rawText: 'Rechnung für Dienstleistungen. Leistungsdatum: 2025-12-01.'
};
console.log('Processing Invoice #1 (before learning)...');
const result1 = DecisionEngine_1.DecisionEngine.processInvoice(invoice1);
console.log(JSON.stringify(result1, null, 2));
printMemoryVisualization();
// 2. Simulate human correction: map Leistungsdatum to serviceDate
console.log('Simulating human correction: map Leistungsdatum → serviceDate for Supplier GmbH');
VendorMemory_1.VendorMemory.learn({
    vendor: 'Supplier GmbH',
    pattern: 'Leistungsdatum',
    field: 'serviceDate',
    value: '2025-12-01',
    confidence: 0.6
});
printMemoryVisualization();
// 3. Process second invoice (should use learned memory)
const invoice2 = {
    invoiceNumber: 'INV-A-002',
    vendor: 'Supplier GmbH',
    fields: {
        'Leistungsdatum': '2025-12-15',
        'amount': 1200,
        'currency': 'EUR'
    },
    rawText: 'Rechnung für Dienstleistungen. Leistungsdatum: 2025-12-15.'
};
console.log('Processing Invoice #2 (after learning)...');
const result2 = DecisionEngine_1.DecisionEngine.processInvoice(invoice2);
console.log(JSON.stringify(result2, null, 2));
printMemoryVisualization();
