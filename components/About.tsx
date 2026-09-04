import Reveal from "./Reveal";

const READOUTS = [
  {
    title: "Education",
    rows: [
      ["B.Sc. Computer Science", "2018–22"],
      ["Nakhon Pathom Rajabhat Univ.", "GPA 3.40"],
    ],
  },
  {
    title: "Certifications",
    rows: [
      ["IC3 Digital Literacy GS5", "cert."],
      ["Automate Tester Bootcamp", "2025"],
    ],
  },
  {
    title: "Languages",
    rows: [
      ["Thai", "native"],
      ["English", "basic"],
    ],
  },
];

const INTERESTS = ["Crypto", "Trading", "Tech podcasts", "IT trends"];

export default function About() {
  return (
    <section id="about" className="relative px-5 sm:px-7 py-16 sm:py-24 scroll-mt-14">
      <div className="mx-auto max-w-6xl relative z-[var(--z-content)]">
        {/* section header */}
        <Reveal className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 items-baseline mb-12 border-b border-[var(--border)] pb-6">
          <div className="section-index">
            §3 · <b>about</b>
          </div>
          <h2 className="display-h2 text-[var(--fg)] max-w-2xl">Enterprise systems, end to end.</h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12">
          {/* narrative */}
          <Reveal as="div">
            <div className="space-y-4 text-[var(--fg-2)] leading-relaxed max-w-[60ch]">
              <p>
                I'm a full-stack developer currently at{" "}
                <span className="font-semibold text-[var(--fg)]">Probit Solutions</span> building
                enterprise applications for the Thairath Group — finance and approval workflows,
                document security, production troubleshooting, and system modernization.
              </p>
              <p>
                My day-to-day spans the whole stack: C#, ASP.NET and Spring Boot on the back, Angular
                and Vue on the front, Oracle and SQL Server underneath. Before that I maintained a
                Classic ASP platform, so I'm comfortable deep in legacy code and migrating it forward.
              </p>
              <p>
                I lean on AI-assisted tools to move faster on code analysis, debugging, and
                documentation, and I care about the boring parts done well: clean data models,
                predictable APIs, and interfaces that don't make people think.
              </p>
            </div>

            <Reveal as="div" delay={120} className="mt-6">
              <div className="margin-label mb-2">Interests</div>
              <ul className="flex flex-wrap gap-1.5">
                {INTERESTS.map((i) => (
                  <li key={i} className="tag-rule">
                    {i}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Reveal>

          {/* readout panels */}
          <div className="space-y-4">
            {READOUTS.map((r, i) => (
              <Reveal key={r.title} delay={i * 70}>
                <div className="panel-rule p-5">
                  <h3 className="font-mono-label text-[var(--fg-3)] mb-3 pb-2.5 border-b border-[var(--border)]">
                    {r.title}
                  </h3>
                  <dl className="flex flex-col gap-2">
                    {r.rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between items-baseline gap-3">
                        <dt className="text-[0.95rem] text-[var(--fg-2)]">{k}</dt>
                        <dd className="font-mono text-[0.78rem] text-[var(--fg)] text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
