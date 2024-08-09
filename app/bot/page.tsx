import Coin from "../components/Coin";
import NavLinks from "../components/NavigationBar";
// import Header from "../components/Header";
import { getCoins } from "../lib/initData";

const BotPage = async () => {
  const initialCoins = await getCoins(1);
  console.log(initialCoins);
  return (
    <div className='bg-gray-800'>
      {/* <Header /> */}
      <Coin />
      {/* <BotMain /> */}
      <NavLinks />
    </div>
  );
};

export default BotPage;
