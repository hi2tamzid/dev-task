import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter} from "react-router";
import AllRoutes from "./routes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  </StrictMode>
);
