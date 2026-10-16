import { useState } from "react";

import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import reactLogo from "./assets/react.svg";

import "./App.css";

const viteLogo = "/vite.svg";

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");

  const loadName = async () => {
    try {
      const response = await fetch("/api/");
      const data: unknown = await response.json();
      if (
        typeof data === "object" &&
        data !== null &&
        "name" in data &&
        typeof data.name === "string"
      ) {
        setName(data.name);
      }
    } catch {
      setName("unavailable");
    }
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
          Edit <code>src/react-app/application.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          type="button"
          onClick={() => {
            void loadName();
          }}
          aria-label="get name"
        >
          Name from API is: {name}
        </button>
        <p>
          Edit <code>worker/index.ts</code> to change the name
        </p>
      </div>
      <p className="read-the-docs">Click on the logos to learn more</p>
    </>
  );
};

export default App;
