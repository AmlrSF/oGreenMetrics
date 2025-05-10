import "../styles/globals.css";
import "@tabler/core/dist/css/tabler.min.css";
import "../styles/tabler-overrides.css";
import { NotificationProvider } from "@/components/Commun/context/NotificationContext";
export const metadata = {
  title: "OGreenMetrics – Carbon Footprint Tracking & ESG Insights",
  description:
    "OGreenMetrics helps companies calculate their carbon footprint, track sustainability progress, and align with ESG goals through powerful dashboards and reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="OGreenMetrics helps companies calculate their carbon footprint, track sustainability progress, and align with ESG goals through powerful dashboards and reports."
        />
        <meta
          name="keywords"
          content="carbon footprint, ESG, sustainability tracking, CO2 emissions, climate reporting, green metrics, environmental goals"
        />
        <meta name="author" content="OGreenMetrics" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/core@1.2.0/dist/css/tabler-flags.min.css"
        />
        <title>OGreenMetrics – Carbon Footprint Tracking</title>
      </head>
      <body className="p-0 m-0 relative font-sans">
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
