import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn(
        theme.radius.lg,
        "border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_0_rgba(20,26,23,0.04)]",
        className
      )}
      {...rest}
    />
  );
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={cn("border-b border-[var(--border)] p-5", className)} {...rest} />;
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const { className, ...rest } = props;
  return <h2 className={cn("display-title text-xl font-semibold text-[var(--ink)]", className)} {...rest} />;
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={cn("p-5", className)} {...rest} />;
}
