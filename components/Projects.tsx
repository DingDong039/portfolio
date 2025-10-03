"use client";

import { Briefcase, Calendar } from "lucide-react";

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
      tech: ["Angular 5+", "Vue2", ".NET 8 Core", "ASP.NET MVC", "Java Spring Boot", "Oracle DB", "DBeaver", "Docker", "Gitlab","Gitlab CI/CD", "ClickUp" ],
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
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Experience & Projects
        </h2>

        <div className="mb-16">
          <h3 className="text-3xl font-semibold mb-8 text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Briefcase className="w-8 h-8" />
            Work Experience
          </h3>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h4 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      {exp.position}
                    </h4>
                    <p className="text-lg text-blue-600 dark:text-blue-400">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mt-2 md:mt-0">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{exp.period}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-slate-600 dark:text-slate-400 flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
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
          <h3 className="text-3xl font-semibold mb-8 text-slate-800 dark:text-slate-200">
            Featured Project
          </h3>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                {project.type}
              </span>
            </div>

            <h4 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              {project.title}
            </h4>

            <p className="text-slate-600 dark:text-slate-400 mb-6">{project.description}</p>

            <div className="mb-6">
              <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Key Achievements:
              </h5>
              <ul className="space-y-2">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="text-slate-600 dark:text-slate-400 flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium"
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
