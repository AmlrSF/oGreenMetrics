import "../styles/globals.css";

import {
  About,
  Hero,
  Calculator,
  Contact,
  Services,
  Navbar,
  Footer,
} from "@/components/showcase";

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      <Hero />
      <Calculator />
      <Services />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
