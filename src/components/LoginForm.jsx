import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export default function LoginForm({ setToken }) {
  const navigate = useNavigate();
  const handleLogin = useGoogleLogin({
    onSuccess: (response) => {
      try {
        // Extract the access token from the response
        const { access_token } = response;
        setToken(access_token);
        // navigate("/google-sheet-table");

        // Store the access token
        localStorage.setItem("token", access_token);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    onError: (error) => {
      console.error("Login Error:", error);
    },
    scope:
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive",
  });
  return (
    <div className="container grid place-items-center h-screen">
      {" "}
      <div className="flex flex-col gap-6 py-4 px-6 shadow-sm border">
        <h1 className="font-semibold">Sign in with your google account</h1>
        <Button onClick={handleLogin}>Log in with google</Button>
      </div>
    </div>
  );
}
