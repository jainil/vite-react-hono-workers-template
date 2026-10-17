import { useState } from "react";

import cloudflareLogo from "../../../assets/Cloudflare_Logo.svg";
import honoLogo from "../../../assets/hono.svg";
import reactLogo from "../../../assets/react.svg";
import { getGreeting } from "../../../shared/api/generated/client";

import "./home-page.css";

const viteLogo = "/vite.svg";

const HomePage = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetGreeting = async () => {
    setIsLoading(true);
    try {
      const greeting = await getGreeting();
      setName(greeting.name);
    } catch {
      setName("unavailable");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://hono.dev/" target="_blank" rel="noreferrer">
          <img src={honoLogo} className="logo cloudflare" alt="Hono logo" />
        </a>
        <a
          href="https://workers.cloudflare.com/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={cloudflareLogo}
            className="logo cloudflare"
            alt="Cloudflare logo"
          />
        </a>
      </div>
      <h1>Vite + React + Hono + Cloudflare</h1>
      <div className="card">
        <button
          type="button"
          onClick={() => {
            setCount((previousCount) => previousCount + 1);
          }}
          aria-label="increment"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/react-app/features/home/pages/home-page.tsx</code> and
          save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          type="button"
          onClick={() => {
            void handleGetGreeting();
          }}
          disabled={isLoading}
          aria-label="get name"
        >
          Name from API is: {name}
        </button>
        <p>
          Edit <code>worker/features/greeting/routes.ts</code> to change the
          name
        </p>
      </div>
      <p className="read-the-docs">Click on the logos to learn more</p>
    </>
  );
};

export default HomePage;
