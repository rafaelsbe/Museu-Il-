import { Header } from "@/components/Header";
import { QuickLinks } from "@/components/QuickLinks";
import { Agenda } from "@/components/Agenda";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { KioskSocial } from "@/components/KioskSocial";
import { Featured } from "@/components/Featured";

export default function Home() {
  return (
    <main role="main" tabIndex={-1}>
      <Header />
      <QuickLinks />
      <Agenda />
      <Gallery />
      <Testimonials />
      <KioskSocial />
      <Featured />
    </main>
  );
}
