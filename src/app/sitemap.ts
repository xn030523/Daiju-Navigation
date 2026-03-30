import type { MetadataRoute } from "next";

import { getNavigationDocument, getSiteMeta } from "@/lib/navigation";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteMeta, document] = await Promise.all([
    getSiteMeta(),
    getNavigationDocument(),
  ]);

  const now = new Date();

  return [
    {
      url: siteMeta.siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...document.groups.map((group) => ({
      url: `${siteMeta.siteUrl}/category/${group.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
