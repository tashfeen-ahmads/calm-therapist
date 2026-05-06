import { SeoLongPage } from "@/components/seo/SeoLongPage";
import { PAGES } from "@/lib/seo-pages";
import { pageMetadata } from "@/lib/seo";

const PAGE = PAGES["how-does-ai-therapy-work"];
export const metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: "/how-does-ai-therapy-work" });

export default function Page() {
  return <SeoLongPage page={PAGE} path="/how-does-ai-therapy-work" />;
}
