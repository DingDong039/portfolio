"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  Loader2,
  MessageCircle,
  X,
} from "lucide-react";
import Image from "next/image";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

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
      console.error("Error sending email:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 from-slate-950 via-orange-950/10 to-slate-950 relative overflow-hidden"
    >
      {/* Decorative Elements - Event horizon glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,170,68,0.5)]">
          Get In Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-linear-to-br from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/50">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Contact Information
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-pink-950/20 rounded-xl border border-pink-500/30 hover:border-pink-400/50 hover:shadow-md hover:shadow-pink-500/20 transition-all">
                  <div className="p-3 bg-linear-to-br from-pink-500 to-red-500 rounded-lg shadow-md shadow-pink-500/50">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-pink-400 font-medium">
                      Email
                    </p>
                    <a
                      href="mailto:watchara.ddev@gmail.com"
                      className="text-white hover:text-pink-400 font-semibold transition-colors"
                    >
                      watchara.ddev@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-orange-950/20 rounded-xl border border-orange-500/30 hover:border-orange-400/50 hover:shadow-md hover:shadow-orange-500/20 transition-all">
                  <div className="p-3 bg-linear-to-br from-orange-500 to-red-500 rounded-lg shadow-md shadow-orange-500/50">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-400 font-medium">
                      Phone
                    </p>
                    <a
                      href="tel:+66657019971"
                      className="text-white hover:text-orange-400 font-semibold transition-colors"
                    >
                      +66 65-701-9971
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-red-950/20 rounded-xl border border-red-500/30 hover:border-red-400/50 hover:shadow-md hover:shadow-red-500/20 transition-all">
                  <div className="p-3 bg-linear-to-br from-red-500 to-pink-500 rounded-lg shadow-md shadow-red-500/50">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-red-400 font-medium">
                      Location
                    </p>
                    <p className="text-white font-semibold">
                      Chatuchak, Bangkok, Thailand
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
              <h4 className="text-lg font-bold mb-4 text-white">
                Connect With Me
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/DingDong039"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-linear-to-br from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-500 hover:to-red-500 transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transform hover:scale-105"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/watchara-tongyodpun-803866313"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-linear-to-br from-pink-600 to-red-600 text-white rounded-xl hover:from-pink-500 hover:to-red-500 transition-all shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 transform hover:scale-105"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
              <h4 className="text-lg font-bold mb-4 text-white">
                Line QR Code
              </h4>
              <div
                onClick={() => setIsQRModalOpen(true)}
                className="bg-linear-to-br from-orange-950/40 to-pink-950/40 p-4 rounded-xl inline-block border-2 border-orange-500/40 cursor-pointer hover:border-orange-400/60 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all"
              >
                <Image
                  src="/LineQR.jpg"
                  alt="Line QR Code"
                  width={160}
                  height={160}
                  className="rounded-lg"
                />
              </div>
              <p className="text-xs text-white/60 mt-2">
                Click to enlarge
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-linear-to-br from-pink-500 to-red-500 rounded-xl shadow-lg shadow-pink-500/50">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Send Me a Message
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-white mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-pink-500/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-400 bg-slate-800/50 text-white placeholder-white/40 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-pink-500/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-400 bg-slate-800/50 text-white placeholder-white/40 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-white mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-pink-500/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-400 bg-slate-800/50 text-white placeholder-white/40 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-white mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-pink-500/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-400 bg-slate-800/50 text-white placeholder-white/40 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-6 py-4 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-orange-500/50 hover:from-orange-400 hover:via-red-400 hover:to-pink-400 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg border border-orange-400/30"
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
                <div className="p-4 bg-green-950/40 border border-green-500/50 rounded-xl shadow-md shadow-green-500/20">
                  <p className="text-green-400 text-center font-semibold">
                    ✓ Message sent successfully!
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl shadow-md shadow-red-500/20">
                  <p className="text-red-400 text-center font-semibold">
                    ✗ Failed to send message. Please try again.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {isQRModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setIsQRModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-linear-to-br from-orange-950/60 to-pink-950/60 p-8 rounded-2xl border-4 border-orange-500/50 shadow-2xl shadow-orange-500/30">
              <button
                onClick={() => setIsQRModalOpen(false)}
                className="absolute -top-4 -right-4 p-2 bg-linear-to-br from-orange-500 to-red-500 cursor-pointer hover:from-orange-400 hover:to-red-400 rounded-full shadow-xl shadow-orange-500/50 transition-all hover:scale-110 z-10"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <Image
                src="/LineQR.jpg"
                alt="Line QR Code - Full Size"
                width={600}
                height={600}
                className="rounded-xl w-full h-auto"
              />
            </div>
            <p className="text-white text-center mt-4 text-sm">
              Scan to add me on Line
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
