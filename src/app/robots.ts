import type { MetadataRoute } from "next";

import { getSiteMeta } from "@/lib/navigation";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteMeta = await getSiteMeta();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteMeta.siteUrl}/sitemap.xml`,
    host: siteMeta.siteUrl,
  };
}
