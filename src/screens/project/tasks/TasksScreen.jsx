import React, { useEffect, useState, useContext } from "react";
import "./tasksScreen.css";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Dropdown, Menu, Modal, Spin } from "antd";
import { CheckCircleOutlined, CheckOutlined } from "@ant-design/icons";

import TaskSection from "../../../components/task/section/TaskSection";
import { supabase } from "../../../supabaseClient";
import { AuthContext } from "../../../context/auth/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";

function TasksScreen() {
  // URL Params
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const filter = searchParams.get("filter");
  const { id: project_id } = useParams();
  const { session } = useContext(AuthContext); // session.user.id

  // Data States
  const [taskData, setTaskData] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [ProjectData, setProjectData] = useState([]);
  const [teamMembersData, setTeamMembersData] = useState([]);
  const [userIdInTeam, setUserIdInTeam] = useState();

  // Modals
  const [showNewTaskModal, setShowNewTaskModal] = useState();

  // Filter States
  const [filter_priority, setPriority] = useState("all");
  const [filter_status, setStatus] = useState("all");
  const [filter_myTasks, setFilterMyTasks] = useState(false);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [ProjectDataFetching, setProjectDataFetching] = useState(true);
  const [tasksFetching, setTasksFetching] = useState(true);
  const [SectionsFetching, setSectionsFetching] = useState(true);
  const [projectIdChanging, setProjectIdChanging] = useState(false);

  // --- Fetching Data and updating state ---
  // Changing Document Title
  useEffect(() => {
    let projectName =
      ProjectData.length === 0 ? "Projects" : ProjectData[0].name;
    document.title = `${projectName} - SEO Checklist`;
  }, [ProjectData, project_id]);

  // Check if the url includes filter="my"
  useEffect(() => {
    let isActive = true;

    if (filter === "my") {
      // setFiltered(true);
      console.log("My included");
      if (!isActive) return;

      !loading && setLoading(true);
      setLoading(false);
    } else {
      if (!isActive) return;
      console.log("My does not included");

      !loading && setLoading(true);
      // setSectionList(SectionData);
      setLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [filter]);

  // fetch_Sections_Data
  useEffect(() => {
    let isActive = true;

    async function fetch_Sections_Data() {
      const { data, error } = await supabase.from("section").select();

      if (error) {
        console.log(
          "There is an error in the --> fetch_Sections_Data Function()..."
        );
        console.log(error);
      } else {
        console.log("Section data Fetched! ...");
        // console.log(data);
        let Array = [];

        data.map((i) => {
          Array.push(i);
        });

        console.log(Array);

        if (isActive) {
          // setSectionList(data);
          setSectionList(Array);
          setSectionsFetching(false);
        }
      }
    }

    fetch_Sections_Data().finally(() => {
      if (isActive) {
        setProjectIdChanging(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, [project_id, filter]);

  // Team members fetching function
  async function fetch_team_members(team_id, isActive) {
    if (team_id === null) return;

    const { data, error } = await supabase
      .from("team_users")
      .select(
        `
        id,
        user_id(
          name,
          user_id
          )
          `
      )
      .match({ team_id });

    if (error) {
      console.log(error);
    } else {
      console.log("Team Members Fetched...");
      console.log(data);

      if (isActive) {
        setTeamMembersData(data);
      }
    }
  }

  // fetch_Project_Data and Team members
  useEffect(() => {
    let isActive = true;

    async function fetch_Project_Data() {
      const { data, error } = await supabase
        .from("project")
        .select()
        .match({ id: project_id });

      if (error) {
        console.log(error);
      } else {
        console.log("Project data Fetched!");

        console.log(data);

        if (data.length === 0) {
          navigate("/");
        }

        if (isActive) {
          setProjectData(data);
          setProjectDataFetching(false);

          const team_id = (data.length !== 0 && data[0].team_id) || null;
          fetch_team_members(team_id, isActive);
        }
      }
    }

    fetch_Project_Data();

    return () => {
      isActive = false;
    };
  }, [project_id, filter]);

  // fetch_Project_Tasks
  useEffect(() => {
    let isActive = true;

    // Without Filter
    async function fetch_Project_Tasks() {
      const { data, error } = await supabase
        .from("task_project")
        .select(
          `
          id,
          status,
          evaluation,
          is_completed,
          assigned_user_id,
          due_date,
          project_id,
          task_id(
            id,
            task_name,
            priority,
            link,
            section_id
          )
        `
        )
        .match({ project_id });

      if (error) {
        console.log(error);
      } else {
        console.log("Task Data Fetched...");
        // console.log(data);

        let Array = [];

        data.map((item) => {
          // console.log(item.task_id.id);
          Array.push(item);
        });

        console.log(Array);

        if (isActive) {
          setTaskData([...Array]);
          setTasksFetching(false);
        }
      }
    }
    // With Filter
    async function fetch_Project_Tasks_Filtered() {
      const { data, error } = await supabase
        .from("task_project")
        .select(
          `
          id,
          status,
          is_completed,
          assigned_user_id,
          due_date,
          task_id(
            id,
            task_name,
            priority,
            link,
            section_id
          )
        `
        )
        .match({ project_id, assigned_user_id: 19 })
        .order("id", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        console.log("Task Data Fetched...");
        // console.log(data);

        let Array = [];

        data.map((item) => {
          // console.log(item.task_id.id);
          Array.push(item);
        });

        console.log(Array);

        if (isActive) {
          setTaskData(Array);
          // setTaskData(data);
          setTasksFetching(false);
        }
      }
    }

    if (filter === "my") {
      // Fetch team id.
      // Do it.
      //
      //
      //
      //
      //

      fetch_Project_Tasks_Filtered();
    } else {
      fetch_Project_Tasks();
    }

    return () => {
      isActive = false;
    };
  }, [project_id, filter]);

  // set project Id changing - true
  useEffect(() => {
    let active = true;

    if (active) {
      setProjectIdChanging(true);
    }

    return () => {
      active = false;
    };
  }, [project_id, filter]);

  // fetch user id in my team
  useEffect(() => {
    if (ProjectData.length === 0) return;

    async function fetch_id() {
      const { data, error } = await supabase
        .from("team_users")
        .select(
          `
          id
          `
        )
        .match({
          user_id: session.user.id,
          team_id: ProjectData[0].team_id,
        });

      if (error) {
        console.log({ from: "fetch user id in my team for filtering", error });
      } else {
        console.log("fetch user id in my team for filtering");
        // console.log(data[0].id);
        setUserIdInTeam(data[0].id);
      }
    }

    fetch_id();
  }, [project_id, ProjectData]);

  // Showing Loading Indicator
  if (ProjectDataFetching && tasksFetching && SectionsFetching) {
    return (
      <div className="TasksScreen-loading">
        <Spin />
      </div>
    );
  }

  // Showing loading indicator when the project id is changing
  if (projectIdChanging)
    return (
      <div className="TasksScreen-loading">
        <Spin />
      </div>
    );

  if (ProjectData.length === 0) {
    return null;
  }

  const statusMenu = (
    <Menu
      style={{ width: "200px" }}
      items={[
        {
          key: "1",
          label: (
            <div className="TasksScreen-filterMenu-item">
              <div>All Tasks</div>
              {filter_status === "all" && <CheckOutlined />}
            </div>
          ),
          onClick: () => setStatus("all"),
        },
        {
          key: "2",
          label: (
            <div className="TasksScreen-filterMenu-item">
              <div>Completed Tasks</div>
              {filter_status === "completed" && <CheckOutlined />}
            </div>
          ),
          onClick: () => setStatus("completed"),
        },
        {
          key: "3",
          label: (
            <div className="TasksScreen-filterMenu-item">
              <div>Incompleted Tasks</div>
              {filter_status === "incompleted" && <CheckOutlined />}
            </div>
          ),
          onClick: () => setStatus("incompleted"),
        },
      ]}
    />
  );

  const priorityMenu = (
    <Menu
      style={{ width: "150px" }}
      items={[
        {
          key: "1",
          label: (
            <div className="TasksScreen-filterMenu-item">
              <div>All</div>
              {filter_priority === "all" && <CheckOutlined />}
            </div>
          ),
          onClick: () => setPriority("all"),
        },
        {
          key: "2",
          label: (
            <div className="TasksScreen-filterMenu-item">
              <div>Low</div>
              {filter_priority === "low" && <CheckOutlined />}
            </div>
          ),
          onClick: () => setPriority("low"),
        },
        {
          key: "3",
          label: (
            <div className="TasksScreen-filterMenu-item">
              <div>Medium</div>
              {filter_priority === "medium" && <CheckOutlined />}
            </div>
          ),
          onClick: () => setPriority("medium"),
        },
        {
          key: "4",
          label: (
            <div className="TasksScreen-filterMenu-item">
              <div>High</div>
              {filter_priority === "high" && <CheckOutlined />}
            </div>
          ),
          onClick: () => setPriority("high"),
        },
      ]}
    />
  );

  function filter_status_name() {
    if (filter_status === "all") return "All Tasks";
    if (filter_status === "completed") return "Completed Tasks";
    if (filter_status === "incompleted") return "Incompleted Tasks";
  }

  function filter_priority_name() {
    if (filter_priority === "all") return "Priority";
    if (filter_priority === "low") return "Low";
    if (filter_priority === "medium") return "Medium";
    if (filter_priority === "high") return "High";
  }

  const DisplayingErrorMessagesSchema = Yup.object().shape({
    task_name: Yup.string()
      .max(500, "Task title cannot be longer than 500 characters!")
      .required("Task title is required!"),
    priority: Yup.string().required("Priority is required!"),
    link: Yup.string()
      .url("Link must be a valid URL!")
      .max(2048, "URL cannot be longer than 2048 characters!")
      .required("Link is required!"),
    section_id: Yup.string().required("Section is required!"),
  });

  // Rendering the UI
  return (
    <div className="TasksScreen">
      <div className="TasksScreen-filterBar">
        <div className="TasksScreen-filterBar-left">
          <Dropdown overlay={statusMenu} trigger="click">
            <div>
              <CheckCircleOutlined />
              {/* All Tasks */}
              {filter_status_name()}
            </div>
          </Dropdown>

          <Dropdown overlay={priorityMenu} trigger="click">
            <div>{filter_priority_name()}</div>
          </Dropdown>

          <div
            className={`${filter_myTasks &&
              "TasksScreen-filter-mytasks-active"}`}
            onClick={() => setFilterMyTasks(!filter_myTasks)}
          >
            My Tasks
          </div>
        </div>

        {/* <div className="TasksScreen-AddTaskButton" onClick={() => setShowNewTaskModal(true)}>Add Task</div> */}
      </div>

      <Formik
        initialValues={{
          task_name: "",
          priority: "",
          link: "",
          section_id: "",
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values, { resetForm }) => {
          // createNewProject(values).then(() => {
          // resetForm();
          // });
          // setShowProjectModal(false);
        }}
      >
        {({
          errors,
          touched,
          handleBlur,
          handleChange,
          getFieldProps,
          handleSubmit,
          values,
        }) => (
          <Modal
            visible={showNewTaskModal}
            onCancel={() => setShowNewTaskModal(false)}
            maskStyle={{
              background: "rgba(141, 146, 158, 0.6)",
            }}
            bodyStyle={{
              background: "white",
              padding: "0",
              height: "auto",
            }}
            style={{ height: "auto" }}
            footer={false}
          >
            <>
              <div className="hms-projects-modal">
                <div className="hms-p-m-body">
                  <div className="hms-p-m-title">Create Task</div>

                  <div className="hms-p-m-inputContainer">
                    <label htmlFor="projectName">Title</label>
                    <input
                      type="text"
                      name="task_name"
                      id="task_name"
                      {...getFieldProps("task_name")}
                    />

                    {touched.task_name && errors.task_name && (
                      <div className="txt-input-error">{errors.task_name}</div>
                    )}
                  </div>

                  <div className="hms-p-m-inputContainer">
                    <label htmlFor="projectUrl">Redirect Link</label>
                    <input
                      type="text"
                      name="link"
                      id="link"
                      placeholder="https://..."
                      {...getFieldProps("link")}
                    />

                    {touched.link && errors.link && (
                      <div className="txt-input-error">{errors.link}</div>
                    )}
                  </div>

                  {/* ------------------------------------------------- */}
                  <div className="hms-p-m-inputContainer">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      className="hms-p-m-select"
                      value={values.priority}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: "100%",
                        background: "white",
                      }}
                    >
                      <option value={""} key={"noPriority"}>
                        Select a Team
                      </option>

                      {[
                        { name: "LOW" },
                        { name: "MEDIUM" },
                        { name: "HIGH" },
                      ].map((item) => (
                        <option value={item.name} key={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {touched.priority && errors.priority && (
                      <div className="txt-input-error">{errors.priority}</div>
                    )}
                  </div>
                  {/* ------------------------------------------------- */}

                  {/* ------------------------------------------------- */}
                  <div className="hms-p-m-inputContainer">
                    <label htmlFor="section_id">Section</label>
                    <select
                      id="section_id"
                      name="section_id"
                      className="hms-p-m-select"
                      value={values.section_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: "100%",
                        background: "white",
                      }}
                    >
                      <option value={""} key={"noTeam"}>
                        Select a Section
                      </option>

                      {[{ id: 1, name: "Test 1" }].map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {touched.section_id && errors.section_id && (
                      <div className="txt-input-error">{errors.section_id}</div>
                    )}
                    {/* ------------------------------------------------- */}
                  </div>
                </div>
              </div>

              <div className="hms-p-m-footer">
                <div className="hms-p-m-create" onClick={handleSubmit}>
                  CREATE
                </div>

                <div
                  className="hms-p-m-cancel"
                  onClick={() => {
                    setShowNewTaskModal(false);
                  }}
                >
                  CANCEL
                </div>
              </div>
            </>
          </Modal>
        )}
      </Formik>

      <div className="TasksScreen-sections">
        {sectionList.map((section) => {
          const tasks = taskData
            .filter((task) => task.task_id.section_id === section.id)
            .filter((task) => {
              if (filter_priority === "all") {
                return task.task_id.priority;
              }
              return task.task_id.priority.toLowerCase() === filter_priority;
            })
            .filter((task) => {
              if (filter_status === "all") {
                return task.task_id.priority;
              }
              if (filter_status === "completed") {
                return task.is_completed === true;
              }
              if (filter_status === "incompleted") {
                return task.is_completed === false;
              }
            })
            .filter((task) => {
              // console.log(task);
              if (filter_myTasks) {
                return task.assigned_user_id === userIdInTeam;
              }
              return task;
            });

          return (
            <TaskSection
              key={section.id.toString()}
              id={section.id}
              filter_status={filter_status}
              filter_priority={filter_priority}
              name={section.name}
              tasks={tasks}
              teamMembersData={teamMembersData}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TasksScreen;
