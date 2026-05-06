import { SeoLongPage } from "@/components/seo/SeoLongPage";
import { PAGES } from "@/lib/seo-pages";
import { pageMetadata } from "@/lib/seo";

const PAGE = PAGES["is-ai-therapy-effective"];
export const metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: "/is-ai-therapy-effective" });

export default function Page() {
  return <SeoLongPage page={PAGE} path="/is-ai-therapy-effective" />;
}
