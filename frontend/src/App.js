import React, { useEffect, useState } from "react";
import createAsciiCanvas from "./asciiCanvas";
import "@fontsource/orbitron/400.css"; 
import "@fontsource/orbitron/700.css"; 
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

const WaveHeading = ({ text }) => (
  <h1>
    {text.split("").map((char, idx) => (
      <span key={idx}>{char}</span>
    ))}
  </h1>
);

const App = () => {
  const [key, setKey] = useState("");
  const [response, setResponse] = useState("");
  const [log, setLog] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // initialize our WebGL ASCII animator
  useEffect(() => {
    const ascii = createAsciiCanvas("ascii-canvas");
    return () => ascii.destroy();
  }, []);

  const isValidKey = (k) => /^[A-V]$/.test(k.toUpperCase());

  const addLog = (msg) => {
    const t = new Date().toLocaleTimeString();
    setLog((prev) => [`[${t}] ${msg}`, ...prev]);
  };

  const handleFetch = async () => {
    const normalized = key.toUpperCase();
    if (!isValidKey(normalized)) {
      setError("Only keys A to V allowed.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/cache/${normalized}`);
      if (!res.ok) throw new Error(res.statusText);
      const text = await res.text();
      addLog(text);
      setResponse(text);
    } catch (e) {
      console.error(e);
      addLog("Fetch error.");
      setResponse("Error contacting backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunSequence = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/cache/run-sequence`);
      if (!res.ok) throw new Error(res.statusText);
      const txt = await res.text();
      addLog(txt);
      setResponse(txt);
    } catch (e) {
      console.error(e);
      addLog("Sequence error.");
      setResponse("Error running sequence.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setLog([]);
    setResponse("");
    setError("");
  };

  return (
    <div className="viewport">
      {/* Background layer: WebGL ASCII animation only */}
      <canvas id="ascii-canvas" className="background-viewport" />

      {/* Foreground layer: your React UI */}
      <div className="foreground-viewport">
        <header>
          <WaveHeading text="Cache Monitor" />
        </header>

        <div className="controls">
          <input
            type="text"
            value={key}
            placeholder="A to V"
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            disabled={loading}
          />
          <button onClick={handleFetch} disabled={loading || !isValidKey(key)}>
            {loading ? "..." : "Fetch"}
          </button>
          <button onClick={handleRunSequence} disabled={loading}>
            Run Sequence
          </button>
          <button onClick={handleClear} disabled={loading || log.length === 0}>
            Clear
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <section className="response-section">
          <h2>Latest</h2>
          <pre className="response">{response}</pre>
        </section>

        <section className="log-section">
          <h2>Log</h2>
          {log.length ? (
            <pre className="log-list">{log.join("\n")}</pre>
          ) : (
            <p>No entries.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default App;
