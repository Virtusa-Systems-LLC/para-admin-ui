export const msalConfig = {
  auth: {
    clientId: "dbfde714-6655-4a6e-a06f-f97d730fb13c",
    authority:
      "https://login.microsoftonline.com/e59fe82b-71b9-444c-b711-9e110679544b", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: "localhost:3000/loggedin",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"],
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "ttps://graph.microsoft.com/v1.0/me",
};
