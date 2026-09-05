import { SeoLongPage } from "@/components/seo/SeoLongPage";
import { PAGES } from "@/lib/seo-pages";
import { pageMetadata } from "@/lib/seo";

const PAGE = PAGES["free-ai-therapist"];
export const metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: "/free-ai-therapist" });

export default function Page() {
  return <SeoLongPage page={PAGE} path="/free-ai-therapist" />;
}
