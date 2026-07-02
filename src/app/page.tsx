import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";
import { Button } from "@/ui/Button";

const steps = [
  { icon: Upload, title: "Students submit", desc: "PDF, DOC, DOCX, image, or pasted text" },
  { icon: Sparkles, title: "AI drafts grade", desc: "Rubric-based scores + feedback" },
  { icon: CheckCircle2, title: "Teacher approves", desc: "Review, edit, send via WhatsApp" },
];

export default function Home() {
  return (
    <div className="paper-texture grid-overlay min-h-dvh">
      <div className={cn("mx-auto flex min-h-dvh flex-col", theme.layout.maxWidthClass, theme.layout.pageXPaddingClass)}>
        <header className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="display-title text-2xl font-semibold">GradeFlow AI</span>
          </div>
          <Link href="/login">
            <Button variant="secondary">Teacher login</Button>
          </Link>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className={theme.animation.fadeUp}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                <Sparkles className="h-3.5 w-3.5" />
                AI-assisted grading
              </div>
              <h1 className="display-title max-w-2xl text-5xl font-semibold leading-[1.05] text-[var(--ink)] lg:text-6xl">
                Grade faster. <span className="text-[var(--accent)]">Teach better.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
                Students submit work, AI drafts rubric-based feedback, you review and approve — only then does the
                student receive their grade.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/login">
                  <Button variant="accent" className="h-12 px-6 text-base">
                    Open dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/submit/demo">
                  <Button variant="secondary" className="h-12 px-6 text-base">
                    Student submit demo
                  </Button>
                </Link>
              </div>
            </div>

            <div className={cn("space-y-4", theme.animation.fadeUpDelay2)}>
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-soft)] text-[var(--gold)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--ink)]">{step.title}</div>
                      <div className="mt-1 text-sm text-[var(--ink-muted)]">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
