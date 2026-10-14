import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { previa } from "@/lib/base";

// gerado uma vez no build (export estático para o GitHub Pages)
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [previa ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
