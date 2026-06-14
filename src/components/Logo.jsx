import { useId } from 'react'

// Sinusoidal wave paths — 4 lines across 36px, amplitude 2, period 8
// Each half-period alternates up/down using cubic bezier approximation
// 5 lines from y=8 to y=29 (same span as original 4), amplitude 1.5
const WAVES = [
  "M 0 8 C 1.4 6.5, 2.6 6.5, 4 8 C 5.4 9.5, 6.6 9.5, 8 8 C 9.4 6.5, 10.6 6.5, 12 8 C 13.4 9.5, 14.6 9.5, 16 8 C 17.4 6.5, 18.6 6.5, 20 8 C 21.4 9.5, 22.6 9.5, 24 8 C 25.4 6.5, 26.6 6.5, 28 8 C 29.4 9.5, 30.6 9.5, 32 8 C 33.4 6.5, 34.6 6.5, 36 8",
  "M 0 13.25 C 1.4 11.75, 2.6 11.75, 4 13.25 C 5.4 14.75, 6.6 14.75, 8 13.25 C 9.4 11.75, 10.6 11.75, 12 13.25 C 13.4 14.75, 14.6 14.75, 16 13.25 C 17.4 11.75, 18.6 11.75, 20 13.25 C 21.4 14.75, 22.6 14.75, 24 13.25 C 25.4 11.75, 26.6 11.75, 28 13.25 C 29.4 14.75, 30.6 14.75, 32 13.25 C 33.4 11.75, 34.6 11.75, 36 13.25",
  "M 0 18.5 C 1.4 17, 2.6 17, 4 18.5 C 5.4 20, 6.6 20, 8 18.5 C 9.4 17, 10.6 17, 12 18.5 C 13.4 20, 14.6 20, 16 18.5 C 17.4 17, 18.6 17, 20 18.5 C 21.4 20, 22.6 20, 24 18.5 C 25.4 17, 26.6 17, 28 18.5 C 29.4 20, 30.6 20, 32 18.5 C 33.4 17, 34.6 17, 36 18.5",
  "M 0 23.75 C 1.4 22.25, 2.6 22.25, 4 23.75 C 5.4 25.25, 6.6 25.25, 8 23.75 C 9.4 22.25, 10.6 22.25, 12 23.75 C 13.4 25.25, 14.6 25.25, 16 23.75 C 17.4 22.25, 18.6 22.25, 20 23.75 C 21.4 25.25, 22.6 25.25, 24 23.75 C 25.4 22.25, 26.6 22.25, 28 23.75 C 29.4 25.25, 30.6 25.25, 32 23.75 C 33.4 22.25, 34.6 22.25, 36 23.75",
  "M 0 29 C 1.4 27.5, 2.6 27.5, 4 29 C 5.4 30.5, 6.6 30.5, 8 29 C 9.4 27.5, 10.6 27.5, 12 29 C 13.4 30.5, 14.6 30.5, 16 29 C 17.4 27.5, 18.6 27.5, 20 29 C 21.4 30.5, 22.6 30.5, 24 29 C 25.4 27.5, 26.6 27.5, 28 29 C 29.4 30.5, 30.6 30.5, 32 29 C 33.4 27.5, 34.6 27.5, 36 29",
]

export function Logo({ size = 28 }) {
  const id = useId()
  const clipId = `${id}-c`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="36" height="36" rx="8" />
        </clipPath>
      </defs>

      {/* Paper background */}
      <rect width="36" height="36" rx="8" fill="#e7e1d3" />

      {/* Postmark wavy cancellation lines */}
      <g clipPath={`url(#${clipId})`} stroke="#211d16" strokeWidth="1.1" opacity="0.42">
        {WAVES.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* Bold S — on top of lines */}
      <text
        x="18"
        y="18"
        fontFamily="'Archivo', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize="26"
        fill="var(--accent)"
        stroke="#e7e1d3"
        strokeWidth="4"
        paintOrder="stroke fill"
        textAnchor="middle"
        dominantBaseline="central"
      >S</text>
    </svg>
  )
}
