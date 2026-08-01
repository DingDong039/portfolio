import Reveal from "./Reveal";

type Cluster = {
  cat: string;
  count: string;
  skills: string[];
};

const CLUSTERS: Cluster[] = [
  {
    cat: "Frontend",
    count: "9 items",
    skills: ["HTML/CSS", "Bootstrap", "Tailwind CSS", "JavaScript", "TypeScript", "jQuery", "Ajax", "Angular", "Vue.js"],
  },
  {
    cat: "Backend",
    count: "9 items",
    skills: ["C#", "ASP.NET MVC", "ASP.NET Core", "Spring Boot", "REST APIs", "Swagger/OpenAPI", "Java", "PHP", "Classic ASP"],
  },
  {
    cat: "Database",
    count: "4 items",
    skills: ["SQL Server", "MySQL", "PostgreSQL", "Oracle"],
  },
  {
    cat: "Tools",
    count: "8 items",
    skills: ["Git", "GitLab", "Docker", "Postman", "DBeaver", "Visual Studio", "VS Code", "Linux CLI"],
  },
  {
    cat: "AI-assisted",
    count: "5 items",
    skills: ["Claude Code", "ChatGPT", "Codex", "Antigravity", "GLM"],
  },
];

export default function Skills() {
  return (
    <section id="stack" className="relative px-5 sm:px-7 py-16 sm:py-24 scroll-mt-14">
      <div className="mx-auto max-w-6xl relative z-[var(--z-content)]">
        {/* section header */}
        <Reveal className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 items-baseline mb-12 border-b border-[var(--border)] pb-6">
          <div className="section-index">
            §3 · <b>stack</b>
          </div>
          <h2 className="display-h2 text-[var(--fg)] max-w-2xl">What I reach for, by where it lives.</h2>
        </Reveal>

        {/* catalogued inventory — margin category + inline list, not a card grid */}
        <div className="border-t border-[var(--border)]">
          {CLUSTERS.map((c, i) => (
            <Reveal key={c.cat} delay={(i % 2) * 60}>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 py-6 border-b border-[var(--border)]">
                <div className="margin-label">
                  <span className="block text-[0.85rem] text-[var(--fg)] font-medium tracking-[0.04em]">
                    {c.cat}
                  </span>
                  {c.count}
                </div>
                <ul className="flex flex-wrap gap-x-3 gap-y-2 items-center">
                  {c.skills.map((s, k) => (
                    <li key={s} className="flex items-center gap-3 text-[var(--fg)]">
                      <span className="text-[0.98rem]">{s}</span>
                      {k < c.skills.length - 1 && (
                        <span className="text-[var(--fg-4)] select-none" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
