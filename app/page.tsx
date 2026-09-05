import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FeelItFirst } from "@/components/landing/FeelItFirst";
import { Problems } from "@/components/landing/Problems";
import { ModeCards } from "@/components/landing/ModeCards";
import { AgentDemo } from "@/components/landing/AgentDemo";
import { AgentModesSection } from "@/components/landing/AgentModesSection";
import { DeepDive } from "@/components/landing/DeepDive";
import { ConditionPaths } from "@/components/landing/ConditionPaths";
import { PrivacyBlock } from "@/components/landing/Privacy";
import { Pricing } from "@/components/landing/Pricing";
import { FoundingStrip } from "@/components/landing/FoundingStrip";
import { CirclesSection } from "@/components/landing/CirclesSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LeadPopup } from "@/components/landing/LeadPopup";
import { JsonLd, organizationSchema } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <Navbar />
      <main>
        <FeelItFirst />
        <FoundingStrip />
        <Problems />
        <AgentModesSection />
        <AgentDemo />
        <CirclesSection />
        <ModeCards />
        <DeepDive />
        <ConditionPaths />
        <PrivacyBlock />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
      <LeadPopup />
    </>
  );
}
