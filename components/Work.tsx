"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";

type Role = {
  company: string;
  position: string;
  period: string;
  span: string;
  location: string;
  summary: string;
  detail: string[];
  tech: string[];
};

const ROLES: Role[] = [
  {
    company: "Probit Solutions",
    position: "Programmer",
    period: "Nov 2024 — Present",
    span: "current",
    location: "Bangkok · Hybrid",
    summary:
      "Enterprise applications for the Thairath Group — finance and approval workflows, document security, and production troubleshooting across modern and legacy stacks.",
    detail: [
      "Build and maintain enterprise applications from analyst specs, business requirements, and UI guidelines.",
      "Integrate responsive, accessible frontends with backend services and Oracle databases.",
      "Investigate production incidents, run root-cause analysis, and ship corrective and preventive fixes.",
      "Contribute to architecture and code improvements for readability, testability, and maintainability.",
      "Coordinate with system analysts, backend, infrastructure, and business users.",
    ],
    tech: ["Angular", "Vue.js", "ASP.NET Core", "Spring Boot", "C#", "Oracle", "Swagger", "Docker", "Visual Studio"],
  },
  {
    company: "Max Savings (Thailand)",
    position: "Software Developer",
    period: "Mar 2022 — Sep 2024",
    span: "2.5 yrs",
    location: "Bangkok · On-site",
    summary:
      "The CryptBot Hi-Secure e-Office system — document security, finance workflows, and legacy-system maintenance for government and enterprise clients.",
    detail: [
      "Built and maintained features in Classic ASP, VBScript, XML/XSLT, and SQL Server.",
      "Designed and optimized SQL Server databases: schema, indexing, query tuning, and data maintenance.",
      "Kept documents secure through encryption, role-based access control, and digital-signature integration.",
      "Supported finance and document workflows — approvals, reporting, traceability, and audit.",
      "Handled patching, backup and restore, monitoring, and incident response.",
    ],
    tech: ["Classic ASP", "VBScript", "XML/XSLT", "SQL Server", "C#", "ASP.NET MVC"],
  },
];

const CAPSTONE = {
  title: "Primary Care System for Health Data Analysis",
  type: "University capstone · B.Sc. Computer Science",
  blurb:
    "A web platform that lets Village Health Volunteers collect, manage, and analyze public-health data for Primary Health Care services. Cut manual reporting time by 30%.",
  meta: "2018 — 2022 · Nakhon Pathom Rajabhat University · GPA 3.40",
  stack: ["ASP.NET Web Forms", "Bootstrap 4.6", "PostgreSQL"],
};

export default function Work() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="work" className="relative px-5 sm:px-7 py-16 sm:py-24 scroll-mt-14">
      <div className="mx-auto max-w-6xl relative z-[var(--z-content)]">
        {/* section header */}
        <Reveal className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 items-baseline mb-12 border-b border-[var(--border)] pb-6">
          <div className="section-index">
            §1 · <b>selected work</b>
          </div>
          <h2 className="display-h2 text-[var(--fg)] max-w-2xl">
            Two production roles, one starting point.
          </h2>
        </Reveal>

        {/* experience — marginalia timeline entries */}
        <div className="border-t border-[var(--border)]">
          {ROLES.map((role, i) => {
            const open = openIdx === i;
            return (
              <Reveal key={role.company} delay={i * 60}>
                <div className="border-b border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="w-full text-left grid grid-cols-[120px_1fr_auto] gap-4 md:gap-8 py-6 group cursor-pointer"
                    aria-expanded={open}
                  >
                    {/* margin: period + span */}
                    <div className="margin-label">
                      {role.period}
                      <span className="block text-[var(--fg-4)]">{role.span}</span>
                    </div>

                    {/* main */}
                    <div className="min-w-0">
                      <h3 className="display-h3 text-[var(--fg)]">
                        {role.position}
                        <span className="font-display font-medium text-[var(--fg-2)] text-[0.82em]">
                          {" "}
                          · {role.company}
                        </span>
                      </h3>
                      <div className="margin-label mt-1.5">{role.location}</div>
                      <p className="mt-3 max-w-2xl text-[var(--fg-2)] leading-relaxed">{role.summary}</p>
                    </div>

                    {/* chevron */}
                    <ChevronDown
                      className={`h-5 w-5 mt-1 shrink-0 text-[var(--fg-3)] group-hover:text-[var(--fg)] transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* expanded detail — indented under the main column */}
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-quint)]"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-7 md:pl-[152px]">
                        <ul className="space-y-2 mb-5 max-w-2xl">
                          {role.detail.map((d, k) => (
                            <li key={k} className="flex gap-3 text-[var(--fg-2)] leading-relaxed">
                              <span className="text-[var(--fg-4)] shrink-0 select-none">—</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1.5">
                          {role.tech.map((t) => (
                            <span key={t} className="tag-rule">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* capstone — distinct treatment, ruled panel not a third timeline row */}
        <Reveal delay={100} className="mt-12">
          <div className="panel-rule p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="tag-rule" style={{ borderColor: "var(--ember)", color: "var(--ember)" }}>
                {CAPSTONE.type}
              </span>
            </div>
            <h3 className="display-h3 text-[var(--fg)] mb-2">{CAPSTONE.title}</h3>
            <div className="margin-label mb-4">{CAPSTONE.meta}</div>
            <p className="prose-body mb-6">{CAPSTONE.blurb}</p>
            <div className="flex flex-wrap gap-1.5">
              {CAPSTONE.stack.map((t) => (
                <span key={t} className="tag-rule">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
