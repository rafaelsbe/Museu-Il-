import {
  Ticket,
  Mail,
  Calendar,
  BookOpen,
  MapPin,
  Heart,
} from "lucide-react";

const links = [
  { icon: Ticket, label: "Ingressos" },
  { icon: Mail, label: "Newsletter" },
  { icon: Calendar, label: "Agenda" },
  { icon: BookOpen, label: "Publicações" },
  { icon: MapPin, label: "Como Chegar" },
  { icon: Heart, label: "Apoie" },
];

export function QuickLinks() {
  return (
    <section className="relative bg-white px-6 py-12 md:px-12 lg:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-8 md:grid-cols-6">
        {links.map(({ icon: Icon, label }) => (
          <a
            key={label}
            href="#"
            className="group flex flex-col items-center gap-3 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary transition-colors group-hover:bg-primary/5">
              <Icon size={24} className="text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
              {label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
