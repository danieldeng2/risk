import { useState } from "react";
import { findMinAttackers, lookupOdds } from "../riskOdds";
import ConfidenceSlider from "./ConfidenceSlider";

interface Props {
  theme: Record<string, string>;
}

const MAX_DEFENDERS = 3000;

function confidenceColor(pct: number): string {
  if (pct >= 70) return "#4caf50";
  if (pct >= 50) return "#ffc107";
  return "#f44336";
}

export default function AttackersNeeded({ theme }: Props) {
  const [defenderInput, setDefenderInput] = useState("10");
  const [confidence, setConfidence] = useState(60);

  function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  const defenders = clamp(Number(defenderInput) || 1, 1, MAX_DEFENDERS);

  const minAttackers = findMinAttackers(defenders, confidence / 100);
  const actualProb = lookupOdds(minAttackers, defenders);
  const actualPct = Math.round(actualProb * 1000) / 10;

  const inputStyle: React.CSSProperties = {
    background: "#1a1a2e",
    border: `1px solid ${theme.border}`,
    borderRadius: 6,
    color: theme.text,
    fontSize: 20,
    fontWeight: 700,
    padding: "8px 12px",
    width: 130,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13,
    color: theme.muted,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
        How many attackers do I need?
      </h2>

      {/* Inputs */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <label style={labelStyle}>
          Defenders (1–{MAX_DEFENDERS})
          <input
            type="number"
            min={1}
            max={MAX_DEFENDERS}
            value={defenderInput}
            onChange={(e) => setDefenderInput(e.target.value)}
            onBlur={() => setDefenderInput(String(defenders))}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          <span>
            Desired Win Probability —{" "}
            <span
              style={{ color: confidenceColor(confidence), fontWeight: 700 }}
            >
              {confidence}%
            </span>
          </span>
          <ConfidenceSlider value={confidence} onChange={setConfidence} />
        </label>
      </div>

      {/* Result */}
      <div
        style={{
          background: "#1a1a2e",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 8 }}>
          Minimum attackers needed
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: theme.text,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {minAttackers}
        </div>
        <div style={{ fontSize: 13, color: theme.muted }}>
          Actual win probability at this count:{" "}
          <span
            style={{
              fontWeight: 700,
              color: confidenceColor(actualPct),
            }}
          >
            {actualPct.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
