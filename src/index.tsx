import React from 'react';
import { createRoot } from "react-dom/client";
import { AppplicationSetup } from './ApplicationSetup';
import "./index.css";
import "./localization/i18n";

const rootElement = document.getElementById("root") ?? document.createElement("div");

const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <AppplicationSetup />
  </React.StrictMode>
);
