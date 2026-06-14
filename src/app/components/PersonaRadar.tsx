import React from 'react';
import { motion } from 'motion/react';

export interface RadarDatum {
  label: string;
  value: number; // 0–100
}

interface PersonaRadarProps {
  data: RadarDatum[];
  size?: number;
}

const clamp = (v: number) => Math.max(0, Math.min(100, Number.isFinite(v) ? v : 0));

/** Lightweight, dependency-free SVG radar chart for the 9 persona dimensions. */
export const PersonaRadar: React.FC<PersonaRadarProps> = ({ data, size = 300 }) => {
  const n = data.length;
  if (n < 3) return null;

  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.34;
  const labelR = R + 22;
  const step = (Math.PI * 2) / n;
  const angle = (i: number) => -Math.PI / 2 + i * step;
  const pt = (i: number, r: number): [number, number] => [
    cx + r * Math.cos(angle(i)),
    cy + r * Math.sin(angle(i)),
  ];

  const dataPts = data.map((d, i) => pt(i, (R * clamp(d.value)) / 100));
  const polygon = dataPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      className="mx-auto max-w-[300px]"
      role="img"
      aria-label="Persona radar"
      data-testid="persona-radar"
    >
      <defs>
        <linearGradient id="persona-radar-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>

      {/* grid */}
      <g fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1}>
        {rings.map((f, k) => (
          <circle key={k} cx={cx} cy={cy} r={R * f} />
        ))}
        {data.map((_, i) => {
          const [x, y] = pt(i, R);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} />;
        })}
      </g>

      {/* data shape */}
      <motion.polygon
        points={polygon}
        fill="url(#persona-radar-fill)"
        fillOpacity={0.45}
        stroke="url(#persona-radar-fill)"
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* vertices */}
      <g fill="#f0abfc">
        {dataPts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.5} />
        ))}
      </g>

      {/* labels */}
      <g fontFamily="Inter, sans-serif">
        {data.map((d, i) => {
          const [lx, ly] = pt(i, labelR);
          return (
            <g key={i}>
              <text x={lx} y={ly} fill="#e4e4e7" fontSize={13} textAnchor="middle" dominantBaseline="middle">
                {d.label}
              </text>
              <text x={lx} y={ly + 13} fill="#c4b5fd" fontSize={10} textAnchor="middle" dominantBaseline="middle">
                {Math.round(clamp(d.value))}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
