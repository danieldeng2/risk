# Risk Odds Calculator

A web app that calculates the probability of an attacker winning a battle in the board game [Risk](https://en.wikipedia.org/wiki/Risk_(game)).

## Usage

Two views are available via the tabs at the top:

**Probability Lookup** — Enter attacker and defender troop counts to instantly see the attacker's win probability, colour-coded green (≥70%), yellow (50–70%), or red (<50%).

**Troops Needed** — A table showing how many extra attackers (beyond matching the defenders 1:1) are required to reach 50/60/70/80/90% win probability for each defender count up to 150.

## Build

```bash
npm install
npm run build   # outputs to dist/
npm run dev     # local dev server
```

Deployed automatically to GitHub Pages on every push to `main`.

## How It Works

In Risk, battles resolve by comparing dice rolls — attackers roll up to 3 dice, defenders up to 2. This produces known per-round loss probabilities, which are used as base cases for a dynamic programming recurrence over total troop counts.

The core function `computeAttackerWinRates(attackers, prev, prev2)` computes the win probability for every defender count in a single pass, using only the two previously computed attacker columns. This rolling 3-buffer approach keeps memory at O(defenders) regardless of attacker count.
