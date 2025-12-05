"use client";

import { Briefcase, Calendar, Rocket, Building2, CheckCircle2 } from "lucide-react";

export default function Projects() {
  const experiences = [
    {
      company: "Probit Solutions Co., Ltd.",
      position: "Programmer",
      period: "Nov 2024 – Present",
      description: [
        "Developed and maintained internal systems for Thairath Group, including Employee Self Service (ESS), Thairath Logistics (LMS,WMS), Thairath Budget, and Asset Management Systems",
        "Utilized Angular 5+, Vue2 Options API, .NET 8 Core API, ASP.NET Framework MVC, Java 8+ Spring Boot",
        "Contributed to system improvements, streamlining operations and increasing efficiency",
        "Collaborated with cross-functional teams to ensure seamless system integration and high-quality project delivery",
      ],
      tech: ["Angular", "Vue2", ".NET Core", "ASP.NET MVC", "Java Spring Boot", "Oracle", "DBeaver", "Docker", "Gitlab", "ClickUp" ],
    },
    {
      company: "Max Savings (Thailand) Co., Ltd.",
      position: "Software Developer",
      period: "Dec 2021 – Sep 2024",
      description: [
        "Developed Virtual e-Office/ERP systems for government and private organizations, including modules for e-Document, Accounting, and Finance",
        "Worked with Classic ASP (VBScript), XML/XSLT, and ASP.NET MVC, SQL Server (SSMS) as primary technology stack",
        "Optimized backend processes using Queue design to manage data efficiently",
        "Maintained project legacy systems to ensure proper functionality",
      ],
      tech: ["Classic ASP", "VBScript", "XML/XSLT", "ASP.NET MVC", "SQL Server"],
    },
  ];

  const project = {
    title: "Primary Care System for Health Data Analysis",
    type: "University Project",
    description:
      "Developed a web-based community health information system to support Village Health Volunteers (VHVs) in collecting, managing, and analyzing public health data for Primary Health Care (PHC) services.",
    highlights: [
      "Enhanced data accessibility for VHVs",
      "Reduced manual reporting time by 30%",
      "Enabled data-driven decisions for local healthcare initiatives",
    ],
    tech: ["ASP.NET Web Forms", "Bootstrap 4.6", "PostgreSQL"],
  };

  return (
    <section id="projects" className="py-20 px-4 from-slate-950 via-pink-950/10 to-slate-950 relative overflow-hidden">
      {/* Decorative Elements - Gravitational lensing glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,170,68,0.5)]">
          Experience & Projects
        </h2>

        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-linear-to-br from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/50">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">
              Work Experience
            </h3>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-linear-to-br from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/50 mt-1">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">
                        {exp.position}
                      </h4>
                      <p className="text-lg text-orange-400 font-semibold">{exp.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2 bg-orange-950/30 rounded-full border border-orange-500/40">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-orange-300">{exp.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 pl-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-white/80 flex gap-3 items-start">
                      <span className="text-orange-400 mt-1">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-orange-950/30 border border-orange-500/30 text-orange-100 rounded-lg text-sm font-medium hover:bg-orange-900/40 hover:border-orange-400/50 hover:shadow-md hover:shadow-orange-500/20 transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-linear-to-br from-pink-500 to-red-500 rounded-xl shadow-lg shadow-pink-500/50">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">
              Featured Project
            </h3>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/20 hover:scale-[1.01] transition-all duration-300">
            <div className="mb-6">
              <span className="px-4 py-2 bg-linear-to-r from-pink-500 to-red-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-pink-500/50">
                {project.type}
              </span>
            </div>

            <h4 className="text-3xl font-bold text-white mb-4">
              {project.title}
            </h4>

            <p className="text-white/80 mb-6 leading-relaxed text-lg">{project.description}</p>

            <div className="mb-6 p-6 bg-pink-950/20 rounded-xl border border-pink-500/30">
              <h5 className="font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-pink-400" />
                Key Achievements:
              </h5>
              <ul className="space-y-3">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="text-white/80 flex gap-3 items-start">
                    <span className="text-green-400 font-bold mt-1">✓</span>
                    <span className="leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-pink-950/30 border border-pink-500/30 text-pink-100 rounded-lg text-sm font-semibold hover:bg-pink-900/40 hover:border-pink-400/50 hover:shadow-md hover:shadow-pink-500/20 transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
