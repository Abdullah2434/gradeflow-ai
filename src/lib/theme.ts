export const theme = {
  layout: {
    maxWidthClass: "max-w-[1400px]",
    pageXPaddingClass: "px-6 lg:px-8",
    sidebarWidthClass: "w-[17rem]",
  },
  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  },
  shadow: {
    sm: "shadow-[0_1px_3px_rgba(26,33,30,0.06)]",
    md: "shadow-[0_4px_16px_-4px_rgba(26,33,30,0.1)]",
    card: "shadow-[0_1px_0_rgba(26,33,30,0.04),0_4px_20px_-8px_rgba(26,33,30,0.08)]",
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
    accentSoft: "bg-[var(--accent-soft)]",
    gold: "text-[var(--gold)]",
    primary: "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink-soft)]",
    danger: "bg-[var(--danger)] text-white hover:bg-red-700",
  },
  focus: {
    ring: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]",
    input:
      "focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/15",
  },
  font: {
    display: "font-[family-name:var(--font-display)]",
    body: "font-[family-name:var(--font-body)]",
  },
  animation: {
    fadeUp: "animate-[fadeUp_0.55s_ease-out_both]",
    fadeUpDelay1: "animate-[fadeUp_0.55s_ease-out_0.08s_both]",
    fadeUpDelay2: "animate-[fadeUp_0.55s_ease-out_0.16s_both]",
    fadeUpDelay3: "animate-[fadeUp_0.55s_ease-out_0.24s_both]",
  },
  component: {
    listRow: "list-row",
    insetPanel: "inset-panel",
    pageEyebrow: "page-eyebrow",
    alertSuccess: "alert-success",
    alertDanger: "alert-danger",
    brandMark: "brand-mark",
    rowAction:
      "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-[var(--ink-muted)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--ink)]",
    rowActionAccent:
      "inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]",
  },
} as const;
