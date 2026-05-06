import { notFound } from "next/navigation";
import { SeoLongPage } from "@/components/seo/SeoLongPage";
import { GLOSSARY } from "@/lib/seo-pages";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return Object.keys(GLOSSARY).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = GLOSSARY[params.slug];
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.description, path: `/glossary/${p.slug}` });
}

export default function GlossaryEntry({ params }: { params: { slug: string } }) {
  const p = GLOSSARY[params.slug];
  if (!p) return notFound();
  return <SeoLongPage page={p} path={`/glossary/${p.slug}`} />;
}
