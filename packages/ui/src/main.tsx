import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { Provider, Toaster } from "./components/ui";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <Toaster />
      <App />
    </Provider>
  </React.StrictMode>
);
