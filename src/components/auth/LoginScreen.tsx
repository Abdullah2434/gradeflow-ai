"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Field } from "@/ui/Field";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("teacher@test.com");
  const [password, setPassword] = useState("password123");
  const [fullName, setFullName] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function bootstrapTeacher(name: string) {
    await fetch("/api/auth/teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: name }),
      credentials: "include",
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    try {
      if (mode === "signup") {
        const { error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) throw signUpErr;
        await bootstrapTeacher(fullName || email.split("@")[0] || "Teacher");
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
        await bootstrapTeacher(fullName || email.split("@")[0] || "Teacher");
      }
      router.push("/assignments");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="paper-texture grid-overlay flex min-h-dvh items-center justify-center p-6">
      <div className={cn("w-full max-w-md", theme.animation.fadeUp)}>
        <div className="mb-8 text-center">
          <div className={cn(theme.component.brandMark, "mx-auto mb-5 h-14 w-14")}>
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="display-title text-4xl font-semibold text-[var(--ink)]">GradeFlow AI</h1>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">Teacher workspace for AI-assisted grading</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{mode === "login" ? "Sign in" : "Create account"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "signup" ? (
                <Field label="Full name">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ms. Rivera"
                  />
                </Field>
              ) : null}
              <Field label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.edu"
                  required
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </Field>

              {error ? <div className={theme.component.alertDanger}>{error}</div> : null}

              <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {mode === "login" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <button
              type="button"
              className="mt-4 w-full text-center text-sm font-medium text-[var(--accent)] transition hover:underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>

            <div className={cn(theme.component.insetPanel, "mt-6 text-xs text-[var(--ink-muted)]")}>
              <div className="font-semibold text-[var(--ink-soft)]">Demo account</div>
              <div className="mt-2 font-mono text-[var(--ink)]">teacher@test.com</div>
              <div className="font-mono text-[var(--ink)]">password123</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
