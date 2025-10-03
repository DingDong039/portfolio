import type { Metadata } from "next";
import { Kanit, Inter } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Watchara Tongyodpun - Full Stack Developer | Portfolio",
    template: "%s | Watchara Tongyodpun"
  },
  description: "Professional portfolio of Watchara Tongyodpun (วัชระ ทองยอดพันธ์) - Full Stack Developer specializing in React, Next.js, TypeScript, and modern web development. View my projects, skills, and get in touch.",
  keywords: ["Watchara Tongyodpun", "วัชระ ทองยอดพันธ์", "Full Stack Developer", "React Developer", "Next.js", "TypeScript", "Web Development", "Portfolio", "Frontend Developer", "Backend Developer", "Thai Developer"],
  authors: [{ name: "Watchara Tongyodpun" }],
  creator: "Watchara Tongyodpun",
  publisher: "Watchara Tongyodpun",
  metadataBase: new URL('https://portfolio-sigma-ashy-51.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portfolio-sigma-ashy-51.vercel.app/',
    title: 'Watchara Tongyodpun - Full Stack Developer | Portfolio',
    description: 'Professional portfolio showcasing web development projects, technical skills, and contact information of Watchara Tongyodpun.',
    siteName: 'Watchara Tongyodpun Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Watchara Tongyodpun - Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watchara Tongyodpun - Full Stack Developer | Portfolio',
    description: 'Professional portfolio showcasing web development projects, technical skills, and contact information.',
    creator: '@watchara',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${kanit.variable} ${inter.variable} antialiased font-sans`}
        style={{ fontFamily: 'var(--font-inter), var(--font-kanit), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
