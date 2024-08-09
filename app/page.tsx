import Link from "next/link";

export default function Home() {
  return (
    <div>
      Home Page
      <Link href={"/bot"}>Bot</Link>
    </div>
  );
}
