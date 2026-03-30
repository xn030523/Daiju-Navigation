import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getNavigationDocument,
  getNavigationGroup,
  getNavigationGroupSlugs,
  getSiteMeta,
} from "@/lib/navigation";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export async function generateStaticParams() {
  const slugs = await getNavigationGroupSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: CategoryPageProps,
): Promise<Metadata> {
  const [{ slug }, siteMeta] = await Promise.all([props.params, getSiteMeta()]);
  const group = await getNavigationGroup(slug);

  if (!group) {
    return {};
  }

  const title = `${group.title}`;
  const description = `${group.description} 收录 ${group.items.length} 个站点。`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${group.id}`,
    },
    openGraph: {
      title: `${title} | ${siteMeta.title}`,
      description,
      url: `${siteMeta.siteUrl}/category/${group.id}`,
      type: "website",
    },
  };
}

export default async function CategoryPage(props: CategoryPageProps) {
  const [{ slug }, document] = await Promise.all([props.params, getNavigationDocument()]);
  const group = document.groups.find((item) => item.id === slug);

  if (!group) {
    notFound();
  }

  return (
    <main className="grain flex-1 px-3 py-3 text-foreground sm:px-4 sm:py-4 lg:px-5">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <section className="hero-panel glass-card rounded-[24px] px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm text-muted">
              返回首页
            </Link>
            <h1 className="section-title text-3xl font-semibold sm:text-5xl">
              {group.title}
            </h1>
            <p className="text-sm text-muted">{group.description}</p>
          </div>
        </section>

        <section className="glass-card rounded-[20px] p-4 sm:p-5">
          <div className="grid gap-3 xl:grid-cols-2">
            {group.items.map((item) => (
              <a
                key={item.name}
                className="link-tile rounded-[18px] border border-line bg-white/35 p-4"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="icon-shell flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-line bg-white/80">
                        <Image
                          src={`https://icons.duckduckgo.com/ip3/${getHostname(item.href)}.ico`}
                          alt={`${item.name} icon`}
                          className="h-5 w-5"
                          width={20}
                          height={20}
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-semibold">{item.name}</span>
                          <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted">{getHostname(item.href)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                  <span className="text-sm text-muted">↗</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
