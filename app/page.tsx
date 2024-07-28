"use client";

import { useEffect, useState } from "react";
import Main from "./components/Main";
import Script from "next/script";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const webApp = window.Telegram.WebApp;
      const user = webApp.initDataUnsafe?.user;
      setUser(user);
      console.log(user);
    }
  }, []);

  return (
    <>
      <Script src='https://telegram.org/js/telegram-web-app.js' />
      <Main />
    </>
  );
}
