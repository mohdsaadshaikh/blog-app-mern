import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store/index.js";
import { ToastContainer } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";

import "react-toastify/dist/ReactToastify.css";

import "quill/dist/quill.core.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

import "nprogress/nprogress.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
    <ToastContainer />
  </Provider>
);
