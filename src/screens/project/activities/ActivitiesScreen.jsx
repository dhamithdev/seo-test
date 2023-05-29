import React, { useEffect, useState } from "react";
import "./activitiesScreen.css";

import {
  CheckCircleOutlined,
  AlignRightOutlined,
  FieldTimeOutlined,
  FundOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { Spin } from "antd";

function ActivitiesScreen() {
  const { id: project_id } = useParams();
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // fetch_Project_Data and Team members
  useEffect(() => {
    async function fetch_Project_Data() {
      const { data, error } = await supabase
        .from("project")
        .select()
        .match({ id: project_id });

      if (error) {
        console.log(error);
      } else {
        if (data.length === 0) {
          navigate("/");
        }
      }
    }

    fetch_Project_Data();
  }, [project_id]);

  // Fetch Activity data
  useEffect(() => {
    setLoading(true);

    async function fetchActivities() {
      const { data, error } = await supabase
        .from("activity")
        .select()
        .match({ project_id })
        .limit(50)
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setActivities(data);
        // console.log("Fetched Activites...");
        // console.log(data);
      }
    }

    fetchActivities().finally(() => {
      setLoading(false);
    });
  }, [project_id]);

  return (
    <div className="ActivitiesScreen">
      <div className="ActivitiesScreen-box">
        <div className="ActivitiesS-activity-heading">Last Activities</div>
        <div className="ActivitiesS-hr" />

        {loading && (
          // <div className="ActivitiesScreen-loading" >
          <Spin className="ActivitiesScreen-loading" />
          // </div>
        )}

        {activities.map((item) => {
          return (
            <ActivityItem
              key={item.id}
              type={item.type}
              activity={item.activity}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ActivitiesScreen;

function ActivityItem({ activity = "", type = "other" }) {
  function icon() {
    if (type === "complete") {
      return <CheckCircleOutlined />;
    } else if (type === "due_date") {
      return <FieldTimeOutlined />;
    } else if (type === "status") {
      return <ProfileOutlined />;
    } else if (type === "evaluation") {
      return <FundOutlined />;
    } else {
      return <AlignRightOutlined />;
    }
  }

  // evaluation

  return (
    <div className="ActivitiesS-activity-Item">
      {icon()}
      {activity}.
    </div>
  );
}
