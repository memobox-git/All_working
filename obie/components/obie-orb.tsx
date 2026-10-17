"use client";

import { useId } from "react";

export type ObieState = "idle" | "working" | "listening";

const stateLabel: Record<ObieState, string> = {
  idle: "OBIE",
  working: "OBIE is working",
  listening: "OBIE is listening",
};

// OBIE's avatar: a glossy blue orb with a friendly face and a yellow star.
// The star is the status light: steady when idle, sparkling while working.
// While listening, the orb pulses.
export function ObieOrb({
  size = 48,
  state = "idle",
  float = false,
  className = "",
}: {
  size?: number;
  state?: ObieState;
  float?: boolean;
  className?: string;
}) {
  // Unique ids so several orbs on one page don't share gradients.
  const id = useId().replace(/:/g, "");
  const body = `obie-body-${id}`;
  const gloss = `obie-gloss-${id}`;
  const shade = `obie-shade-${id}`;

  return (
    <svg
      viewBox="0 0 120 132"
      width={size}
      height={(size * 132) / 120}
      role="img"
      aria-label={stateLabel[state]}
      data-state={state}
      className={`obie-orb ${float ? "obie-float" : ""} ${className}`}
    >
      <defs>
        <radialGradient id={body} cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#a9ccff" />
          <stop offset="32%" stopColor="#4a83ff" />
          <stop offset="72%" stopColor="#1f55e6" />
          <stop offset="100%" stopColor="#123190" />
        </radialGradient>
        <linearGradient id={gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={shade} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a0f1e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0a0f1e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft shadow under the orb */}
      <ellipse cx="60" cy="126" rx="34" ry="5" fill={`url(#${shade})`} />

      {/* Listening ripple */}
      <circle
        className="obie-ripple"
        cx="60"
        cy="76"
        r="44"
        fill="none"
        stroke="#4a83ff"
        strokeWidth="3"
      />

      <g className="obie-body">
        <circle cx="60" cy="76" r="44" fill={`url(#${body})`} />
        {/* Gloss */}
        <ellipse
          cx="45"
          cy="51"
          rx="22"
          ry="12"
          transform="rotate(-24 45 51)"
          fill={`url(#${gloss})`}
        />
        <circle cx="31" cy="66" r="2.6" fill="#ffffff" opacity="0.7" />

        {/* Face */}
        <ellipse cx="37" cy="88" rx="6" ry="3.5" fill="#9ec2ff" opacity="0.45" />
        <ellipse cx="83" cy="88" rx="6" ry="3.5" fill="#9ec2ff" opacity="0.45" />
        <ellipse cx="46" cy="73" rx="5.5" ry="7.5" fill="#0a1640" />
        <ellipse cx="74" cy="73" rx="5.5" ry="7.5" fill="#0a1640" />
        <circle cx="48" cy="70" r="1.9" fill="#ffffff" />
        <circle cx="76" cy="70" r="1.9" fill="#ffffff" />
        <path
          d="M48 89 Q60 99 72 89"
          fill="none"
          stroke="#0a1640"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* Sparkles around the star, visible while working */}
      <g fill="#ffd60a">
        <circle className="obie-spark" cx="46" cy="9" r="1.8" />
        <circle className="obie-spark" cx="74" cy="7" r="1.6" />
        <circle className="obie-spark" cx="73" cy="22" r="1.4" />
        <circle className="obie-spark" cx="47" cy="23" r="1.6" />
      </g>

      {/* The status star */}
      <polygon
        className="obie-star"
        points="60,5 62.29,10.84 68.56,11.22 63.71,15.21 65.29,21.28 60,17.9 54.71,21.28 56.29,15.21 51.44,11.22 57.71,10.84"
        fill="#ffd60a"
        stroke="#ffd60a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
