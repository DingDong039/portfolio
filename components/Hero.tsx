"use client";

import Image from "next/image";
import { Github, Linkedin, Mail, ChevronDown } from "lucide-react";
import ThreeBackground from "./ThreeBackground";

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Three.js 3D Background */}
      <ThreeBackground />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
        {/* Profile Image */}
        <div className="relative w-40 h-40 mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/80 dark:border-pink-200/80 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/profile.jpg"
              alt="Watchara Tongyodpun"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold">
          <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
            Watchara Tongyodpun
          </span>
        </h1>

        {/* Role */}
        <p className="text-2xl md:text-3xl font-semibold text-white/90">
          Full-Stack Developer
        </p>

        {/* Tagline */}
        <div className="max-w-2xl mx-auto space-y-2 px-4">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            Crafting
            <span className="text-pink-400 font-bold"> scalable</span> and
            <span className="text-orange-400 font-bold"> efficient</span> solutions
          </p>
          <p className="text-base md:text-lg text-white/70">
            Passionate about
            <span className="text-pink-400 font-semibold"> innovation</span> and
            <span className="text-orange-400 font-semibold"> continuous learning</span>
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-3">
          <a
            href="https://github.com/DingDong039"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/10 hover:bg-pink-500 text-white rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/watchara-tongyodpun-803866313"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/10 hover:bg-orange-500 text-white rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <button
            onClick={scrollToContact}
            className="p-3 bg-white/10 hover:bg-pink-500 text-white rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={scrollToContact}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
          >
            Get In Touch
          </button>
          <a
            href="/CV_WATCHARA_TONGYODPUN.pdf"
            download
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            Download CV
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
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
