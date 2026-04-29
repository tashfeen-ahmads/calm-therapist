import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/landing/Hero";
import { Problems } from "@/components/landing/Problems";
import { ModeCards } from "@/components/landing/ModeCards";
import { AgentDemo } from "@/components/landing/AgentDemo";
import { DeepDive } from "@/components/landing/DeepDive";
import { ConditionPaths } from "@/components/landing/ConditionPaths";
import { PrivacyBlock } from "@/components/landing/Privacy";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LeadPopup } from "@/components/landing/LeadPopup";
import { JsonLd, organizationSchema } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <ModeCards />
        <AgentDemo />
        <DeepDive />
        <ConditionPaths />
        <PrivacyBlock />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
      <LeadPopup />
    </>
  );
}
