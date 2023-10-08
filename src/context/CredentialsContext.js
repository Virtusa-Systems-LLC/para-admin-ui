import { createContext, useReducer } from "react";
const CredentialsContext = createContext();

const initialState = {
  aws: {
    accessKey: "",
    secretKey: "",
  },
  app: {
    accessKey: "app:para",
    secretKey: "Z8O6DXSTrY0Yyhgvs3lPbytFTprijIUIPXAndJbLUWnaUYWG/B81xw==",
    // accessKey: "app:vcp-skan-cm-ui-skan-ai",
    // secretKey: "6rbGagtDQNv90HU4cKP+IwI6MFOsDn/mZLynLfeXm3xZ6dnbloaRrQ==",
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "awsCredentialsUpdate":
      return {
        ...state,
        aws: action.payload,
      };
    case "appCredentialsUpdate":
      return {
        ...state,
        app: action.payload,
      };

    default:
      return state;
  }
};

const CredentialsProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CredentialsContext.Provider
      value={{
        aws: state.aws,
        app: state.app,
        dispatch,
        bearer_token: state.bearer_token,
      }}
    >
      {props.children}
    </CredentialsContext.Provider>
  );
};

export { CredentialsProvider };
export default CredentialsContext;
