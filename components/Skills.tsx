"use client";

import { Code2, Database, Wrench, Globe, Sparkles, Languages, Lightbulb, Users, Clock, Target, TrendingUp, Briefcase } from "lucide-react";

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      icon: Code2,
      color: "from-pink-500 to-rose-500",
      skills: [
        "HTML/CSS",
        "Bootstrap",
        "Tailwind CSS",
        "JavaScript",
        "TypeScript",
        "jQuery",
        "React",
        "Angular",
        "Vue 2",
      ],
    },
    {
      title: "Backend",
      icon: Globe,
      color: "from-orange-500 to-amber-500",
      skills: [
        "ASP.NET MVC",
        "ASP.NET Core",
        "Java Spring Boot",
        "Node.js",
        "PHP Yii2",
        "VBScript",
      ],
    },
    {
      title: "Database",
      icon: Database,
      color: "from-pink-500 to-orange-500",
      skills: ["SQL Server", "MySQL", "PostgreSQL", "Oracle"],
    },
    {
      title: "Tools & Others",
      icon: Wrench,
      color: "from-rose-500 to-pink-500",
      skills: [
        "Git",
        "GitLab",
        "Docker",
        "Postman",
        "ClickUp",
        "DBeaver"
      ],
    },
  ];

  const softSkills = [
    { name: "Problem Solving", icon: Lightbulb },
    { name: "Adaptability", icon: TrendingUp },
    { name: "Time Management", icon: Clock },
    { name: "Teamwork", icon: Users },
    { name: "Research", icon: Target },
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
          Skills & Technologies
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Technical Skills */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-200 dark:border-pink-900/30">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-pink-200 mb-6">Technical Skills</h3>

            <div className="space-y-6">
              {skillCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.title}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 bg-gradient-to-br ${category.color} rounded-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-base font-bold text-slate-700 dark:text-pink-300">
                        {category.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2 ml-10">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-slate-700 dark:text-pink-200 rounded-md text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Soft Skills & Languages */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-200 dark:border-pink-900/30">
            {/* Soft Skills */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-700 dark:text-pink-300">
                  Soft Skills
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 ml-10">
                {softSkills.map(({ name, icon: Icon }) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-slate-700 dark:text-pink-200 rounded-md text-sm font-medium"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg">
                  <Languages className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-700 dark:text-pink-300">
                  Languages
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 ml-10">
                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-slate-700 dark:text-pink-200 rounded-md text-sm font-medium">
                  Thai (Native)
                </span>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-slate-700 dark:text-orange-200 rounded-md text-sm font-medium">
                  English (Basic)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
