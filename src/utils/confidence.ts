// Confidence logic: reinforcement and decay helpers

export function reinforceConfidence(current: number, amount = 0.1, max = 1): number {
  return Math.min(current + amount, max);
}

export function decayConfidence(current: number, amount = 0.2, min = 0): number {
  return Math.max(current - amount, min);
}
