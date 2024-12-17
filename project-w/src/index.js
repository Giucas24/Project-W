import React from "react";
import ReactDOM from "react-dom/client"; // Import corretto per React 18
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
