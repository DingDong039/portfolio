"use client";

import { ArrowDown } from "lucide-react";

// Module scope — uses no component state, so it shouldn't be rebuilt per render.
const scrollToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const FACTS = [
  { k: "Experience", v: "4+ yrs" },
  { k: "Roles", v: "2" },
  { k: "Stacks", v: "5" },
  { k: "Location", v: "BKK · TH" },
];

// Entrance order for the hero's authored moment — each block settles in
// sequence and its rule draws in behind it. Pure CSS (`.enter` / `.rule-draw`),
// so nothing here gates content and reduced motion collapses it.
const step = (i: number) => ({ ["--i" as string]: i }) as React.CSSProperties;

export default function Hero() {
  return (
    <section id="top" className="relative px-5 sm:px-7 pt-12 sm:pt-16 pb-10 scroll-mt-14">
      <div className="mx-auto max-w-6xl relative z-[var(--z-content)]">
        {/* title block — name + fig. caption */}
        <header
          className="rule-draw rule-draw-strong grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-end pb-6"
          style={step(0)}
        >
          <h1 className="display-title text-[var(--fg)] enter" style={step(0)}>
            WATCHARA
            <br />
            <span aria-hidden="true">————</span>TONGYODPUN
            <span className="block font-display font-semibold text-[0.34em] tracking-[0.01em] text-[var(--fg-2)] mt-3">
              วัชระ ทองยอดพันธ์
            </span>
          </h1>
          <div className="margin-label lg:text-right leading-relaxed enter" style={step(1)}>
            Fig. 01<br />
            Full-stack developer<br />
            Chatuchak · Bangkok · TH
          </div>
        </header>

        {/* abstract — margin label + lead */}
        <div className="rule-draw marginalia py-7" style={step(2)}>
          <div className="margin-label enter" style={step(2)}>
            Abstract
          </div>
          <div className="enter" style={step(3)}>
            <p className="prose-lead">
              Full-stack developer with{" "}
              <span className="font-semibold text-[var(--fg)]">four-plus years</span> building
              and maintaining enterprise applications across modern and legacy stacks. Work
              spans finance and approval workflows, document security, production
              troubleshooting, and the gradual modernization of legacy systems.
            </p>
            <div className="mt-4 flex items-center gap-2.5 font-mono text-[0.78rem] tracking-[0.06em] uppercase text-[var(--accent)]">
              <span className="pulse-dot" aria-hidden="true" />
              Available for work
            </div>
          </div>
        </div>

        {/* key facts — ruled columns */}
        <dl className="rule-draw rule-draw-strong grid grid-cols-2 md:grid-cols-4" style={step(4)}>
          {FACTS.map((f, i) => (
            <div
              key={f.k}
              className={`px-4 py-4 enter ${i > 0 ? "md:border-l border-[var(--border)]" : ""} ${
                i % 2 === 1 ? "border-l md:border-l" : ""
              } ${i >= 2 ? "border-t md:border-t-0" : ""}`}
              style={step(4 + i)}
            >
              <dt className="margin-label">{f.k}</dt>
              <dd className="font-display font-bold text-[1.6rem] mt-1 tracking-[-0.01em] text-[var(--fg)] tabular-nums">
                {f.v}
              </dd>
            </div>
          ))}
        </dl>

        {/* actions */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mt-8 enter" style={step(8)}>
          <button type="button" onClick={() => scrollToSection("work")} className="btn-solid">
            View selected work
            <ArrowDown className="h-4 w-4 icon-down" />
          </button>
          <a href="/CV_WATCHARA_TONGYODPUN.pdf" download className="btn-outline">
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}
