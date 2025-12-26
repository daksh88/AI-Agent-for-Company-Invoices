# Invoice Memory Layer — Flowbit Assignment

Hello Team!

This project is my take on building a “memory-driven” AI agent for invoice automation. The goal? To make the system smarter with every correction, just like a real teammate would learn from feedback.

---

## What does it do?

- Remembers vendor-specific quirks (like “Leistungsdatum” means service date for Supplier GmbH)
- Learns from repeated corrections (e.g., always fix quantity mismatches this way)
- Tracks how issues were resolved (approved, rejected, etc.)
- Gets better over time — and explains every decision it makes

---

## How is it built?

- **TypeScript (strict mode)** for safety and clarity
- **Node.js** for runtime
- **SQLite** for persistent, auditable memory (no data lost between runs)

---

## Project Structure

- src/ — All the main code
  - memory/ — Vendor, Correction, and Resolution memory modules
  - decision/ — The brain: uses memory to make decisions
  - db/ — SQLite setup
  - types/ — TypeScript interfaces
  - utils/ — Helper logic (confidence, etc.)
- demo-runner.ts — The script that shows the system learning in real time
- data/ — (For future: sample invoices/corrections)

---

## How do I run the demo?

1. **Install dependencies:**
	
	npm install
	
2. **Build the code:**
	
	npm run build
	
3. **Run the demo:**
	
	npm start
	

You’ll see:
- The system process an invoice (with no memory yet)
- A simulated human correction (teaching the system)
- The system process a similar invoice again — this time, smarter!
- A live printout of what the system “remembers”

---

## 🤖 How does the learning work?

1. **First invoice:**
	- The system doesn’t know the vendor’s quirks yet, so it asks for review.
2. **Human correction:**
	- We “teach” it by mapping a field (e.g., “Leistungsdatum” → “serviceDate”).
3. **Second invoice:**
	- The system uses its new memory to auto-map fields, boost confidence, and reduce flags.

Every step is logged and auditable. You can see the memory grow in the terminal!

---

## Assignment Checklist

- Working code (TypeScript, Node.js, SQLite)
- Demo runner script (see `src/demo-runner.ts`)
- Memory persists across runs
- JSON output contract, audit trail, confidence
- Video demo (see submission email)

---

## Thanks for reviewing!

If you want to see more scenarios, just ask — the system is easy to extend. I hope you enjoy seeing it learn as much as I enjoyed building it!
