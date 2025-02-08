import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./global.css";
import { Provider } from "react-redux";
import store from "./features/store";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
