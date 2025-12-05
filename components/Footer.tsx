export default function Footer() {
  return (
    <footer className="from-slate-950 via-purple-950/20 to-slate-950 text-white py-8 px-4 border-t border-orange-500/20 relative overflow-hidden">
      {/* Cosmic glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-orange-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,170,68,0.4)]">
            Watchara Tongyodpun
          </h3>

          <p className="text-white/50 text-sm">
            © 2025 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
