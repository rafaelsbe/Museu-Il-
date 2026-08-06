import { cn } from "@/lib/utils";

type DottedPatternProps = {
  color?: "red" | "white";
  className?: string;
  size?: number;
};

export function DottedPattern({
  color = "red",
  className,
  size = 120,
}: DottedPatternProps) {
  const dotColor = color === "red" ? "#e32619" : "#ffffff";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => {
          const cx = 10 + col * 14;
          const cy = 10 + row * 14;
          const dist = Math.sqrt((cx - 60) ** 2 + (cy - 60) ** 2);
          if (dist > 58) return null;
          const opacity = 1 - dist / 58;
          const r = 2 + (1 - dist / 58) * 2;
          return (
            <circle
              key={`${row}-${col}`}
              cx={cx}
              cy={cy}
              r={r}
              fill={dotColor}
              opacity={opacity * 0.7}
            />
          );
        }),
      )}
    </svg>
  );
}
