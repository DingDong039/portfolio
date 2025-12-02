import {
  GraduationCap,
  Award,
  Code,
  Bitcoin,
  Headphones,
  Sparkles
} from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
          About Me
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Introduction */}
          <div className="lg:col-span-2">
            <div className="h-full p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-pink-200 dark:border-pink-900/30 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-pink-200">
                  Hi! I&apos;m Watchara, a Passionate Full-Stack Developer
                </h3>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-pink-100 leading-relaxed text-base">
                <p>
                  <span className="font-bold text-pink-600 dark:text-pink-400">Full-stack developer</span> at
                  <span className="font-bold text-orange-600 dark:text-orange-400"> Probit Solutions</span>,
                  building internal systems for the Thairath Group.
                </p>
                <p>
                  Experienced with <span className="font-semibold">Classic ASP</span> to modern frameworks like
                  <span className="font-bold text-pink-600 dark:text-pink-400"> Angular, Vue .NET Core, and Java Spring Boot</span>.
                  Passionate about solving complex problems and creating scalable solutions.
                </p>
                <p className="flex items-center gap-2 flex-wrap">
                  Outside of work:
                  <span className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400">
                    <Bitcoin className="w-4 h-4" /> Crypto
                  </span>,
                  <span className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-purple-400">
                    <Award className="w-4 h-4" /> Trading
                  </span>,
                  <span className="inline-flex items-center gap-1 font-bold text-pink-600 dark:text-pink-400">
                    <Headphones className="w-4 h-4" /> Tech podcasts
                  </span>, and exploring IT trends.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Education & Certifications */}
          <div className="space-y-6">
            {/* Education Card */}
            <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-pink-200 dark:border-pink-900/30 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg shadow-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-pink-200">
                  Education
                </h3>
              </div>

              <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-xl border-l-4 border-pink-500">
                <h4 className="font-bold text-slate-800 dark:text-pink-200 mb-2 text-sm">
                  Bachelor of Science in Computer Science
                </h4>
                <p className="text-slate-600 dark:text-pink-100 mb-1 text-sm">
                  Nakhon Pathom Rajabhat University
                </p>
                <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                  Aug 2018 – Aug 2022 | GPA: 3.40
                </p>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-orange-200 dark:border-orange-900/30 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg shadow-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-orange-200">
                  Certifications
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border-l-4 border-orange-500">
                  <p className="text-slate-700 dark:text-orange-100 font-medium text-sm">
                    IC3 Digital Literacy Global Standard 5 (GS5)
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border-l-4 border-orange-500">
                  <p className="text-slate-700 dark:text-orange-100 font-medium text-sm">
                    Automate Tester Bootcamp 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
