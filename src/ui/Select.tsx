"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
};

export type SelectProps<T extends string = string> = {
  value: T | "";
  onChange: (value: T | "") => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  searchable?: boolean;
  emptyMessage?: string;
  "aria-label"?: string;
};

function getEnabledIndex(options: SelectOption[], start: number, direction: 1 | -1): number {
  if (!options.length) return -1;
  let idx = start;
  for (let i = 0; i < options.length; i += 1) {
    idx = (idx + direction + options.length) % options.length;
    if (!options[idx]?.disabled) return idx;
  }
  return -1;
}

export function Select<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Select an option…",
  disabled = false,
  className,
  id,
  searchable,
  emptyMessage = "No options available",
  "aria-label": ariaLabel,
}: SelectProps<T>) {
  const autoId = useId();
  const listboxId = `${id ?? autoId}-listbox`;
  const triggerId = `${id ?? autoId}-trigger`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const showSearch = searchable ?? options.length > 6;

  const filteredOptions = useMemo(() => {
    if (!showSearch || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q),
    );
  }, [options, query, showSearch]);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlightedIndex(-1);
  }, []);

  const selectOption = useCallback(
    (option: SelectOption<T>) => {
      if (option.disabled) return;
      onChange(option.value);
      close();
    },
    [close, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    if (showSearch) {
      searchRef.current?.focus();
      return;
    }
    const selectedIdx = filteredOptions.findIndex((o) => o.value === value);
    const next = selectedIdx >= 0 ? selectedIdx : getEnabledIndex(filteredOptions, -1, 1);
    setHighlightedIndex(next);
  }, [filteredOptions, open, showSearch, value]);

  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const item = listRef.current?.children[highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => getEnabledIndex(filteredOptions, prev, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => getEnabledIndex(filteredOptions, prev, -1));
      return;
    }
    if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) selectOption(option);
    }
  }

  const isEmpty = options.length === 0;
  const noResults = !isEmpty && filteredOptions.length === 0;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        id={triggerId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled || isEmpty}
        onClick={() => {
          if (disabled || isEmpty) return;
          setOpen((prev) => !prev);
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 px-3 text-left text-sm transition-colors",
          theme.radius.md,
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] transition-colors",
          "hover:border-[var(--accent)]/40 hover:bg-[var(--surface-subtle)]",
          theme.focus.input,
          (disabled || isEmpty) && "cursor-not-allowed opacity-60",
          open && "border-[var(--accent)]",
        )}
      >
        <span className={cn("min-w-0 truncate", !selectedOption && "text-[var(--ink-muted)]")}>
          {isEmpty ? emptyMessage : selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--ink-muted)] transition-transform duration-200",
            open && "rotate-180 text-[var(--accent)]",
          )}
        />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden",
            theme.radius.md,
            "border border-[var(--border)] bg-[var(--surface)] shadow-lg",
            "animate-[dropdownIn_0.16s_ease-out_both]",
          )}
          onKeyDown={onListKeyDown}
        >
          {showSearch ? (
            <div className="border-b border-[var(--border)] p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className={cn(
                    "h-9 w-full pl-8 pr-3 text-sm",
                    theme.radius.sm,
                    "border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--ink)] placeholder:text-[var(--ink-muted)] transition-colors",
                    theme.focus.input,
                  )}
                />
              </div>
            </div>
          ) : null}

          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            aria-labelledby={triggerId}
            className="max-h-60 overflow-y-auto p-1.5"
          >
            {noResults ? (
              <li className="px-3 py-6 text-center text-sm text-[var(--ink-muted)]">No matches found</li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={option.disabled}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => selectOption(option)}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        option.disabled && "cursor-not-allowed opacity-50",
                        !option.disabled && isHighlighted && "bg-[var(--surface-subtle)]",
                        !option.disabled && isSelected && "bg-[var(--accent)]/8 text-[var(--accent)]",
                        !option.disabled && !isSelected && "text-[var(--ink)] hover:bg-[var(--surface-subtle)]",
                      )}
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                        {isSelected ? <Check className="h-4 w-4" /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{option.label}</span>
                        {option.description ? (
                          <span className="mt-0.5 block truncate text-xs text-[var(--ink-muted)]">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
