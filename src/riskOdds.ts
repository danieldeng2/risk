export interface TroopsRow {
  defenders: number;
  p50: number;
  p60: number;
  p70: number;
  p80: number;
  p90: number;
}

/**
 * Compute a 2D odds table using dynamic programming.
 * odds[defender][attacker] = P(attacker wins) when there are
 * `attacker` attacking troops and `defender` defending troops.
 *
 * Ported directly from risk.py calc_odds().
 */
export function calcOdds(maxAttackers = 60, maxDefenders = 40): Float64Array[] {
  const odds: Float64Array[] = Array.from(
    { length: maxDefenders },
    () => new Float64Array(maxAttackers),
  );

  // Base cases: hardcoded single-battle probabilities (1-3 vs 1-3)
  odds[1][1] = 0.4129;
  odds[1][2] = 0.7538;
  odds[1][3] = 0.9192;

  odds[2][1] = 0.1036;
  odds[2][2] = 0.3602;
  odds[2][3] = 0.6561;

  odds[3][1] = 0.0272;
  odds[3][2] = 0.2051;
  odds[3][3] = 0.4693;

  // Boundary: 0 defenders → attacker wins
  for (let a = 1; a < maxAttackers; a++) {
    odds[0][a] = 1;
  }
  // Boundary: 0 attackers → attacker loses (already 0 from Float64Array init)

  // Fill recurrences (same loop order as Python)
  for (let a = 1; a < maxAttackers; a++) {
    for (let d = 1; d < maxDefenders; d++) {
      if (a <= 3 && d <= 3) continue; // covered by base cases

      if (a === 2) {
        odds[d][a] =
          0.228 * odds[d - 2][a] +
          0.448 * odds[d][a - 2] +
          0.324 * odds[d - 1][a - 1];
        continue;
      }
      if (a === 1) {
        odds[d][a] = 0.255 * odds[d - 1][a] + 0.745 * odds[d][a - 1];
        continue;
      }
      if (d === 1) {
        odds[d][a] = 0.66 * odds[d - 1][a] + 0.34 * odds[d][a - 1];
        continue;
      }
      // General case: d >= 2, a >= 3
      odds[d][a] =
        0.372 * odds[d - 2][a] +
        0.292 * odds[d][a - 2] +
        0.336 * odds[d - 1][a - 1];
    }
  }

  return odds;
}

/**
 * Look up P(attacker wins) for exact troop counts.
 * Returns a value in [0, 1].
 */
export function lookupOdds(
  odds: Float64Array[],
  attackers: number,
  defenders: number,
): number {
  if (defenders <= 0) return 1;
  if (attackers <= 0) return 0;
  if (defenders >= odds.length || attackers >= odds[0].length) return NaN;
  return odds[defenders][attackers];
}

/**
 * For each defender count, return the minimum attacker count
 * needed to exceed `threshold` win probability.
 */
export function getAttackersForPercentile(
  odds: Float64Array[],
  threshold: number,
): number[] {
  return odds.map((row) => {
    const idx = row.findIndex((p) => p > threshold);
    return idx === -1 ? row.length : idx;
  });
}

/**
 * Build a table of "extra attackers needed" (attackers - defenders)
 * for 50/60/70/80/90% win probability thresholds.
 * Rows go from defenders=1 to defenders=maxDefenders-1.
 */
export function buildTroopsTable(odds: Float64Array[]): TroopsRow[] {
  const thresholds = [0.5, 0.6, 0.7, 0.8, 0.9];
  const columns = thresholds.map((t) => getAttackersForPercentile(odds, t));

  const rows: TroopsRow[] = [];
  for (let d = 1; d < odds.length; d++) {
    rows.push({
      defenders: d,
      p50: columns[0][d] - d,
      p60: columns[1][d] - d,
      p70: columns[2][d] - d,
      p80: columns[3][d] - d,
      p90: columns[4][d] - d,
    });
  }
  return rows;
}
