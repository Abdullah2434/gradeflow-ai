"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenCheck,
  GraduationCap,
  Lightbulb,
  LogOut,
  PenSquare,
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
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col lg:flex",
            theme.layout.sidebarWidthClass,
            "border-r border-[var(--sidebar-border)]",
            "bg-[var(--sidebar)]"
          )}
          style={{
            backgroundImage:
              "linear-gradient(180deg, var(--sidebar) 0%, var(--sidebar-elevated) 100%)",
          }}
        >
          <div className="border-b border-[var(--sidebar-border)] px-5 py-6">
            <div className="flex items-center gap-3">
              <div className={cn(theme.component.brandMark, "h-10 w-10")}>
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="display-title text-lg font-semibold text-[var(--sidebar-fg)]">
                  GradeFlow AI
                </div>
                <div className="text-xs text-[var(--sidebar-fg)]/80">Grading pipeline</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-3">
            <div className="mb-2 px-3 text-[0.625rem] font-semibold uppercase tracking-widest text-[var(--sidebar-fg)]/75">
              Workspace
            </div>
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
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-[var(--sidebar-active)] text-[var(--sidebar-fg)] shadow-[inset_0_0_0_1px_var(--sidebar-active-border)]"
                      : "text-[var(--sidebar-fg)] hover:bg-[var(--sidebar-hover)]"
                  )}
                >
                  <Icon className="h-4 w-4 text-[var(--sidebar-fg)]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--sidebar-border)] p-3">
            <Link
              href="/"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sidebar-fg)] transition hover:bg-[var(--sidebar-hover)]"
            >
              <BookOpenCheck className="h-4 w-4 text-[var(--sidebar-fg)]" />
              Home
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sidebar-fg)] transition hover:bg-[var(--sidebar-hover)]"
            >
              <LogOut className="h-4 w-4 text-[var(--sidebar-fg)]" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
          <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md lg:hidden">
            <div
              className={cn(
                "flex h-14 items-center justify-between",
                theme.layout.maxWidthClass,
                theme.layout.pageXPaddingClass
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(theme.component.brandMark, "h-8 w-8")}>
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="display-title text-lg font-semibold">GradeFlow AI</span>
              </div>
            </div>
          </header>

          <main
            className={cn(
              "mx-auto w-full flex-1 py-8 lg:py-10",
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
