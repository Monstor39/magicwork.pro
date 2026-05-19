import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/nav/Header";
import { Hero } from "@/components/hero/Hero";
import { AiLeaders } from "@/components/sections/AiLeaders";
import { PainPoints } from "@/components/sections/PainPoints";
import { AiWizard } from "@/components/sections/AiWizard";
import { Explainer } from "@/components/sections/Explainer";
import { Approach } from "@/components/sections/Approach";
import { Services } from "@/components/sections/Services";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Process } from "@/components/sections/Process";
import { Guarantees } from "@/components/sections/Guarantees";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/footer/Footer";
import { AiWizardFab } from "@/components/ui/AiWizardFab";

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
        <Explainer />
        <PainPoints />
        <Approach />
        <AiLeaders />
        <Services />
        <CaseStudy />
        <Process />
        <AiWizard />
        <Guarantees />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <AiWizardFab />
    </>
  );
}
