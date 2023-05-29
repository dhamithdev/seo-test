import React, { useEffect } from "react";
import "./projectScreen.css";

import { Outlet, NavLink, useSearchParams, useParams } from "react-router-dom";

// import Header from "../../components/header/Header";

function ProjectScreen() {
  useEffect(() => {
    document.title = "Projects - SEO Checklist";
  }, []);

  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  let urlParams = useParams();

  return (
    <div className="ProjectScreen">
      {/* <Header /> */}

      <div className="ProjectScreen-header">
        <div>
          <NavLink
            to={`/project/${urlParams.id}/tasks`}
            // className="ProS-h-btn ProS-h-btn-active"
            className={({ isActive }) =>
              `ProS-h-btn ${!filter && isActive && "ProS-h-btn-active"}`
            }
          >
            Tasks
          </NavLink>

          {/* <NavLink
            to={`/project/${urlParams.id}/tasks?filter=my`}
            className={({ isActive }) =>
              `ProS-h-btn ${isActive && filter === "my" && "ProS-h-btn-active"}`
            }
          >
            My Tasks
          </NavLink> */}

          <NavLink
            to={`/project/${urlParams.id}/activities`}
            className={({ isActive }) =>
              `ProS-h-btn ${isActive && "ProS-h-btn-active"}`
            }
          >
            Activities
          </NavLink>
        </div>

        {/* <div>
          <SettingOutlined />
        </div> */}
      </div>

      <Outlet />
    </div>
  );
}

export default ProjectScreen;
