

def calc_odds(max_attackers, max_defenders):
  odds = [[0 for _ in range(max_attackers)] for _ in range(max_defenders)]

  odds[1][1] = 0.4129
  odds[1][2] = 0.7538
  odds[1][3] = 0.9192

  odds[2][1] = 0.1036
  odds[2][2] = 0.3602
  odds[2][3] = 0.6561

  odds[3][1] = 0.0272
  odds[3][2] = 0.2051
  odds[3][3] = 0.4693

  for attacker in range(1, max_attackers):
    odds[0][attacker] = 1

  for defender in range(1, max_defenders):
    odds[defender][0] = 0

  for attacker in range(1, max_attackers):
    for defender in range(1, max_defenders):
      if attacker <= 3 and defender <= 3:
        continue
      
      if attacker == 2:
        odds[defender][attacker] = 0.228 * odds[defender - 2][attacker] + 0.448 * odds[defender][attacker - 2] + 0.324 * odds[defender - 1][attacker - 1]
        continue

      if attacker == 1:
        odds[defender][attacker] = 0.255 * odds[defender - 1][attacker] + 0.745 * odds[defender][attacker - 1]
        continue

      if defender == 1:
        odds[defender][attacker] = 0.66 * odds[defender - 1][attacker] + 0.34 * odds[defender][attacker - 1]
        continue

      odds[defender][attacker] = 0.372 * odds[defender - 2][attacker] + 0.292 * odds[defender][attacker - 2] + 0.336 * odds[defender - 1][attacker - 1]

  return odds

def get_num_troops_for_percentiles(odds: list[list[int]], percentile: int):
  num_troops = [0 for _ in odds]
  for defender, percentages in enumerate(odds):
    num_troops[defender] = next(attacker for (attacker, odd) in enumerate(percentages) if odd > percentile)
  return num_troops

def print_troops_for_percentiles(odds: list[list[int]]):
  fifty = get_num_troops_for_percentiles(odds=odds, percentile=0.5)
  sixty = get_num_troops_for_percentiles(odds=odds, percentile=0.6)
  seventy = get_num_troops_for_percentiles(odds=odds, percentile=0.7)
  eighty = get_num_troops_for_percentiles(odds=odds, percentile=0.8)
  ninety = get_num_troops_for_percentiles(odds=odds, percentile=0.9)

  for defenders in range(0, len(odds)):
    print(f"defenders: {defenders}\t50%: {fifty[defenders]-defenders}\t60%: {sixty[defenders]-defenders}\t70%: {seventy[defenders]-defenders}\t80%: {eighty[defenders]-defenders}\t90%: {ninety[defenders]-defenders}")
  
odds = calc_odds(max_attackers=60, max_defenders=40)
print_troops_for_percentiles(odds)
