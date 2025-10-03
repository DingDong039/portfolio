export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About Me
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Professional Summary
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Software developer specializing in full-stack development, designing and implementing
              scalable solutions for business applications. Proficient in both modern and legacy
              systems, with expertise in various programming languages and frameworks.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Strong focus on efficiency, problem-solving, and continuous improvement. Passionate about
              adopting new technologies and driving innovative system enhancements.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
              Education & Certifications
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                  Bachelor of Science in Computer Science
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Nakhon Pathom Rajabhat University
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Aug 2018 – Aug 2022 | GPA: 3.40
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                  Certifications
                </h4>
                <ul className="text-slate-600 dark:text-slate-400 text-sm mt-2 space-y-1">
                  <li>• IC3 Digital Literacy Global Standard 5 (GS5)</li>
                  <li>• Automate Tester Bootcamp 2025</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-slate-800 dark:text-slate-200">
            Soft Skills
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["Problem Solving", "Adaptability", "Time Management", "Teamwork", "Research"].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
