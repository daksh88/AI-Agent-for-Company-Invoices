import { VendorMemory } from './memory/VendorMemory';
import { CorrectionMemory } from './memory/CorrectionMemory';
import { ResolutionMemory } from './memory/ResolutionMemory';
function printMemoryVisualization() {
	console.log('\n--- Memory Visualization ---');
	console.log('Vendor Memory:');
	VendorMemory.getAllForVendor('Supplier GmbH').forEach(mem => {
		console.log(`  [${mem.vendor}] ${mem.pattern} → ${mem.field} | value: ${mem.value} | confidence: ${mem.confidence.toFixed(2)}`);
	});
	console.log('Correction Memory:');
	CorrectionMemory.getAll().forEach(mem => {
		console.log(`  ${mem.pattern} → ${mem.correction} | confidence: ${mem.confidence.toFixed(2)}`);
	});
	console.log('Resolution Memory:');
	ResolutionMemory.getAll().forEach(mem => {
		console.log(`  ${mem.pattern} → ${mem.resolution} | confidence: ${mem.confidence.toFixed(2)}`);
	});
	console.log('----------------------------\n');
}
//Demo runner for Invoice Memory Layer
import { DecisionEngine } from './decision/DecisionEngine';
import { Invoice } from './types/types';



//Process first invoice (no memory yet)
const invoice1: Invoice = {
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
const result1 = DecisionEngine.processInvoice(invoice1);
console.log(JSON.stringify(result1, null, 2));
printMemoryVisualization();

//Simulate human correction: map Leistungsdatum to serviceDate
console.log('Simulating human correction: map Leistungsdatum → serviceDate for Supplier GmbH');
VendorMemory.learn({
	vendor: 'Supplier GmbH',
	pattern: 'Leistungsdatum',
	field: 'serviceDate',
	value: '2025-12-01',
	confidence: 0.6
});
printMemoryVisualization();

//Process second invoice (should use learned memory)
const invoice2: Invoice = {
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
const result2 = DecisionEngine.processInvoice(invoice2);
console.log(JSON.stringify(result2, null, 2));
printMemoryVisualization();
