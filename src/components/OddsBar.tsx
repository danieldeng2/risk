interface OddsBarProps {
  prob: number
}

export default function OddsBar({ prob }: OddsBarProps) {
  const color =
    prob >= 0.7 ? '#4caf50' :
    prob >= 0.5 ? '#ffc107' :
    '#f44336'

  return (
    <div
      style={{
        width: '100%',
        height: 16,
        background: '#2a2a4a',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${Math.min(prob * 100, 100)}%`,
          height: '100%',
          background: color,
          borderRadius: 8,
          transition: 'width 0.2s ease, background 0.2s ease',
        }}
      />
    </div>
  )
}
