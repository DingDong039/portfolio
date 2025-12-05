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
    <section id="about" className="py-20 px-4 from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Decorative Elements - Cosmic accretion disk glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,170,68,0.5)]">
          About Me
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Introduction */}
          <div className="lg:col-span-2">
            <div className="h-full p-8 bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl border border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-linear-to-br from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/50">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Hi! I&apos;m Watchara, a Passionate Full-Stack Developer
                </h3>
              </div>

              <div className="space-y-4 text-white/80 leading-relaxed text-base">
                <p>
                  <span className="font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(255,170,68,0.6)]">Full-stack developer</span> at
                  <span className="font-bold text-red-400 drop-shadow-[0_0_8px_rgba(255,102,68,0.6)]"> Probit Solutions</span>,
                  building internal systems for the Thairath Group.
                </p>
                <p>
                  Experienced with <span className="font-semibold">Classic ASP</span> to modern frameworks like
                  <span className="font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(255,170,68,0.6)]"> Angular, Vue .NET Core, and Java Spring Boot</span>.
                  Passionate about solving complex problems and creating scalable solutions.
                </p>
                <p className="flex items-center gap-2 flex-wrap">
                  Outside of work:
                  <span className="inline-flex items-center gap-1 font-bold text-orange-400 drop-shadow-[0_0_8px_rgba(255,170,68,0.6)]">
                    <Bitcoin className="w-4 h-4" /> Crypto
                  </span>,
                  <span className="inline-flex items-center gap-1 font-bold text-red-400 drop-shadow-[0_0_8px_rgba(255,102,68,0.6)]">
                    <Award className="w-4 h-4" /> Trading
                  </span>,
                  <span className="inline-flex items-center gap-1 font-bold text-pink-400 drop-shadow-[0_0_8px_rgba(255,51,102,0.6)]">
                    <Headphones className="w-4 h-4" /> Tech podcasts
                  </span>, and exploring IT trends.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Education & Certifications */}
          <div className="space-y-6">
            {/* Education Card */}
            <div className="p-6 bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl border border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-linear-to-br from-pink-500 to-red-500 rounded-lg shadow-lg shadow-pink-500/50">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Education
                </h3>
              </div>

              <div className="p-4 bg-pink-950/20 rounded-xl border-l-4 border-pink-500">
                <h4 className="font-bold text-white mb-2 text-sm">
                  Bachelor of Science in Computer Science
                </h4>
                <p className="text-white/70 mb-1 text-sm">
                  Nakhon Pathom Rajabhat University
                </p>
                <p className="text-xs text-pink-400 font-medium">
                  Aug 2018 – Aug 2022 | GPA: 3.40
                </p>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="p-6 bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl border border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-linear-to-br from-orange-500 to-red-500 rounded-lg shadow-lg shadow-orange-500/50">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Certifications
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-orange-950/20 rounded-lg border-l-4 border-orange-500">
                  <p className="text-white/80 font-medium text-sm">
                    IC3 Digital Literacy Global Standard 5 (GS5)
                  </p>
                </div>
                <div className="p-3 bg-orange-950/20 rounded-lg border-l-4 border-orange-500">
                  <p className="text-white/80 font-medium text-sm">
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
