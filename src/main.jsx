import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Lenis from "lenis";
import App from "./App";
import "./index.css";

// Lenis smooth scrolling (desktop + mobile). Stored globally so the
// existing anchor helpers can route through it without any API change.
const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
window.__lenis = lenis;

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
