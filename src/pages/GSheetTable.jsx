import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import GoogleSheetTable from "../components/GoogleSheetTable";
import LoginForm from "../components/LoginForm";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const GSheetTable = () => {
  const accessToken = localStorage.getItem("token");
  const [token, setToken] = useState(accessToken);
  const [hasClientId, setHasClientId] = useState(false);
  const cachedClientId = localStorage.getItem("client-id");
  const [clientId, setClientId] = useState(cachedClientId);

  useEffect(() => {
    setToken(accessToken);
  }, [accessToken]);

  const handleClientId = (e) => {
    setClientId(e.target.value);
  };
  const sendToLoginPage = () => {
    localStorage.setItem("client-id", clientId);
    setHasClientId(true);
    setToken("");
  };
  return (
    <>
      {token ? (
        <GoogleSheetTable
          setHasClientId={setHasClientId}
          setToken={setToken}
          token={token}
        />
      ) : (
        <div>
          {!hasClientId ? (
            <div className="h-screen w-full grid place-items-center">
              <div className="w-full max-w-[400px] space-y-8 px-4">
                <div>
                  <Label>Client Id</Label>
                  <Input
                    placeholder="Your Client ID"
                    value={clientId ?? ""}
                    onChange={handleClientId}
                  />
                  <small>
                    Kindly enter a valid client ID, as it&apos;s required to log
                    in.
                  </small>
                </div>
                <div>
                  <Button
                    disabled={!clientId}
                    onClick={sendToLoginPage}
                    className="w-full"
                  >
                    Set Client Id
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <GoogleOAuthProvider clientId={clientId}>
              <LoginForm setToken={setToken} />
            </GoogleOAuthProvider>
          )}
        </div>
      )}
    </>
  );
};

export default GSheetTable;
