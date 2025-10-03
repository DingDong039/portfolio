"use client";

import { Code2, Database, Wrench, Globe } from "lucide-react";

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      icon: <Code2 className="w-8 h-8" />,
      skills: [
        "HTML/CSS",
        "Bootstrap",
        "Tailwind CSS",
        "JavaScript",
        "TypeScript",
        "jQuery",
        "Ajax",
        "React",
        "Angular",
        "Vue.js",
      ],
    },
    {
      title: "Backend",
      icon: <Globe className="w-8 h-8" />,
      skills: [
        "ASP.NET MVC",
        "ASP.NET Core",
        "C#",
        "Java 8+",
        "Spring Boot",
        "Node.js",
        "PHP",
        "VBScript",
      ],
    },
    {
      title: "Database",
      icon: <Database className="w-8 h-8" />,
      skills: ["SQL Server", "MySQL", "PostgreSQL", "Oracle", "DBeaver"],
    },
    {
      title: "Tools & Others",
      icon: <Wrench className="w-8 h-8" />,
      skills: [
        "Git",
        "GitLab",
        "Docker",
        "XML/XSLT",
        "Swagger",
        "Postman",
        "ClickUp",
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-white dark:bg-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Skills & Technologies
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-blue-600 dark:text-blue-400">{category.icon}</div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium border border-slate-200 dark:border-slate-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
            Languages
          </h3>
          <div className="flex justify-center gap-6">
            <div className="bg-blue-100 dark:bg-blue-900 px-6 py-3 rounded-lg">
              <p className="font-semibold text-blue-800 dark:text-blue-200">Thai</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Native</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 px-6 py-3 rounded-lg">
              <p className="font-semibold text-purple-800 dark:text-purple-200">English</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Basic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
