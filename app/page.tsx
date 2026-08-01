import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      {/* dossier atmosphere + chrome layers */}
      <div className="dossier-grid" aria-hidden="true" />
      <ScrollProgress />
      <Navigation />

      <main id="main" className="relative z-[var(--z-content)]">
        <Hero />
        <Work />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
