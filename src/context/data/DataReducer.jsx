const Reducer = (state, action) => {
  switch (action.type) {
    case "STORE_TEAMS":
      return {
        teams: [...action.payload],
      };
    case "SET_SELECTED_TEAM":
      return {
        selectedTeamId: action.payload,
      };
    case "REFETCH_TEAMS":
      return {
        refetchTeams: !state.refetchTeams,
      };
    default:
      return state;
  }
};

export default Reducer;
