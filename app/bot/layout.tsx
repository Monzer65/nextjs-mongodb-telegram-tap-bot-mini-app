import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./bot.css";
import { CounterStoreProvider } from "@/providers/counter-store-provider";
import { TelegramProvider } from "../contexts/TelegramProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coin Stone App",
  description: "Open the App in Telegram and Earn Coin Stone by Tap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={inter.className}>
      <TelegramProvider>
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </TelegramProvider>
    </main>
  );
}
