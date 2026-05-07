import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/nav/Header";
import { Hero } from "@/components/hero/Hero";
import { PainPoints } from "@/components/sections/PainPoints";
import { Services } from "@/components/sections/Services";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Process } from "@/components/sections/Process";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/footer/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Hero />
        <PainPoints />
        <Services />
        <CaseStudy />
        <Process />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
