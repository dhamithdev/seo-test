import React from "react";

import { createContext, useReducer } from "react";
import Reducer from "./AuthReducer";

const INITIAL_STATE = {
  session: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        session: state.session,
        dispatch: dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
