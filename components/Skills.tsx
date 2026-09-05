import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

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
        <SectionHeader index="§4" label="stack">
          What I reach for, by where it lives.
        </SectionHeader>

        {/* catalogued inventory — margin category + inline list, not a card grid */}
        <div>
          {CLUSTERS.map((c, i) => (
            <Reveal key={c.cat} delay={(i % 2) * 60}>
              <div className="marginalia !gap-y-3 py-6 border-b border-[var(--border)] row-rule">
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
