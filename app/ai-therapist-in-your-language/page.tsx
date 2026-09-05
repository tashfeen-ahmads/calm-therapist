import { SeoLongPage } from "@/components/seo/SeoLongPage";
import { PAGES } from "@/lib/seo-pages";
import { pageMetadata } from "@/lib/seo";

const PAGE = PAGES["ai-therapist-in-your-language"];
export const metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: "/ai-therapist-in-your-language" });

export default function Page() {
  return <SeoLongPage page={PAGE} path="/ai-therapist-in-your-language" />;
}
