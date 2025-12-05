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
    <section id="skills" className="py-20 px-4 from-slate-950 via-red-950/10 to-slate-950 relative overflow-hidden">
      {/* Decorative Elements - Cosmic jet streams */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,170,68,0.5)]">
          Skills & Technologies
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Technical Skills */}
          <div className="bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6">Technical Skills</h3>

            <div className="space-y-6">
              {skillCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.title}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 bg-linear-to-br ${category.color} rounded-lg shadow-md`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {category.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2 ml-10">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-orange-950/30 border border-orange-500/30 text-orange-100 rounded-md text-sm font-medium hover:bg-orange-900/40 hover:border-orange-400/50 transition-all"
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
          <div className="bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
            {/* Soft Skills */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-linear-to-br from-pink-500 to-red-500 rounded-lg shadow-md shadow-pink-500/50">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Soft Skills
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 ml-10">
                {softSkills.map(({ name, icon: Icon }) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-950/30 border border-pink-500/30 text-pink-100 rounded-md text-sm font-medium hover:bg-pink-900/40 hover:border-pink-400/50 transition-all"
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
                <div className="p-2 bg-linear-to-br from-orange-500 to-pink-500 rounded-lg shadow-md shadow-orange-500/50">
                  <Languages className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Languages
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 ml-10">
                <span className="px-3 py-1 bg-pink-950/30 border border-pink-500/30 text-pink-100 rounded-md text-sm font-medium hover:bg-pink-900/40 hover:border-pink-400/50 transition-all">
                  Thai (Native)
                </span>
                <span className="px-3 py-1 bg-orange-950/30 border border-orange-500/30 text-orange-100 rounded-md text-sm font-medium hover:bg-orange-900/40 hover:border-orange-400/50 transition-all">
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
