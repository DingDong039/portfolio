"use client";

import Image from "next/image";
import { Github, Linkedin, Mail, Download, ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Profile Image with Animation */}
        <div className="mb-8 relative w-48 h-48 mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/profile.jpg"
              alt="Watchara Tongyodpun"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Greeting Badge */}
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200 dark:border-blue-800">
            👋 Welcome to my portfolio
          </span>
        </div>

        {/* Name with Gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 px-4">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient inline-block pb-2">
            Watchara Tongyodpun
          </span>
        </h1>

        {/* Role with Typing Effect Visual */}
        <div className="mb-6">
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Full-Stack Developer
          </p>
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed px-4">
          Building
          <span className="text-blue-600 dark:text-blue-400 font-semibold"> scalable</span> and
          <span className="text-purple-600 dark:text-purple-400 font-semibold"> efficient</span> solutions
          for modern business challenges
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href="https://github.com/DingDong039"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl hover:bg-slate-800 dark:hover:bg-white hover:text-white dark:hover:text-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/watchara-tongyodpun-803866313"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 bg-white dark:bg-slate-800 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <button
            onClick={scrollToContact}
            className="group p-4 bg-white dark:bg-slate-800 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Mail className="w-6 h-6" />
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={scrollToContact}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Get In Touch
          </button>
          <a
            href="/CV_WATCHARA_TONGYODPUN.pdf"
            download
            className="group px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-semibold border-2 border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download CV
          </a>
        </div>
      </div>

      {/* Scroll Indicator - Outside main container */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors animate-bounce"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="w-8 h-8" />
      </button>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
