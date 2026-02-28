import { useState } from "react";
import { lookupOdds } from "../riskOdds";
import OddsBar from "./OddsBar";

interface Props {
  theme: Record<string, string>;
}

const MAX_ATTACKERS = 3000;
const MAX_DEFENDERS = 3000;

export default function ProbabilityLookup({ theme }: Props) {
  const [attackers, setAttackers] = useState(10);
  const [defenders, setDefenders] = useState(5);

  const prob = lookupOdds(attackers, defenders);
  const pct = isNaN(prob) ? null : Math.round(prob * 1000) / 10;

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

  function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
        What are my odds?
      </h2>

      {/* Inputs */}
      <div
        style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 32 }}
      >
        <label style={labelStyle}>
          Attackers (1–{MAX_ATTACKERS})
          <input
            type="number"
            min={1}
            max={MAX_ATTACKERS}
            value={attackers}
            onChange={(e) =>
              setAttackers(clamp(Number(e.target.value), 1, MAX_ATTACKERS))
            }
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Defenders (1–{MAX_DEFENDERS})
          <input
            type="number"
            min={1}
            max={MAX_DEFENDERS}
            value={defenders}
            onChange={(e) =>
              setDefenders(clamp(Number(e.target.value), 1, MAX_DEFENDERS))
            }
            style={inputStyle}
          />
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
          Attacker win probability
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color:
              pct === null
                ? theme.muted
                : pct >= 70
                  ? "#4caf50"
                  : pct >= 50
                    ? "#ffc107"
                    : "#f44336",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          {pct === null ? "—" : `${pct.toFixed(1)}%`}
        </div>
        <OddsBar prob={prob ?? 0} />
      </div>
    </div>
  );
}
