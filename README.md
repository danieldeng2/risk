# Risk Odds Calculator

A Python script that calculates the probability of an attacker winning a battle in the board game [Risk](https://en.wikipedia.org/wiki/Risk_(game)).

## Overview

In Risk, battles are resolved by rolling dice — attackers roll up to 3 dice and defenders roll up to 2 dice, with losses assigned by comparing the highest rolls. This script computes the probability that an attacker will fully eliminate a defending army, given any number of attacking and defending troops.

It also prints a table showing how many **extra** attacking troops are needed to win at various confidence levels (50%, 60%, 70%, 80%, 90%).

## Usage

```bash
python risk.py
```

The script outputs a table like:

```
defenders: 1    50%: 1    60%: 2    70%: 2    80%: 3    90%: 4
defenders: 2    50%: 2    60%: 3    70%: 4    80%: 5    90%: 7
...
```

Each row shows, for a given number of defenders, how many **additional** troops (beyond matching the defenders 1:1) are needed to achieve the listed win probability.

## How It Works

- `calc_odds(max_attackers, max_defenders)` — builds a 2D table of win probabilities using known single-battle odds and a recurrence relation derived from multi-dice combat rules.
- `get_num_troops_for_percentiles(odds, percentile)` — for each defender count, finds the minimum attacker count needed to exceed a given win probability.
- `print_troops_for_percentiles(odds)` — prints the full table for the 50th–90th percentile thresholds.
