import { useRef } from "react";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const TRACK_HEIGHT = 10;
const THUMB_SIZE = 32;

export function fillColor(value: number): string {
  if (value >= 70) return "#4caf50";
  if (value >= 50) return "#ffc107";
  return "#f44336";
}

export default function ConfidenceSlider({
  value,
  min = 1,
  max = 99,
  onChange,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  function valueAt(clientX: number): number {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (max - min) + min);
  }

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    onChange(valueAt(e.clientX));
    const move = (ev: MouseEvent) => onChange(valueAt(ev.clientX));
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }

  function handleTouchStart(e: React.TouchEvent) {
    onChange(valueAt(e.touches[0].clientX));
    const move = (ev: TouchEvent) => onChange(valueAt(ev.touches[0].clientX));
    const end = () => {
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    };
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", end);
  }

  return (
    <div
      ref={trackRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: "relative",
        width: "100%",
        height: THUMB_SIZE,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Track */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: "100%",
          height: TRACK_HEIGHT,
          background: "#2a2a4a",
          borderRadius: TRACK_HEIGHT / 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: fillColor(value),
            transition: "background 0.2s ease",
          }}
        />
      </div>

      {/* Thumb */}
      <div
        style={{
          position: "absolute",
          left: `${pct}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: "50%",
          background: fillColor(value),
          border: "2px solid #16213e",
          transition: "background 0.2s ease",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
