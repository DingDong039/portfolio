"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Loader2, Sparkles, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 px-4 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
          Get In Touch
        </h2>
        <div className="flex justify-center mb-12">
          <Sparkles className="w-8 h-8 text-pink-500" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-200 dark:border-pink-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-pink-200">
                  Contact Information
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-xl border border-pink-200 dark:border-pink-800 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg shadow-md">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">Email</p>
                    <a
                      href="mailto:watchara.ddev@gmail.com"
                      className="text-slate-800 dark:text-pink-100 hover:text-pink-600 dark:hover:text-pink-300 font-semibold"
                    >
                      watchara.ddev@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl border border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg shadow-md">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Phone</p>
                    <a
                      href="tel:+66657019971"
                      className="text-slate-800 dark:text-orange-100 hover:text-orange-600 dark:hover:text-orange-300 font-semibold"
                    >
                      +66 65-701-9971
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30 rounded-xl border border-pink-200 dark:border-pink-800 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg shadow-md">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">Location</p>
                    <p className="text-slate-800 dark:text-pink-100 font-semibold">Chatuchak, Bangkok, Thailand</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-200 dark:border-pink-900/30">
              <h4 className="text-lg font-bold mb-4 text-slate-800 dark:text-pink-200">
                Connect With Me
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/DingDong039"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/watchara-tongyodpun-803866313"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-200 dark:border-pink-900/30">
              <h4 className="text-lg font-bold mb-4 text-slate-800 dark:text-pink-200">
                Line QR Code
              </h4>
              <div className="bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-950/30 dark:to-orange-950/30 p-4 rounded-xl inline-block border-2 border-pink-300 dark:border-pink-700">
                <Image
                  src="/LineQR.jpg"
                  alt="Line QR Code"
                  width={160}
                  height={160}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-200 dark:border-pink-900/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl shadow-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-pink-200">
                Send Me a Message
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-pink-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-pink-200 dark:border-pink-800 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-pink-100 transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-pink-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-pink-200 dark:border-pink-800 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-pink-100 transition-all"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-pink-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-pink-200 dark:border-pink-800 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-pink-100 transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-pink-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-pink-200 dark:border-pink-800 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-pink-100 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl hover:from-pink-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              {status === "success" && (
                <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-xl">
                  <p className="text-green-700 dark:text-green-300 text-center font-semibold">
                    ✓ Message sent successfully!
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl">
                  <p className="text-red-700 dark:text-red-300 text-center font-semibold">
                    ✗ Failed to send message. Please try again.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
