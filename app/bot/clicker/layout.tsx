import type { Metadata } from "next";
import "./clicker.css";
import QUeryProviders from "@/app/contexts/QueryProvider";

export const metadata: Metadata = {
  title: "telegram clicker mini game for ScoreBoard of GoalRush app",
  description: "Open the App in Telegram Mobile and Earn by Tap.",
};

export default function BotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <QUeryProviders>{children}</QUeryProviders>
    </main>
  );
}
