import BotMain from "../components/BotMainPage";
import { TelegramProvider } from "../contexts/TelegramProvider";

const BotPage = () => {
  return (
    <TelegramProvider>
      <BotMain />
    </TelegramProvider>
  );
};

export default BotPage;
