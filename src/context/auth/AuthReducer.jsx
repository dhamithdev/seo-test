const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        session: action.payload,
      };
    case "LOGOUT":
      return {
        session: null,
      };
    default:
      return state;
  }
};

export default Reducer;
