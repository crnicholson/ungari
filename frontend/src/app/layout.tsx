import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "../components/footer";
import localFont from "next/font/local";

const tiemposBlack = localFont({
  src: "../../public/TiemposHeadline-Black.otf",
  display: "swap",
  weight: "200 700",
  style: "normal",
  variable: "--tiempos-black",
});

const tiemposLight = localFont({
  src: "../../public/TiemposHeadline-Light.otf",
  display: "swap",
  weight: "200 700",
  style: "normal",
  variable: "--tiempos-light",
});

const tiempos = localFont({
  src: "../../public/TiemposHeadline-Regular.otf",
  display: "swap",
  weight: "200 700",
  style: "normal",
  variable: "--tiempos",
});

export const metadata = {
  title: "Ungari",
  description: "Connecting problems with thinkers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${tiemposBlack.variable} ${tiemposLight.variable} ${tiempos.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <Analytics />
        <SpeedInsights />
      </head>
      <UserProvider>
        <body className="antialiased vsc-initialized text-[--primary] min-h-screen w-full bg-[--bg] flex flex-col justify-center items-center">
          {children}
          <Footer />
        </body>
      </UserProvider>
    </html>
  );
}
