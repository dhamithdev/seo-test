export const Login = (session) => ({
  type: "LOGIN",
  payload: session,
});

export const Logout = () => ({
  type: "LOGOUT",
});
