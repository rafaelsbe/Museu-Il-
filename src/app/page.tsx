import { Header } from "@/components/Header";
import { QuickLinks } from "@/components/QuickLinks";
import { Agenda } from "@/components/Agenda";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { KioskSocial } from "@/components/KioskSocial";
import { Featured } from "@/components/Featured";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <QuickLinks />
      <Agenda />
      <Gallery />
      <Testimonials />
      <KioskSocial />
      <Featured />
      <Footer />
    </>
  );
}
