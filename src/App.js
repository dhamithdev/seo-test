import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import LoginScreen from "./screens/login/LoginScreen";
import RegisterScreen from "./screens/login/RegisterScreen";
import PasswordFScreen from "./screens/login/PasswordFScreen";
import HomeScreen from "./screens/home/HomeScreen";
import UserProfile from "./screens/account/UserProfile";
import ProjectScreen from "./screens/project/ProjectScreen";
import NotFoundScreen from "./screens/404/NotFoundScreen";
import TasksScreen from "./screens/project/tasks/TasksScreen";
import ActivitiesScreen from "./screens/project/activities/ActivitiesScreen";
import TeamScreen from "./screens/team/TeamScreen";
import CreateTeam from "./screens/team/CreateTeam";

import { supabase } from "./supabaseClient";
import { AuthContext } from "./context/auth/AuthContext";
import Header from "./components/header/Header";
import Logo from "./assets/Logo.svg";
import { LoadingOutlined } from "@ant-design/icons";

function App() {
  // const [session, setSession] = useState(null);
  const { session, dispatch } = useContext(AuthContext);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    setSessionLoading(true);

    let sessionInfo = supabase.auth.session();
    dispatch({ type: "LOGIN", payload: sessionInfo });

    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: "LOGIN", payload: session });
    });

    setSessionLoading(false);
  }, [session]);

  const addHeader = (component) => {
    return (
      <>
        <Header />
        {component}
      </>
    );
  };

  // Showing a Splash Screen
  if (!session && sessionLoading)
    return (
      <div className="SpalshScreen">
        <img src={Logo} alt="logo" className="SpalshScreen-logo" />
        <LoadingOutlined />
      </div>
    );

  return (
    <div className="App">
      {/* <Header /> */}

      <Routes>
        <Route
          path="/teams/create"
          element={
            session ? addHeader(<CreateTeam />) : <Navigate to={"/login"} />
          }
        />

        <Route
          path="/user/profile"
          element={
            session ? addHeader(<UserProfile />) : <Navigate to={"/login"} />
          }
        />

        <Route
          path="/teams/:id"
          element={
            session ? addHeader(<TeamScreen />) : <Navigate to={"/login"} />
          }
        />

        <Route
          path="/project/"
          element={
            session ? addHeader(<ProjectScreen />) : <Navigate to={"/login"} />
          }
        >
          <Route index path=":id/tasks" element={<TasksScreen />} />
          <Route path=":id/activities" element={<ActivitiesScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Route>

        <Route
          path="/login"
          element={session ? <Navigate to={"/dashboard"} /> : <LoginScreen />}
        />

        <Route
          path="/register"
          element={
            session ? <Navigate to={"/dashboard"} /> : <RegisterScreen />
          }
        />

        <Route
          path="/forgot-password"
          element={
            session ? <Navigate to={"/dashboard"} /> : <PasswordFScreen />
          }
        />

        <Route
          path="/dashboard"
          element={
            session ? addHeader(<HomeScreen />) : <Navigate to={"/login"} />
          }
        />

        <Route
          path="/"
          element={<Navigate to={session ? "/dashboard" : "/login"} replace />}
        />

        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </div>
  );
}

//app.seochecklist.dev/login
// thilina.guruge232@gmail.com
// Asd12qw34zx56
// thilina1234 (saltcorn password)

export default App;
