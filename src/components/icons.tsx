import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function IconCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <title>Check</title>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <title>Alert</title>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="16"
        x2="12.01"
        y2="16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <title>Chevron Right</title>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconXCircle(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <title>X Circle</title>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line
        x1="15"
        y1="9"
        x2="9"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="9"
        x2="15"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconExtension(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>Scalar OpenAPI Extension</title>
      <path
        fill="url(#a)"
        d="M9.365 0c.162 0 .324.135.324.325V3.94l2.535-2.563c.135-.135.35-.135.458 0l1.942 1.942c.108.108.135.324 0 .432v.027l-2.562 2.536h3.614c.188 0 .324.134.324.324v2.725a.313.313 0 0 1-.324.324h-3.614l2.562 2.536c.108.134.135.35 0 .458l-1.942 1.943c-.107.108-.323.134-.431 0h-.027L9.689 12.06v3.615a.31.31 0 0 1-.324.324H6.641a.313.313 0 0 1-.324-.324v-1.889c0-.593.243-1.16.647-1.592l3.506-3.507a.977.977 0 0 0 0-1.376l-3.48-3.48a2.27 2.27 0 0 1-.674-1.592V.324c0-.189.135-.324.324-.324z"
      ></path>
      <path
        fill="url(#b)"
        d="M3.755 1.403h-.027a.28.28 0 0 0-.215-.101.28.28 0 0 0-.216.1L1.382 3.319a.365.365 0 0 0 0 .46L4.489 7.43a.977.977 0 0 1 0 1.376l-3.108 3.47c-.135.135-.108.324 0 .459l1.915 1.888c.135.135.35.135.459 0L9.66 8.688a.977.977 0 0 0 0-1.376z"
      ></path>
      <path
        fill="url(#c)"
        d="M4.147 8.098a.816.816 0 1 1-1.633 0 .816.816 0 0 1 1.633 0"
      ></path>
      <path
        fill="url(#d)"
        d="M1.96 8.098a.98.98 0 1 1-1.96 0 .98.98 0 0 1 1.96 0"
      ></path>
      <defs>
        <linearGradient
          id="a"
          x1="0"
          x2="16"
          y1="8"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006100"></stop>
          <stop offset="0.236" stopColor="#008300"></stop>
          <stop offset="0.911" stopColor="#00b542"></stop>
          <stop offset="1" stopColor="#00e75d"></stop>
        </linearGradient>
        <linearGradient
          id="b"
          x1="0"
          x2="16"
          y1="8"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006100"></stop>
          <stop offset="0.236" stopColor="#008300"></stop>
          <stop offset="0.911" stopColor="#00b542"></stop>
          <stop offset="1" stopColor="#00e75d"></stop>
        </linearGradient>
        <linearGradient
          id="c"
          x1="0"
          x2="16"
          y1="8"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006100"></stop>
          <stop offset="0.236" stopColor="#008300"></stop>
          <stop offset="0.911" stopColor="#00b542"></stop>
          <stop offset="1" stopColor="#00e75d"></stop>
        </linearGradient>
        <linearGradient
          id="d"
          x1="0"
          x2="16"
          y1="8"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006100"></stop>
          <stop offset="0.236" stopColor="#008300"></stop>
          <stop offset="0.911" stopColor="#00b542"></stop>
          <stop offset="1" stopColor="#00e75d"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}
