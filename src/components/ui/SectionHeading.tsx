import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  script: string;
  title: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  script,
  title,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        className,
      )}
    >
      <p className="font-script text-2xl text-script-pink md:text-3xl">{script}</p>
      <h2 className="font-serif text-3xl font-bold uppercase tracking-wide text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  );
}
