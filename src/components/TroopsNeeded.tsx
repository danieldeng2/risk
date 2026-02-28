import type { TroopsRow } from '../riskOdds'

interface Props {
  tableData: TroopsRow[]
  theme: Record<string, string>
}

function cellColor(extra: number): string {
  if (extra < 0) return 'rgba(76, 175, 80, 0.15)'
  if (extra <= 2) return 'rgba(255, 193, 7, 0.15)'
  return 'rgba(244, 67, 54, 0.15)'
}

function cellTextColor(extra: number): string {
  if (extra < 0) return '#4caf50'
  if (extra <= 2) return '#ffc107'
  return '#f44336'
}

function formatExtra(extra: number): string {
  if (extra >= 500) return '>499'
  return extra >= 0 ? `+${extra}` : `${extra}`
}

export default function TroopsNeeded({ tableData, theme }: Props) {
  const thStyle: React.CSSProperties = {
    padding: '10px 14px',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: theme.muted,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    background: '#16213e',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `1px solid ${theme.border}`,
  }

  const tdStyle: React.CSSProperties = {
    padding: '8px 14px',
    textAlign: 'center',
    fontSize: 14,
    borderBottom: `1px solid ${theme.border}`,
  }

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
        Troops Needed
      </h2>
      <p style={{ fontSize: 13, color: theme.muted, marginBottom: 20 }}>
        Minimum extra attackers needed beyond the defender count to win with
        the given confidence. +3 against 10 defenders = 13 attackers needed for that win rate.
        Green = fewer attackers than defenders required.
      </p>

      <div style={{ overflowY: 'auto', maxHeight: 520, borderRadius: 8, border: `1px solid ${theme.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left' }}>Defenders</th>
              <th style={thStyle}>50%</th>
              <th style={thStyle}>60%</th>
              <th style={thStyle}>70%</th>
              <th style={thStyle}>80%</th>
              <th style={thStyle}>90%</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.defenders}>
                <td style={{ ...tdStyle, textAlign: 'left', fontWeight: 600, color: theme.muted }}>
                  {row.defenders}
                </td>
                {([row.p50, row.p60, row.p70, row.p80, row.p90] as number[]).map((extra, i) => (
                  <td
                    key={i}
                    style={{
                      ...tdStyle,
                      background: cellColor(extra),
                      color: cellTextColor(extra),
                      fontWeight: 600,
                    }}
                  >
                    {formatExtra(extra)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
