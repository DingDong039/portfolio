"use client";

import { ArrowDown } from "lucide-react";
import Reveal from "./Reveal";

// Module scope — uses no component state, so it shouldn't be rebuilt per render.
const scrollToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const FACTS = [
  { k: "Experience", v: "4+ yrs" },
  { k: "Roles", v: "2" },
  { k: "Stacks", v: "5" },
  { k: "Location", v: "BKK · TH" },
];

export default function Hero() {
  return (
    <section id="top" className="relative px-5 sm:px-7 pt-12 sm:pt-16 pb-10 scroll-mt-14">
      <div className="mx-auto max-w-6xl relative z-[var(--z-content)]">
        {/* title block — name + fig. caption */}
        <Reveal>
          <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-end border-b-[1.5px] border-[var(--ink)] pb-6">
            <h1 className="display-title text-[var(--fg)]">
              Watchara
              <br />
              Tongyodpun
              <span className="block font-display font-semibold text-[0.34em] tracking-[0.01em] text-[var(--fg-2)] mt-3">
                วัชระ ทองยอดพันธ์
              </span>
            </h1>
            <div className="margin-label lg:text-right leading-relaxed">
              Fig. 01<br />
              Full-stack developer<br />
              Chatuchak · Bangkok · TH
            </div>
          </header>
        </Reveal>

        {/* abstract — margin label + lead */}
        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 py-7 border-b border-[var(--border)]">
          <Reveal as="div" className="margin-label">
            Abstract
          </Reveal>
          <Reveal as="div" delay={80}>
            <p className="prose-lead">
              Full-stack developer with{" "}
              <span className="font-semibold text-[var(--fg)]">four-plus years</span> building
              and maintaining enterprise applications across modern and legacy stacks. Work
              spans finance and approval workflows, document security, production
              troubleshooting, and the gradual modernization of legacy systems.
            </p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.06em] uppercase text-[var(--accent)]">
              <span className="inline-block h-[8px] w-[8px] rounded-full bg-[var(--accent)]" />
              Available for work
            </div>
          </Reveal>
        </div>

        {/* key facts — ruled columns */}
        <Reveal delay={120}>
          <dl className="grid grid-cols-2 md:grid-cols-4 border-b-[1.5px] border-[var(--ink)]">
            {FACTS.map((f, i) => (
              <div
                key={f.k}
                className={`px-4 py-4 ${i > 0 ? "md:border-l border-[var(--border)]" : ""} ${
                  i % 2 === 1 ? "border-l md:border-l" : ""
                } ${i >= 2 ? "border-t md:border-t-0" : ""}`}
              >
                <dt className="margin-label">{f.k}</dt>
                <dd className="font-display font-bold text-[1.6rem] mt-1 tracking-[-0.01em] text-[var(--fg)]">
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* actions */}
        <Reveal delay={180} className="flex flex-wrap items-center gap-3 mt-8">
          <button type="button" onClick={() => scrollToSection("work")} className="btn-solid">
            View selected work
            <ArrowDown className="h-4 w-4" />
          </button>
          <a href="/CV_WATCHARA_TONGYODPUN.pdf" download className="btn-outline">
            Download CV
          </a>
        </Reveal>
      </div>
    </section>
  );
}
