import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
// eslint-disable-next-line react-hooks/exhaustive-deps
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
