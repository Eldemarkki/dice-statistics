import React from 'react';
import { createRoot } from "react-dom/client";
import { ApplicationSetup } from './ApplicationSetup';
import "./index.css";

const rootElement = document.getElementById("root") ?? document.createElement("div");

const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <ApplicationSetup />
  </React.StrictMode>
);
