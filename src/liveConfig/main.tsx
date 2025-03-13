import * as React from "react";
import * as ReactDOM from "react-dom/client";
import LiveConfig from "./LiveConfig";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LiveConfig />
  </React.StrictMode>,
);
