import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import { registerLicense } from "@syncfusion/ej2-base";

import { CredentialsProvider } from "./context/CredentialsContext";
const msalInstance = new PublicClientApplication(msalConfig);
const root = ReactDOM.createRoot(document.getElementById("root"));

registerLicense(
  "Mgo+DSMBaFt/QHRqVVhkXVpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF9iS31Sdk1mWntdcX1XRA==;Mgo+DSMBPh8sVXJ0S0J+XE9Ad1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3xSdEZiWXdbc3BWRGFcUw==;ORg4AjUWIQA/Gnt2VVhkQlFacl5JXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0dgWH9WdXdRRWJeVUY=;ODQ5MDQzQDMyMzAyZTM0MmUzMG92bi90SFVENWZQcDhmVlFPcnhTSDFrcVdMTkdneHNuTEx3U3g4UFlZOFk9;ODQ5MDQ0QDMyMzAyZTM0MmUzMFRZNU5pamIvQzJqTUo4ZFhDR3dyb0dpOENyUmVudXd4U1M3LzNUOXVsRlk9;NRAiBiAaIQQuGjN/V0Z+WE9EaFtDVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdERhWn5eeHFWQmNfUk10;ODQ5MDQ2QDMyMzAyZTM0MmUzMEtSUE4rTkFvV1I0Y2ZSbmYzZ0syRWlXRStJVTRSeFBYZzB2Z2JkU2pXZVk9;ODQ5MDQ3QDMyMzAyZTM0MmUzMGxYRzVYSS9WNm5KbWUwamFWN0JzMHNiT0RHalpKYUtOd2dlWThUb0I0bFU9;Mgo+DSMBMAY9C3t2VVhkQlFacl5JXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0dgWH9WdXdRRWRdUEY=;ODQ5MDQ5QDMyMzAyZTM0MmUzMFd2czdLOXgyTVowR2REdktaRklQampHSmtLS2N2NlhuWVlpTXNXdmFDb009;ODQ5MDUwQDMyMzAyZTM0MmUzMEtGWitDNk9qdGZBQTZFbTg5dWVETzJlcmtHMi9qZGp4TTdlOW1IUUVVYzA9;ODQ5MDUxQDMyMzAyZTM0MmUzMEtSUE4rTkFvV1I0Y2ZSbmYzZ0syRWlXRStJVTRSeFBYZzB2Z2JkU2pXZVk9"
);

root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <CredentialsProvider>
        <GoogleOAuthProvider clientId="439238021278-ta6326uf3pqcmkdvevolgp76h8j8aoe9.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </CredentialsProvider>
    </MsalProvider>
  </React.StrictMode>
);
