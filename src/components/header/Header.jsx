import React, { useState, useEffect, useContext } from "react";
import "./header.css";

import { useNavigate } from "react-router-dom";
import { Menu, Dropdown, Space, Avatar, Badge, Spin } from "antd";
import {
  DownOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";

import { supabase } from "../../supabaseClient";
import Logo from "../../assets/Logo.svg";
import Notification from "./Notification";
import { AuthContext } from "../../context/auth/AuthContext";
import { DataContext } from "../../context/data/DataContext";
// import { AuthContext } from "../../context/auth/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { session } = useContext(AuthContext);
  const { refetchTeams } = useContext(DataContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teamsData, setTeamsData] = useState([]);
  const [areTeamsFetching, setAreTeamsFetching] = useState(true);
  const [inviationData, setInviationData] = useState([]);

  const signOut = () => {
    console.log("Logout");
    supabase.auth.signOut();
  };

  useEffect(() => {
    let isActive = true;
    setAreTeamsFetching(true);

    async function fetchData() {
      const { data, error } = await supabase
        .from("team_users")
        .select(
          `
        team_id(
          project:project_team_id_fkey(
            id,
            name,
            is_archived
          ),
          name,
          id
        )
        `
        )
        .match({ user_id: session.user.id });

      if (error) {
        console.log(error);
      } else {
        console.log("Header Data Fecthed");
        console.log(data);

        if (isActive) {
          setTeamsData([...data]);
        }
      }
    }

    fetchData().finally(() => {
      setAreTeamsFetching(false);
    });

    return () => {
      isActive = false;
    };
  }, [refetchTeams]);

  // Fetch Team Invitations
  useEffect(() => {
    let active = true;

    async function fetch_invitations() {
      const { data, error } = await supabase
        .from("team_users_pending")
        .select()
        .match({ email: session.user.email });

      if (error) {
        console.log(error);
      } else {
        console.log("Invitations Fetched!");
        console.log(data);
        if (active) setInviationData(data);
      }
    }

    fetch_invitations();

    return () => {
      active = false;
    };
  }, []);

  // const projects = (
  //   <Menu
  //     onClick={({ key }) => navigate(`/project/${key}/tasks`)}
  //     className="overlay projects-overlay"
  //     itemIcon={<FolderOutlined />}
  //     items={[
  //       {
  //         label: "GCE Golf SEO",
  //         key: "1",
  //       },
  //       {
  //         label: "Home Lands Holding (PVT) Ltd",
  //         key: "2",
  //       },
  //       {
  //         label: "Home Lands SkyLine",
  //         key: "3",
  //       },
  //     ]}
  //   />
  // );

  const ManageAccount = (
    <Menu
      className="overlay account-overlay"
      items={[
        {
          type: "group",
          label: "Manage Account",
          className: "teams-overlay-group",
        },
        {
          label: "Profile",
          key: "1",
          onClick: () => navigate("/user/profile"),
        },
        {
          label: "Billing [BETA]",
          key: "2",
          disabled: true,
        },
        {
          type: "divider",
        },
        {
          label: "Log Out",
          key: "3",
          style: { color: "red" },
          onClick: signOut,
        },
      ]}
    />
  );

  return (
    <div className="Header">
      <div className="hdr-left">
        <img
          src={Logo}
          alt="Logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard", { replace: true })}
        />

        {/* <Dropdown
          overlay={projects}
          trigger={"click"}
          overlayStyle={{
            borderRadius: "10px",
          }}
        >
          <div
            className="hdr-dropdown-btn res-header-btns"
            onClick={(e) => e.preventDefault()}
          >
            <Space>
              Projects
              <DownOutlined />
            </Space>
          </div>
        </Dropdown> */}
      </div>

      <div className="hdr-right">
        <Dropdown
          // overlay={Teams}
          overlay={<TeamsDropdown navigate={navigate} teamsData={teamsData} />}
          trigger={"click"}
          overlayStyle={{
            borderRadius: "10px",
          }}
        >
          <div
            className="hdr-dropdown-btn res-header-btns"
            onClick={(e) => e.preventDefault()}
          >
            <Space>
              {areTeamsFetching && (
                <Spin size="small" style={{ marginRight: "5px" }} />
              )}
              Teams
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>

        {/* ----- Notification ----- */}
        {inviationData.length !== 0 && (
          <Dropdown
            overlay={<Notification inviationData={inviationData} />}
            trigger="click"
          >
            <Badge
              count={inviationData.length}
              status="processing"
              style={{ cursor: "pointer" }}
            >
              <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Badge>
          </Dropdown>
        )}

        <Dropdown
          overlay={ManageAccount}
          trigger={"click"}
          overlayStyle={{
            borderRadius: "10px",
          }}
        >
          <Avatar
            icon={<UserOutlined />}
            style={{ cursor: "pointer" }}
            className="res-header-btns"
          />
        </Dropdown>

        <div className="hdr-right-menuIcon">
          {!sidebarOpen && (
            <MenuOutlined onClick={() => setSidebarOpen(true)} />
          )}

          {sidebarOpen && (
            <CloseOutlined onClick={() => setSidebarOpen(false)} />
          )}

          {/* --- --- Mobile: SideBar Menu --- --- */}
          {sidebarOpen && (
            <div className="res-sidebar">
              {/*  */}
              <div className="res-sidebar-btn res-sidebar-btn-active">
                Dashboard
              </div>
              <div className="res-sidebar-hr" />

              <div className="res-sidebar-btn">Profile</div>
              <div className="res-sidebar-btn">Billing [BETA]</div>
              <div className="res-sidebar-btn">Notification</div>
              <div className="res-sidebar-btn" onClick={signOut}>
                Log Out
              </div>

              <div className="res-sidebar-hr" />
              <div className="res-sidebar-groupName">Manage Team</div>

              <div className="res-sidebar-btn">Create New Team</div>
              <div className="res-sidebar-hr" />
              {/* 
              <div>
                <div className="res-sidebar-groupName">Switch Team</div>

                <div className="res-sidebar-btn">SEO Team - Australia</div>
                <div className="res-sidebar-btn">SEO Team - Sri Lanka</div>
                <div className="res-sidebar-btn">
                  SEO Team Home Lands Skyline
                </div>
                <div className="res-sidebar-btn">Team_Test</div>
              </div> */}

              {/*  */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

function TeamsDropdown({ navigate, teamsData = [] }) {
  const [selectedTeamId, setSelectedTeamId] = useState();
  // const navigate = useNavigate();

  return (
    <div className="TeamsDropdown">
      <div className="TDropdown-groupName">Manage Team</div>

      {selectedTeamId && (
        <div
          className="TDropdown-item"
          onClick={() => navigate(`/teams/${selectedTeamId}`)}
        >
          Team Settings
        </div>
      )}

      <div className="TDropdown-item" onClick={() => navigate("/teams/create")}>
        Create New Team
      </div>

      {teamsData.length !== 0 && (
        <>
          <hr className="TDropdown-hr" />

          <div className="TDropdown-groupName">Switch Teams</div>
        </>
      )}

      {teamsData.length !== 0 &&
        teamsData.map((item) => {
          const team_id = item.team_id.id;
          const team_name = item.team_id.name;

          return (
            <div
              className="TDropdown-item"
              onClick={() => setSelectedTeamId(team_id)}
            >
              {selectedTeamId === team_id && (
                <CheckCircleOutlined className="TDropdown-itemIcon" />
              )}
              {team_name}
            </div>
          );
        })}
    </div>
  );
}
