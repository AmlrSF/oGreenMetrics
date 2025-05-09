"use client";

import { IconArrowUp } from "@tabler/icons-react";
import "../styles/globals.css";

import {
  About,
  Hero,
  Calculator,
  Contact,
  Services,
  Navbar,
  Footer,
  Testimonials,
  Partners,
} from "@/components/showcase";

export default function RootLayout({ children }) {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar />
      <Hero />
      <Calculator />
      <Partners />
      <Services />
      <About />
      <Testimonials />
      <Contact />
      <Footer />

      <div
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#333",
          color: "#fff",
          padding: "10px",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        title="Back to Top"
      >
        <IconArrowUp size={24} />
      </div>
    </div>
  );
}
