export type Theme = {
  colors: Record<string, Record<string, string>>;
  fontFamily: {
    sans: string;
    mono: string;
  };
};

export const theme = {
  fontFamily: {
    sans: 'system-ui, sans-serif',
    mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  },
  colors: {
    bg: {
      default: 'oklch(16.98% 0.002 285.7)',
      subtle: 'oklch(22.25% 0.008 284.7)',
      overlay: 'rgba(0, 0, 0, 0.3)',
    },
    surface: {
      default: 'rgba(255, 255, 255, 0.02)',
      subtle: 'rgba(255, 255, 255, 0.04)',
      hover: 'rgba(255, 255, 255, 0.08)',
      active: 'rgba(255, 255, 255, 0.1)',
    },
    border: {
      default: 'rgba(255, 255, 255, 0.06)',
      subtle: 'rgba(255, 255, 255, 0.1)',
      hover: 'rgba(255, 255, 255, 0.15)',
    },
    text: {
      default: 'oklch(91.97% 0.002 286.3)',
      bright: 'oklch(96.74% 0.001 286.4)',
      muted: 'oklch(71.18% 0.005 286.1)',
      dim: 'oklch(55.17% 0.006 285.9)',
      dimmer: 'oklch(44.19% 0.006 285.8)',
    },
    primary: {
      dark: 'oklch(47% 0.32 154)',
      default: 'oklch(0.8122 0.2088 155.57)',
      light: 'oklch(70% 0.7 138)',
    },
    success: {
      default: 'oklch(77.29% 0.061 163.2)',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    warning: {
      default: 'oklch(83.69% 0.066 84.4)',
      bg: 'rgba(251, 191, 36, 0.12)',
      border: 'rgba(251, 191, 36, 0.3)',
    },
    error: {
      default: 'oklch(63.68% 0.083 25.3)',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.3)',
    },
  },
} satisfies Theme;
