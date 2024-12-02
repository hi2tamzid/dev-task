import { Navigate, Outlet } from "react-router";

const AuthRoute = ({ redirectPath = "/google-sheet-table" }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
export default AuthRoute;
