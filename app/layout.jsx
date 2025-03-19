import "../styles/globals.css";
import '@tabler/core/dist/css/tabler.min.css';
import "../styles/tabler-overrides.css";

export const metadata = {
  title: "OGreenMetrics",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className="p-0 m-0 relative font-sans">
        {children}
      </body>
    </html>
  );
}
