import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// One page. Fragment sections are not URLs and never become pseudo-pages.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL }];
}
