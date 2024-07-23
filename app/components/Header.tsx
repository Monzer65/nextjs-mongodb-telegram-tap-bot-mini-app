import HeaderNav from "./HeaderNav";
import { getSession } from "@/app/lib/auth";

const Header = async () => {
  const session = await getSession();
  console.log("session:", session);
  return (
    <header className='sticky top-0 z-50'>
      <HeaderNav session={session} />
    </header>
  );
};

export default Header;
