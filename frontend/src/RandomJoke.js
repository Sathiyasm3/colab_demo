import React, { useState } from "react";

function RandomJoke() {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    setJoke("");
    try {
      const res = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode");
      const data = await res.json();
      if (data.type === "single") {
        setJoke(data.joke);
      } else if (data.type === "twopart") {
        setJoke(`${data.setup}\n${data.delivery}`);
      } else {
        setJoke("No joke found.");
      }
    } catch (e) {
      setJoke("Failed to fetch joke.");
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:400, margin:"auto", textAlign:"center"}}>
      <h2>Random Joke Generator</h2>
      <button onClick={fetchJoke} disabled={loading}>
        {loading ? "Loading..." : "Get Joke"}
      </button>
      <pre style={{whiteSpace:"pre-wrap", marginTop:16}}>{joke}</pre>
    </div>
  );
}

export default RandomJoke;