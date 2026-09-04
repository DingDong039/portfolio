import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk, JetBrains_Mono, Kanit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Archivo — display. Wide grotesque with strong weight contrast; not on the
// reflex-reject list and reads as a technical/specimen display, not "designy".
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://portfolio-sigma-ashy-51.vercel.app/";

export const metadata: Metadata = {
  title: {
    default: "Watchara Tongyodpun — Full-Stack Developer",
    template: "%s — Watchara Tongyodpun",
  },
  description:
    "Full-stack developer with 4+ years building enterprise applications across modern and legacy stacks — C#, ASP.NET, Spring Boot, finance workflows, and system modernization. Selected work and skills.",
  keywords: [
    "Watchara Tongyodpun",
    "วัชระ ทองยอดพันธ์",
    "Full-Stack Developer",
    "C#",
    "ASP.NET",
    "Spring Boot",
    "Angular",
    "Vue",
    "TypeScript",
    "Enterprise Applications",
    "Portfolio",
    "Thai Developer",
  ],
  authors: [{ name: "Watchara Tongyodpun" }],
  creator: "Watchara Tongyodpun",
  publisher: "Watchara Tongyodpun",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Watchara Tongyodpun — Full-Stack Developer",
    description:
      "Full-stack developer building systems across Angular, Vue, .NET, and Java Spring Boot. Selected work and skills.",
    siteName: "Watchara Tongyodpun",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Watchara Tongyodpun — Developer Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Watchara Tongyodpun — Full-Stack Developer",
    description: "Full-stack developer. Selected work, skills, and contact.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#23211c" },
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${hanken.variable} ${jetbrains.variable} ${kanit.variable}`}
    >
      <body className="antialiased">
        {/* Resolve theme before paint to avoid a wrong-theme flash. Reads the
            explicit choice from localStorage, otherwise follows the system
            preference. The `.dark`/`.light` class it sets wins over the CSS
            media-query fallback in globals.css. Must be the first element in
            <body>: a direct child of <html> or a React-rendered <head> script
            raises React errors and never executes on the client. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);}catch(e){}})();`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--ink)] focus:text-[var(--paper)] focus:rounded-md focus:border-2 focus:border-[var(--signal)]"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
