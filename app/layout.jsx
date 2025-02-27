import "../styles/globals.css";
import '@tabler/core/dist/css/tabler.min.css';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "OGreenMetrics",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${montserrat.className} p-0 m-0 relative`}
      >
        {children}
      </body>
    </html>
  );
}
