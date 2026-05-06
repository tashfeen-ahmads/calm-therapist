import { SeoLongPage } from "@/components/seo/SeoLongPage";
import { PAGES } from "@/lib/seo-pages";
import { pageMetadata } from "@/lib/seo";

const PAGE = PAGES["what-is-an-ai-therapist"];
export const metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: "/what-is-an-ai-therapist" });

export default function Page() {
  return <SeoLongPage page={PAGE} path="/what-is-an-ai-therapist" />;
}
