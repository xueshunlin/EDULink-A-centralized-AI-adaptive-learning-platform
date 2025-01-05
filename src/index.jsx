import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import  UserProvider from './UserContext';
// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import "./index.css";


import { Ripple, initMDB } from 'mdb-ui-kit/js/mdb.es.min.js'; // Import needed modules

window.Ripple = Ripple;

initMDB({ Ripple }) // Initialize imported modules to enable data-attribute init

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
