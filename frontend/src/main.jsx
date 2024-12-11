import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/userContext.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
createRoot(document.getElementById("root")).render(
  <Router>
    <Provider store={store}>
      <UserProvider>
        <App />
      </UserProvider>
    </Provider>
    <Toaster />
  </Router>
);
