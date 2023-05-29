import React, { useState } from "react";
import "./taskSection.css";

import { EyeOutlined, MobileOutlined } from "@ant-design/icons";

import TaskItem from "../item/TaskItem";
import { useEffect } from "react";
// import { supabase } from "../../../supabaseClient";

function TaskSection({ id, name, tasks, teamMembersData }) {
  const [collapsed, setCollapsed] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [noOfCompletedTasks, setNoOfCompletedTasks] = useState();

  useEffect(() => {
    setTaskList(tasks);
    setLoading(false);
  }, [tasks]);

  const noOfTasks = taskList.length || 0;

  useEffect(() => {
    const CompletedTasksLength = taskList.filter(
      (item) => item.is_completed === true
    ).length;
    setNoOfCompletedTasks(CompletedTasksLength);
  }, [taskList]);

  const changeCompleteTask = (id, is_completed) => {
    let TASKLIST = taskList;

    TASKLIST.forEach((item) => {
      if (item.id === id) {
        item.is_completed = !is_completed;
        return;
      }
    });

    setTaskList([...TASKLIST]);
  };

  // Hide the section component if there is no any task.
  if (noOfTasks === 0) {
    return null;
  }

  return (
    <div className="TaskSection">
      <div className="TaskSection-header">
        <div className="TaskSection-header-l">
          <MobileOutlined style={{ fontSize: "20px" }} />

          <div className="TaSc-hd-title">{name}</div>

          <div className="TaSc-hd-progress-bg">
            <div
              className="TaSc-hd-progress"
              // style={{ width: `${(5 / 14) * 100}%` }}
              style={{
                width: `${(noOfCompletedTasks / noOfTasks) * 100}%`,
              }}
            />
          </div>

          <div className="TaSc-hd-completed">
            {/* {`${noOfCompletedTasks} / ${noOfTasks} Completed`} */}
            {`${noOfCompletedTasks} / ${noOfTasks} Completed`}
          </div>
          {/* Why two divs ? one for desktop & another one for mobile */}
          <div className="TaSc-hd-completed-m">
            {noOfCompletedTasks + " / " + noOfTasks}
          </div>
        </div>

        <div className="TaskSection-header-r">
          {/* <div>
            <UserOutlined />
          </div>

          <div>
            <CalendarOutlined />
          </div>

          <div>
            <FileDoneOutlined />
          </div> */}

          <div onClick={() => setCollapsed(!collapsed)}>
            <EyeOutlined style={{ color: collapsed && "Blue" }} />
          </div>
        </div>
      </div>

      {!loading && !collapsed && (
        <>
          <div className="TaskSection-topics">
            <div>TITLE</div>
            <div>PRIORITY</div>
            <div>STATUS</div>
            <div>EVALUTION</div>
          </div>

          <>
            {taskList.map((item) => {
              return (
                <TaskItem
                  key={item.id.toString()}
                  task={item}
                  changeCompleteTask={changeCompleteTask}
                  teamMembersData={teamMembersData}
                />
              );
            })}
          </>
        </>
      )}
    </div>
  );
}

export default TaskSection;
