import Balance from "@/app/components/Balance";
import NavLinks from "@/app/components/NavigationBar";

export default async function ClickerPage() {
  return (
    <main className='grid min-h-screen'>
      <Balance />
      <NavLinks />
    </main>
  );
}
