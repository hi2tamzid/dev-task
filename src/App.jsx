import { useEffect } from "react";
import { useNavigate } from "react-router";
import "./App.css";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/google-sheet-table");
  }, []);
  return <></>;
}

export default App;
