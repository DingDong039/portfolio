// One source of identity truth: layout metadata, robots, sitemap, structured
// data, and the contact channels all derive from these values. SITE_URL
// intentionally keeps the current deployment URL until the owner supplies a
// replacement domain.
export const SITE_URL = "https://portfolio-sigma-ashy-51.vercel.app/";
export const SITE_EMAIL = "watchara.ddev@gmail.com";
export const SITE_GITHUB_URL = "https://github.com/DingDong039";
export const SITE_LINKEDIN_URL = "https://www.linkedin.com/in/watchara-tongyodpun-803866313";
export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Watchara Tongyodpun",
  url: SITE_URL,
  jobTitle: "Full-Stack Developer",
  sameAs: [SITE_GITHUB_URL, SITE_LINKEDIN_URL],
};
// JSON-LD is inlined into the document: escape every `<` so a literal
// closing-script sequence in any value cannot break out of the element.
export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
