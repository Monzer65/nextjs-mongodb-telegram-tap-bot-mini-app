import { CounterStoreProvider } from "@/providers/counter-store-provider";
import BotMain from "../components/BotMainPage";
import { TelegramProvider } from "../contexts/TelegramProvider";

const BotPage = () => {
  return (
    <TelegramProvider>
      <CounterStoreProvider>
        <BotMain />
      </CounterStoreProvider>
    </TelegramProvider>
  );
};

export default BotPage;
