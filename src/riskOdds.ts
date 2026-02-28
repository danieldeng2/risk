export interface TroopsRow {
  defenders: number;
  p50: number;
  p60: number;
  p70: number;
  p80: number;
  p90: number;
}

// Exact win probabilities for small battles (≤3 attackers vs ≤3 defenders).
const BASE: Record<number, Record<number, number>> = {
  1: { 1: 0.4129, 2: 0.1036, 3: 0.0272 },
  2: { 1: 0.7538, 2: 0.3602, 3: 0.2051 },
  3: { 1: 0.9192, 2: 0.6561, 3: 0.4693 },
};

/** Win probability for each defender count [0..maxDefenders-1], given exactly `attackers` troops.
 *  Reads the two preceding attacker counts from `prev` and `prev2`. */
function computeAttackerWinRates(
  attackers: number,
  prev: Float64Array<ArrayBuffer>,
  prev2: Float64Array<ArrayBuffer>,
  maxDefenders: number,
): Float64Array<ArrayBuffer> {
  const rates = new Float64Array(maxDefenders);

  // No defenders left — attacker wins
  rates[0] = 1;

  // Small battles (≤3 vs ≤3): use exact lookup table
  if (attackers <= 3) {
    for (
      let defCount = 1;
      defCount <= 3 && defCount < maxDefenders;
      defCount++
    ) {
      rates[defCount] = BASE[attackers][defCount];
    }
  }

  for (let defCount = 1; defCount < maxDefenders; defCount++) {
    if (attackers <= 3 && defCount <= 3) continue; // already set from lookup table

    // Solo attacker
    // 55/6³  : loosing 1 defender (25.46%)
    // 161/6³ : loosing 1 attacker (attacker looses, 74.54%)
    if (attackers === 1) {
      rates[defCount] = (55 / 216) * rates[defCount - 1];
      continue;
    }

    // Two attacker
    // 295/6⁴  : loosing 2 defender (22.76%)
    // 420/6⁴ : loosing 1 attacker, 1 defender (32.41%)
    // 581/6⁴ : loosing 2 attacker (attacker looses, 44.83%)
    if (attackers === 2) {
      rates[defCount] =
        (295 / 1296) * (defCount >= 2 ? rates[defCount - 2] : 0) +
        (420 / 1296) * prev[defCount - 1];
      continue;
    }

    // One defender left:
    // 855/6⁴ : loosing 1 defender (attacker wins, 65.97%)
    // 441/6⁴ : loosing 1 attacker (34.03%)
    if (defCount === 1) {
      rates[1] = 855 / 1296 + (441 / 1296) * prev[1];
      continue;
    }

    // Full engagement
    // 2890/6⁵ : 2 defenders lost (37.17%)
    // 2611/6⁵ : 1 each lost (33.58%)
    // 2275/6⁵ : 2 attackers lost (29.26%)
    rates[defCount] =
      (2890 / 7776) * rates[defCount - 2] +
      (2611 / 7776) * prev[defCount - 1] +
      (2275 / 7776) * prev2[defCount];
  }

  return rates;
}

/**
 * Look up P(attacker wins) for exact troop counts.
 * Computes only the columns needed, using O(defenders) memory.
 */
export function lookupOdds(attackers: number, defenders: number): number {
  if (defenders <= 0) return 1;
  if (attackers <= 0) return 0;

  const size = defenders + 1;
  let prev2: Float64Array<ArrayBuffer> = new Float64Array(size); // attacker count - 2 (all zeros = 0 attackers → loss)
  let prev: Float64Array<ArrayBuffer> = new Float64Array(size); // attacker count - 1 (starts as a=0, all zeros)
  // rates[0] = 1 handled inside computeAttackerWinRates

  for (let attackerCount = 1; attackerCount <= attackers; attackerCount++) {
    const rates = computeAttackerWinRates(attackerCount, prev, prev2, size);
    prev2 = prev;
    prev = rates;
  }

  return prev[defenders];
}

/**
 * Build a table of "extra attackers needed" (attackers - defenders) for
 * 50/60/70/80/90% win probability thresholds, for each defender count 1..maxDefenders.
 *
 * Uses a rolling window: O(maxDefenders) memory regardless of how many attacker
 * columns are computed.
 */
export function buildTroopsTable(
  maxDefenders: number,
  maxAttackers = 500,
): TroopsRow[] {
  const thresholds = [0.5, 0.6, 0.7, 0.8, 0.9];
  const numThresholds = thresholds.length;

  // found[defCount][i] = first attacker count that exceeded the threshold, or -1 if not yet
  const found: number[][] = Array.from({ length: maxDefenders + 1 }, () =>
    new Array<number>(numThresholds).fill(-1),
  );

  let prev2: Float64Array<ArrayBuffer> = new Float64Array(maxDefenders + 1);
  let prev: Float64Array<ArrayBuffer> = new Float64Array(maxDefenders + 1);
  let allFound = false;

  for (
    let attackerCount = 1;
    attackerCount <= maxAttackers && !allFound;
    attackerCount++
  ) {
    const rates = computeAttackerWinRates(
      attackerCount,
      prev,
      prev2,
      maxDefenders + 1,
    );

    // Check newly-exceeded thresholds for each defender count
    allFound = true;
    for (let defCount = 1; defCount <= maxDefenders; defCount++) {
      for (let i = 0; i < numThresholds; i++) {
        if (found[defCount][i] === -1 && rates[defCount] > thresholds[i]) {
          found[defCount][i] = attackerCount;
        }
        if (found[defCount][i] === -1) allFound = false;
      }
    }

    prev2 = prev;
    prev = rates;
  }

  return Array.from({ length: maxDefenders }, (_, idx) => {
    const defCount = idx + 1;
    return {
      defenders: defCount,
      p50:
        found[defCount][0] === -1
          ? maxAttackers
          : found[defCount][0] - defCount,
      p60:
        found[defCount][1] === -1
          ? maxAttackers
          : found[defCount][1] - defCount,
      p70:
        found[defCount][2] === -1
          ? maxAttackers
          : found[defCount][2] - defCount,
      p80:
        found[defCount][3] === -1
          ? maxAttackers
          : found[defCount][3] - defCount,
      p90:
        found[defCount][4] === -1
          ? maxAttackers
          : found[defCount][4] - defCount,
    };
  });
}
