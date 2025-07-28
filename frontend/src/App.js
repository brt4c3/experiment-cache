import React, { useState } from "react";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [key, setKey] = useState("");
  const [response, setResponse] = useState("");
  const [log, setLog] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidKey = (key) => ["A", "B", "C"].includes(key.toUpperCase());

  const fetchCache = async () => {
    const normalizedKey = key.toUpperCase();
    if (!isValidKey(normalizedKey)) {
      setError("Only keys A, B, or C are allowed.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/${normalizedKey}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.text();
      const time = new Date().toLocaleTimeString();
      setLog((prev) => [`[${time}] ${data}`, ...prev]);
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse("Error contacting backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Cache Monitor</h1>
      <input
        type="text"
        value={key}
        placeholder="Enter key (A, B, or C)"
        onChange={(e) => setKey(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && fetchCache()}
        autoFocus
      />
      <button onClick={fetchCache} disabled={loading || !key}>
        {loading ? "Loading..." : "Fetch"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Response:</h2>
      <p>{response}</p>
      <h2>Log:</h2>
      <pre>{log.join("\n")}</pre>
    </div>
  );
}

export default App;
