import React from "react";

import { createContext, useReducer } from "react";
import Reducer from "./DataReducer";

const INITIAL_STATE = {
  teams: [],
  selectedTeamId: null,
  projects: [],
  refetchTeams: false,
};

export const DataContext = createContext(INITIAL_STATE);

export const DataContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  return (
    <DataContext.Provider
      value={{
        teams: state.teams,
        selectedTeamId: state.selectedTeamId,
        projects: state.projects,
        refetchTeams: state.refetchTeams,
        dispatch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
