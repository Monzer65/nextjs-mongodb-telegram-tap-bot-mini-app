import Balance from "@/app/components/Balance";
import NavLinks from "@/app/components/NavigationBar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function ClickerPage() {
  return (
    <main className='grid min-h-screen'>
      <Balance />
      <NavLinks />
    </main>
  );
}
