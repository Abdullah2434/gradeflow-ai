export const theme = {
  layout: {
    maxWidthClass: "max-w-[1400px]",
    pageXPaddingClass: "px-6 lg:px-8",
    sidebarWidthClass: "w-64",
  },
  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  },
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    glow: "shadow-[0_0_40px_-12px_var(--accent-glow)]",
  },
  color: {
    bg: "bg-[var(--paper)]",
    fg: "text-[var(--ink)]",
    mutedFg: "text-[var(--ink-muted)]",
    border: "border-[var(--border)]",
    surface: "bg-[var(--surface)]",
    surfaceSubtle: "bg-[var(--surface-subtle)]",
    accent: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
    accentText: "text-[var(--accent)]",
    accentBorder: "border-[var(--accent)]",
    gold: "text-[var(--gold)]",
    primary: "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink-soft)]",
    danger: "bg-red-700 text-white hover:bg-red-600",
  },
  focus: {
    ring: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]",
    input:
      "focus:outline-none focus:border-[var(--accent)] focus-visible:outline-none focus-visible:border-[var(--accent)]",
  },
  font: {
    display: "font-[family-name:var(--font-display)]",
    body: "font-[family-name:var(--font-body)]",
  },
  animation: {
    fadeUp: "animate-[fadeUp_0.6s_ease-out_both]",
    fadeUpDelay1: "animate-[fadeUp_0.6s_ease-out_0.1s_both]",
    fadeUpDelay2: "animate-[fadeUp_0.6s_ease-out_0.2s_both]",
    fadeUpDelay3: "animate-[fadeUp_0.6s_ease-out_0.3s_both]",
  },
} as const;
