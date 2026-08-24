import { cn } from "@/lib/utils";

type PillButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "black";
  className?: string;
  href: string;
};

export function PillButton({
  children,
  variant = "primary",
  className,
  href,
}: PillButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "border border-gray-border bg-white text-foreground hover:border-secondary hover:bg-secondary/5",
    ghost: "bg-transparent text-white border border-white hover:bg-white/10",
    black: "bg-foreground text-white hover:bg-secondary-dark",
  };

  return (
    <a
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}
