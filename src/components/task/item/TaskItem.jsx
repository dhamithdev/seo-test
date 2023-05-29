import React, { useState, useContext } from "react";
import "./taskItem.css";

import { Checkbox, DatePicker, Tooltip, Dropdown, Menu, Avatar } from "antd";
import {
  LinkOutlined,
  CalendarOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { supabase } from "../../../supabaseClient";
import AssignedUser from "./assignedUser/AssignedUser";
import moment from "moment";
import useCreateActivity from "../../../hooks/useCreateActivity";
import { AuthContext } from "../../../context/auth/AuthContext";

function TaskItem({ task, changeCompleteTask, teamMembersData }) {
  const { session } = useContext(AuthContext); // session.user.user_metadata.name

  // console.log(session);

  const [completed, setCompleted] = useState(task.is_completed);
  const [status, setStatus] = useState(task.status);
  const priority = useState(task.task_id.priority)[0];
  const [selectedDate, setSelectedDate] = useState(task.due_date || null);

  const [assignedUser, setAssignedUser] = useState(task.assigned_user_id);
  const [evaluation, setEvaluation] = useState(task.evaluation);

  const [createActivity] = useCreateActivity();

  const PROJECT_ID = task.project_id;
  const TASK_NAME = task.task_id.task_name;
  const LOGGEDIN_USER_NAME = session.user.user_metadata.name;

  async function onCheckboxChange(e) {
    let is_completed = task.is_completed;

    setCompleted(!completed);
    changeCompleteTask(task.id, is_completed);

    async function completeTask() {
      const { data, error } = await supabase
        .from("task_project")
        .update({ is_completed: !is_completed })
        .match({ id: task.id });

      if (error) {
        console.log(error);
        setCompleted(!completed);
      } else {
        console.log(data);
      }
    }

    completeTask();

    const activityText = `${LOGGEDIN_USER_NAME} marked "${TASK_NAME}" as ${
      !is_completed ? "completed" : "incompleted"
    } `;
    createActivity({
      activity: activityText,
      project_id: PROJECT_ID,
      type: "complete",
    });
  }

  async function updateDueDate(date) {
    const { data, error } = await supabase
      .from("task_project")
      .update({ due_date: date })
      .match({ id: task.id });

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  }

  function onDateChange(date, dateString) {
    // console.log(dateString);
    if (date) {
      setSelectedDate(dateString);
      updateDueDate(dateString);

      const activityText = `${LOGGEDIN_USER_NAME} added the due date to the task "${TASK_NAME}"`;

      createActivity({
        activity: activityText,
        project_id: PROJECT_ID,
        type: "due_date",
      });
    } else {
      setSelectedDate(null);
      updateDueDate(null);

      const activityText = `${LOGGEDIN_USER_NAME} removed the due date of the task "${TASK_NAME}"`;

      createActivity({
        activity: activityText,
        project_id: PROJECT_ID,
        type: "due_date",
      });
    }
  }

  function dateAndMonthToShow() {
    const showingDate = `${selectedDate[5]}${selectedDate[6]}/${selectedDate[8]}${selectedDate[9]}`;
    return showingDate;
  }

  function statusButtonColor() {
    // if (status === "") return "black";
    // if (status === "Pending") return "black";
    if (status === "In Progress") return "#ca8a04";
    if (status === "Done") return "#36c463";

    return "black";
  }

  function priorityButtonColor() {
    if (priority === "HIGH")
      return { name: "HIGH", bg: "#fee2e2", color: "#991b1b" };

    if (priority === "MEDIUM")
      return { name: "MEDIUM", bg: "#fef08a", color: "#c18a04" };

    if (priority === "LOW")
      return { name: "LOW", bg: "#dcfce7", color: "#166534" };

    // return "black";
  }
  const priorityBtn = priorityButtonColor();

  function changeStatus(key) {
    // console.log(typeof key);

    let buttonClicked;

    if (key === "1") {
      buttonClicked = null;
    } else if (key === "2") {
      buttonClicked = "Pending";
    } else if (key === "3") {
      buttonClicked = "In Progress";
    } else if (key === "4") {
      buttonClicked = "Done";
    } else {
      buttonClicked = null;
    }

    setStatus(buttonClicked);
    // console.log("buttonCliked: " + buttonClicked);

    // -----------------------------------------------------

    async function changeStatusDb() {
      const { data, error } = await supabase
        .from("task_project")
        .update({ status: buttonClicked })
        .match({ id: task.id });

      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    }
    changeStatusDb();

    const activityText = `${LOGGEDIN_USER_NAME} changed the 'status' of the task "${TASK_NAME}" to "${buttonClicked}"`;
    createActivity({
      activity: activityText,
      project_id: PROJECT_ID,
      type: "status",
    });
  }

  const Status = (
    <Menu
      defaultValue={1}
      onClick={({ key }) => changeStatus(key)}
      className="Status-overlay"
      items={[
        {
          label: "---",
          key: "1",
        },
        {
          label: "Pending",
          key: "2",
        },
        {
          label: "In Progress",
          key: "3",
          style: { color: "#e8b53b" },
        },
        {
          label: "Done",
          key: "4",
          style: { color: "#36c463" },
        },
      ]}
    />
  );

  const Evaluation = (
    <Menu
      defaultValue={1}
      onClick={({ key }) => changeEvaluation(key)}
      className="Evaluation-overlay"
      items={[
        {
          label: "---",
          key: "1",
        },
        {
          label: "Good",
          key: "2",
          style: { color: "green" },
        },
        {
          label: "Bad",
          key: "3",
          style: { color: "crimson" },
        },
        {
          label: "Can Be Improved",
          key: "4",
          style: { color: "dodgerblue" },
        },
        {
          label: "Not Relevant",
          key: "5",
          style: { color: "darkgray" },
        },
      ]}
    />
  );

  function changeEvaluation(key) {
    // console.log(typeof key);

    let buttonClicked;

    if (key === "1") {
      buttonClicked = null;
    } else if (key === "2") {
      buttonClicked = "Good";
    } else if (key === "3") {
      buttonClicked = "Bad";
    } else if (key === "4") {
      buttonClicked = "Can Be Improved";
    } else if (key === "5") {
      buttonClicked = "Not Relevant";
    } else {
      buttonClicked = null;
    }

    setEvaluation(buttonClicked);
    // console.log("buttonCliked: " + buttonClicked);

    // -----------------------------------------------------

    async function changeEvaluationDb() {
      const { data, error } = await supabase
        .from("task_project")
        .update({ evaluation: buttonClicked })
        .match({ id: task.id });

      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    }

    changeEvaluationDb();

    const activityText = `${LOGGEDIN_USER_NAME} changed the 'Evaluation' of the task "${TASK_NAME}" to "${buttonClicked}"`;
    createActivity({
      activity: activityText,
      project_id: PROJECT_ID,
      type: "evaluation",
    });
  }

  function evaluationButtonColor() {
    if (evaluation === "Good") return "green";
    if (evaluation === "Bad") return "crimson";
    if (evaluation === "Can Be Improved") return "dodgerblue";
    if (evaluation === "Not Relevant") return "darkgray";

    return "black";
  }

  return (
    <div className={`TaskItem ${completed && "taskItem-completed"} `}>
      <div className="TaskItem-checkbox">
        <Checkbox onChange={onCheckboxChange} checked={completed} />
      </div>

      <div className={`TaskItem-name ${completed && "TaskItem-name-Striked"}`}>
        {task.task_id.task_name}
      </div>

      {/* ---- Priority ---- */}
      <div className="TaskItem-priority">
        <div
          style={{
            color: priorityBtn.color,
            backgroundColor: priorityBtn.bg,
          }}
        >
          {priorityBtn.name}
        </div>
      </div>

      {/* ---- Status ---- */}
      <div className={`TaskItem-status`}>
        <Dropdown overlay={Status} trigger={"click"}>
          <div
            onClick={(e) => e.preventDefault()}
            style={{ color: statusButtonColor(), cursor: "pointer" }}
          >
            {status || "---"}
          </div>
        </Dropdown>
      </div>

      {/* ---- Evaluation ---- */}
      <div className={`TaskItem-Evaluation`}>
        <Dropdown overlay={Evaluation} trigger={"click"}>
          <div
            onClick={(e) => e.preventDefault()}
            style={{ color: evaluationButtonColor(), cursor: "pointer" }}
          >
            {evaluation || "---"}
          </div>
        </Dropdown>
      </div>

      <div className="TaskItem-otherbtns">
        <div>
          <Dropdown
            overlay={
              <AssignedUser
                taskId={task.id}
                teamMembersData={teamMembersData}
                setAssignedUser={setAssignedUser}
                assignedUser={assignedUser}
              />
            }
            trigger={"click"}
          >
            {assignedUser ? (
              <Avatar
                size="small"
                style={{ backgroundColor: "rgba(20, 20, 20, 0.1)" }}
                icon={<UserOutlined />}
              />
            ) : (
              <UserAddOutlined />
            )}
          </Dropdown>
        </div>

        {/* ---- Due Date ---- */}
        <div>
          <DatePicker
            className={`TaskItem-datepicker ${selectedDate &&
              "TaskItem-datepicker-set"}`}
            onChange={onDateChange}
            defaultValue={moment(selectedDate)}
            suffixIcon={
              selectedDate ? (
                <div>{dateAndMonthToShow()}</div>
              ) : (
                <CalendarOutlined />
              )
            }
          />
        </div>

        {/* --- How to do this? --- */}
        <div>
          <Tooltip title="How to do this?" placement="bottom">
            <a
              href={task.task_id.link || undefined}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "çenter",
                cursor: "pointer",
              }}
            >
              <LinkOutlined />
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
