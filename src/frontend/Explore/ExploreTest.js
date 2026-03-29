import React from "react";

export default function ExploreTest() {
  return (
    <div style={{ padding: "50px", background: "#02060f", color: "white", minHeight: "100vh" }}>
      <h1>Explore Page Working! ✅</h1>
      <p>If you see this, the routing is working correctly.</p>
      <button onClick={() => window.navigateTo && window.navigateTo('home')}>
        Go Back to Home
      </button>
    </div>
  );
}
