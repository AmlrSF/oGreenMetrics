import "../styles/globals.css";
import '@tabler/core/dist/css/tabler.min.css';
import "../styles/tabler-overrides.css";
import { NotificationProvider } from "@/components/Commun/context/NotificationContext";
export const metadata = {
  title: "OGreenMetrics",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className="p-0 m-0 relative font-sans">
        <NotificationProvider>
          {children} 
        </NotificationProvider>
      </body>
    </html>
  );
}
