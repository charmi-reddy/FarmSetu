const MICROALGOS_IN_ALGO = 1_000_000;

export function algoToMicroAlgos(amountAlgo: number): number {
  if (!Number.isFinite(amountAlgo) || amountAlgo < 0) {
    throw new Error("Amount must be a valid non-negative number.");
  }
  return Math.round(amountAlgo * MICROALGOS_IN_ALGO);
}

export function microAlgosToAlgo(amountMicro: number): number {
  if (!Number.isFinite(amountMicro)) {
    return 0;
  }
  return amountMicro / MICROALGOS_IN_ALGO;
}

export function formatAlgo(amountAlgo: number, maxFractionDigits = 6): string {
  return amountAlgo.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
}

