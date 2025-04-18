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
  return (
    <div>
      <Navbar />
      <Hero />
      <Calculator />
      <Partners/>
      <Services />
      <About />
      <Testimonials/>
      <Contact />
      <Footer />
    </div>
  );
}
