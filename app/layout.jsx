import "../styles/globals.css";
import '@tabler/core/dist/css/tabler.min.css';
import "../styles/tabler-overrides.css";

export const metadata = {
  title: "OGreenMetrics",
  description: "Calculate the emission data from enterprises and emissions for site for Scope 1, 2, 3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/core@1.2.0/dist/css/tabler-flags.min.css"
        />
      </head>
      <body className="p-0 m-0 relative font-sans">
        {children}
      </body>
    </html>
  );
}
