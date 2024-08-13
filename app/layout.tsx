import type { Metadata } from "next";
import "./globals.css";
import { merriWeatherForBody } from "./lib/fonts";

export const metadata: Metadata = {
  title: "ScoreBoard App By GoalRush",
  description: "The leading Telegram web-app for Sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={merriWeatherForBody.className}>{children}</body>
    </html>
  );
}
