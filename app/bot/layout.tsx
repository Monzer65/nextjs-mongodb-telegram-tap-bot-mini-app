import type { Metadata } from "next";
import "./bot.css";
import { TelegramProvider } from "../contexts/TelegramProvider";

export const metadata: Metadata = {
  title: "Official Telegram web-app of ScoreBoard by GoalRush",
  description: "Open the App in Telegram Mobile and Go along.",
};

export default function BotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <TelegramProvider>{children}</TelegramProvider>
    </main>
  );
}
