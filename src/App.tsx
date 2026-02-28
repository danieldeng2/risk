import { useMemo, useState } from "react";
import { buildTroopsTable } from "./riskOdds";
import ProbabilityLookup from "./components/ProbabilityLookup";
import TroopsNeeded from "./components/TroopsNeeded";
import AttackersNeeded from "./components/AttackersNeeded";

type Tab = "lookup" | "table" | "attackers";

const TAB_LABEL: Record<Tab, string> = {
  lookup: "Probability Calculator",
  table: "Lookup Table",
  attackers: "Min Attackers",
};

const theme = {
  bg: "#1a1a2e",
  surface: "#16213e",
  accent: "#e94560",
  text: "#eaeaea",
  muted: "#8892a4",
  border: "#2a2a4a",
};

export default function App() {
  const [tab, setTab] = useState<Tab>("attackers");
  const tableData = useMemo(() => buildTroopsTable(150), []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 4,
            color: theme.accent,
          }}
        >
          Risk Game Calculator
        </h1>
        <p style={{ color: theme.muted, fontSize: 14, marginBottom: 24 }}>
          Probability calculator for the board game Risk
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["attackers", "lookup", "table"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                background: tab === t ? theme.accent : theme.surface,
                color: tab === t ? "#fff" : theme.muted,
                transition: "background 0.15s",
              }}
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>

        {/* Active view */}
        <div
          style={{
            background: theme.surface,
            borderRadius: 10,
            padding: 24,
            border: `1px solid ${theme.border}`,
          }}
        >
          {tab === "lookup" ? (
            <ProbabilityLookup theme={theme} />
          ) : tab === "table" ? (
            <TroopsNeeded tableData={tableData} theme={theme} />
          ) : (
            <AttackersNeeded theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
}
