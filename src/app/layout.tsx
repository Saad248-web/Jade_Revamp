import type { Metadata } from "next";
import { Philosopher, Manrope } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Providers from "./providers";

const philosopher = Philosopher({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-philosopher",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Jade Hospitainment",
  description: "Step into the world of Jade Hospitainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          philosopher.variable,
          manrope.variable,
          "font-manrope antialiased",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
