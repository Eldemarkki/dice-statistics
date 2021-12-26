import React from 'react';
import ReactDOM from 'react-dom';
import { AppplicationSetup } from './ApplicationSetup';
import "./index.css";
import "./localization/i18n";

ReactDOM.render(
  <React.StrictMode>
    <AppplicationSetup />
  </React.StrictMode>,
  document.getElementById('root')
);
