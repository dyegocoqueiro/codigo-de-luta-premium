import { useMemo } from "react";

export interface RadarAxis {
  key: string;
  label: string;
  value: number;
  max?: number;
  color?: string;
}

interface RadarChartProps {
  axes: RadarAxis[];
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  animated?: boolean;
}

type TextAnchor = "start" | "middle" | "end";

function polarToCartesian(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export default function RadarChart({
  axes,
  size = 280,
  fillColor = "rgba(213,15,50,0.25)",
  strokeColor = "#d50f32",
  animated = true,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const n = axes.length;
  const levels = 5;

  const gridPolygons = useMemo(() => {
    return Array.from({ length: levels }, (_, i) => {
      const r = (maxRadius * (i + 1)) / levels;
      const pts = Array.from({ length: n }, (_, j) => {
        const angle = (360 / n) * j;
        const p = polarToCartesian(angle, r, cx, cy);
        return `${p.x},${p.y}`;
      });
      return pts.join(" ");
    });
  }, [n, maxRadius, cx, cy]);

  const axisLines = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const angle = (360 / n) * i;
      const p = polarToCartesian(angle, maxRadius, cx, cy);
      return { x2: p.x, y2: p.y, angle };
    });
  }, [n, maxRadius, cx, cy]);

  const labelPositions = useMemo(() => {
    return axes.map((axis, i) => {
      const angle = (360 / n) * i;
      const labelR = maxRadius + 28;
      const p = polarToCartesian(angle, labelR, cx, cy);
      const anchor: TextAnchor = p.x < cx - 5 ? "end" : p.x > cx + 5 ? "start" : "middle";
      return { ...p, anchor, label: axis.label, value: axis.value };
    });
  }, [axes, n, maxRadius, cx, cy]);

  const dataPolygon = useMemo(() => {
    return axes.map((axis, i) => {
      const angle = (360 / n) * i;
      const r = (axis.value / (axis.max ?? 10)) * maxRadius;
      const p = polarToCartesian(angle, r, cx, cy);
      return `${p.x},${p.y}`;
    }).join(" ");
  }, [axes, n, maxRadius, cx, cy]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      {gridPolygons.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
      ))}

      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={line.x2}
          y2={line.y2}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}

      <polygon
        points={dataPolygon}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinejoin="round"
        style={animated ? { filter: `drop-shadow(0 0 8px ${strokeColor}80)` } : undefined}
      />

      {axes.map((axis, i) => {
        const angle = (360 / n) * i;
        const r = (axis.value / (axis.max ?? 10)) * maxRadius;
        const p = polarToCartesian(angle, r, cx, cy);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={strokeColor}
            stroke="#07080b"
            strokeWidth={2}
          />
        );
      })}

      {labelPositions.map((lp, i) => (
        <g key={i}>
          <text
            x={lp.x}
            y={lp.y - 6}
            textAnchor={lp.anchor}
            fill="#aab5c4"
            fontSize="11"
            fontFamily="Inter, sans-serif"
          >
            {lp.label}
          </text>
          <text
            x={lp.x}
            y={lp.y + 8}
            textAnchor={lp.anchor}
            fill={strokeColor}
            fontSize="11"
            fontFamily="Inter, sans-serif"
            fontWeight="bold"
          >
            {lp.value}/10
          </text>
        </g>
      ))}
    </svg>
  );
}
