import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

type Project = {
  index: string;
  domain: string;
  name: string;
  blurb: string;
  summary: string;
  points: string[];
  tech: string[];
  fig: { src: string; caption: string; alt: string };
};

const PROJECTS: Project[] = [
  {
    index: "P.01",
    domain: "AI · web platform",
    name: "INVESTRA AI",
    blurb: "investment research assistant",
    summary:
      "An AI research cockpit for Thai financial advisors — live portfolio tracking, grounded ticker deep research, conversational portfolio chat, and realtime risk alerts in one Thai-first bilingual workspace.",
    points: [
      "Grounded AI ticker research via GLM + MCP web search and page reader, rendered with citations.",
      "Streamed multi-turn portfolio chat grounded in live holdings and web sources.",
      "Supabase Auth, Postgres RLS, and Realtime; canonical USD backend with a USD/THB display layer.",
    ],
    tech: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Zhipu GLM", "Vercel AI SDK", "Tailwind CSS v4"],
    fig: {
      src: "/projects/investra-ui.png",
      caption: "Fig. P.01 — workspace · live portfolio, AI research panel (light theme)",
      alt: "INVESTRA AI workspace showing portfolio value, holdings table, risk feed, and the AI research panel in light theme",
    },
  },
  {
    index: "P.02",
    domain: "desktop · Rust",
    name: "GrowFlow",
    blurb: "growing video transfer",
    summary:
      "A cross-platform desktop app that copies video files while they are still being recorded — reads only newly appended bytes, resumes after interruption, and verifies a full BLAKE3 checksum before finalizing. The source is never modified.",
    points: [
      "Rust + Tokio transfer engine across local, SMB/NAS, and SFTP paths in any direction.",
      "Durable .part staging and resume; sampling pre-check, then mandatory full BLAKE3 verification.",
      "Tauri 2 shell with SQLite job persistence and a Thai-first control-room UI on Windows, macOS, and Linux.",
    ],
    tech: ["Tauri 2", "Rust", "Tokio", "React 19", "SQLite", "BLAKE3", "russh-sftp"],
    fig: {
      src: "/projects/growflow-ui.png",
      caption: "Fig. P.02 — control room · live transfer with signal track",
      alt: "GrowFlow control room showing a live recording transfer from SFTP to a mounted archive with progress, speed, and remaining time",
    },
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative px-5 sm:px-7 py-16 sm:py-24 scroll-mt-14">
      <div className="mx-auto max-w-6xl relative z-[var(--z-content)]">
        <SectionHeader index="§2" label="projects">
          Personal systems, built end to end.
        </SectionHeader>

        {/* project index — marginalia rows, mirror of the experience timeline */}
        <div>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <article className="marginalia py-8 border-b border-[var(--border)]">
                {/* margin: index + domain */}
                <div className="margin-label">
                  {p.index}
                  <span className="block text-[var(--fg-4)]">{p.domain}</span>
                </div>

                {/* main */}
                <div className="min-w-0">
                  <h3 className="display-h3 text-[var(--fg)]">
                    {p.name}
                    <span className="font-display font-medium text-[var(--fg-2)] text-[0.82em]">
                      {" "}
                      · {p.blurb}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-2xl text-[var(--fg-2)] leading-relaxed">{p.summary}</p>
                  <ul className="space-y-2 my-5 max-w-2xl">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[var(--fg-2)] leading-relaxed">
                        <span className="text-[var(--fg-4)] shrink-0 select-none">—</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span key={t} className="tag-rule">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* plate — real app capture, ruled frame + mono caption */}
                  <figure className="mt-6 group">
                    <div className="border border-[var(--border)] p-1.5 bg-[var(--bg-2)] transition-colors duration-300 group-hover:border-[var(--border-strong)]">
                      <Image
                        src={p.fig.src}
                        alt={p.fig.alt}
                        width={1440}
                        height={900}
                        sizes="(min-width: 1152px) 960px, (min-width: 768px) calc(100vw - 232px), calc(100vw - 40px)"
                        className="h-auto w-full"
                      />
                    </div>
                    <figcaption className="margin-label mt-2">{p.fig.caption}</figcaption>
                  </figure>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
