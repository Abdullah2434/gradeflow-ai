"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenCheck,
  GraduationCap,
  Lightbulb,
  LogOut,
  PenSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const nav = [
  { href: "/assignments", label: "Assignments", icon: PenSquare },
  { href: "/insights", label: "Insights", icon: Lightbulb },
] as const;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="h-dvh overflow-hidden paper-texture">
      <div className="flex h-full">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] lg:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="display-title text-lg font-semibold text-[var(--sidebar-fg)]">GradeFlow AI</div>
                <div className="text-xs text-[var(--sidebar-muted)]">Grading pipeline</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-4">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/insights"
                  ? pathname === "/insights" || pathname.startsWith("/insights/")
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-white/10 text-[var(--sidebar-fg)]"
                      : "text-[var(--sidebar-muted)] hover:bg-white/5 hover:text-[var(--sidebar-fg)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link
              href="/"
              className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sidebar-muted)] hover:bg-white/5 hover:text-[var(--sidebar-fg)]"
            >
              <BookOpenCheck className="h-4 w-4" />
              Home
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sidebar-muted)] hover:bg-white/5 hover:text-[var(--sidebar-fg)]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
          <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur lg:hidden">
            <div
              className={cn(
                "flex h-14 items-center justify-between",
                theme.layout.maxWidthClass,
                theme.layout.pageXPaddingClass
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                <span className="display-title text-lg font-semibold">GradeFlow AI</span>
              </div>
            </div>
          </header>

          <main
            className={cn(
              "mx-auto w-full flex-1 py-8",
              theme.layout.maxWidthClass,
              theme.layout.pageXPaddingClass,
              theme.animation.fadeUp
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
