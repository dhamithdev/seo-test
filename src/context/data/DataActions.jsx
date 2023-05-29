export const Refetch_Teams_In_Header = (teams) => ({
  type: "REFETCH_TEAMS",
  payload: teams,
});

export const Set_Selected_Team = (id) => ({
  type: "SET_SELECTED_TEAM",
  payload: id,
});
