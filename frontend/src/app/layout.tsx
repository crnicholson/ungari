import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "../components/footer";

export const metadata = {
  title: "Ungari",
  description: "Connecting problems with thinkers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
