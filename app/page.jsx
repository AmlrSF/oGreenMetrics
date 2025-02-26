import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geist = Geist({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Next.js App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={geist.className}>{children}</body>
    </html>
  );
}
