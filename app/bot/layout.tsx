import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./bot.css";
// import { BalanceStoreProvider } from "@/providers/balance-store-provider";
import { TelegramProvider } from "../contexts/TelegramProvider";
import NavLinks from "../components/NavigationBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coin Stone App/ Bot",
  description: "Open the App in Telegram Mobile and Earn Coin Stone by Tap.",
};

export default function BotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={inter.className}>
      <TelegramProvider>{children}</TelegramProvider>
      <NavLinks />
    </main>
  );
}
