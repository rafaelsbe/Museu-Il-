import {
  Ticket,
  Mail,
  Calendar,
  BookOpen,
  MapPin,
  Heart,
} from "lucide-react";

const links = [
  { icon: Ticket, label: "Consultas", href: "/consultas" },
  { icon: Mail, label: "Contato", href: "/visite#contato" },
  { icon: Calendar, label: "Agenda", href: "/programacao" },
  { icon: BookOpen, label: "Acervo", href: "/acervo" },
  { icon: MapPin, label: "Como Chegar", href: "/visite" },
  { icon: Heart, label: "O Museu", href: "/sobre" },
];

export function QuickLinks() {
  return (
    <section className="relative border-b border-gray-border/70 bg-white px-6 py-10 md:px-12 lg:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-x-5 gap-y-8 md:grid-cols-6">
        {links.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="group flex flex-col items-center gap-3 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon size={24} className="text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
              {label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
