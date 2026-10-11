// One source of identity truth: layout metadata, robots, sitemap, and
// structured data all derive from these values. SITE_URL intentionally keeps
// the current deployment URL until the owner supplies a replacement domain.
export const SITE_URL = "https://portfolio-sigma-ashy-51.vercel.app/";
export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Watchara Tongyodpun",
  url: SITE_URL,
  jobTitle: "Full-Stack Developer",
  sameAs: ["https://github.com/DingDong039", "https://www.linkedin.com/in/watchara-tongyodpun-803866313"],
};
// JSON-LD is inlined into the document: escape every `<` so a literal
// closing-script sequence in any value cannot break out of the element.
export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
