import { Route, Routes } from "react-router";
import App from "../App";
import AppLayout from "../components/layout";
import AuthRoute from "./AuthRoute";
import GSheetTable from "../pages/GSheetTable";
import Board from '../components/Board';

export default function AllRoutes() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<AuthRoute />}>
            <Route path="/" element={<App />} />
          </Route>
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/board" element={<Board />} />
          <Route element={<AuthRoute />}>
            <Route path="/" element={<App />} />
          </Route>
          <Route path="/google-sheet-table" element={<GSheetTable />} />
        </Route>
      </Routes>
    </>
  );
}
