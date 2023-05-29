import React, { useContext, useEffect, useState } from "react";
import "./homeScreen.css";

// import Header from "../../components/header/Header";
import ProjectCard from "../../components/projectCard/ProjectCard";

import { message, Modal, Spin } from "antd";
import * as Yup from "yup";
import { Formik } from "formik";
import { supabase } from "../../supabaseClient";
import { AuthContext } from "../../context/auth/AuthContext";

function HomeScreen() {
  const { session } = useContext(AuthContext);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState([]);
  const [NewPCreated, setNewPCreated] = useState("");
  const [projectAchieving, setProjectAchieving] = useState(false);
  const [refetchHomeData, setRefetchHomeData] = useState(1);

  useEffect(() => {
    document.title = "Projects - SEO Checklist";
  }, []);

  // Fetching Projects - (Homedata)
  useEffect(() => {
    let isActive = true;

    if (!loading) setLoading(true);

    async function fetchData() {
      const { data, error } = await supabase
        .from("team_users")
        .select(
          `
        team_id(
          project:project_team_id_fkey(
            id,
            name,
            is_archived,
            description,
            url
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
        console.log(data);

        if (isActive) {
          setHomeData([...data]);
        }
      }
    }

    fetchData().finally(() => {
      setLoading(false);
      console.log("Api Called");
    });

    return () => {
      isActive = false;
    };
  }, [NewPCreated, projectAchieving, refetchHomeData]);

  const DisplayingErrorMessagesSchema = Yup.object().shape({
    projectName: Yup.string()
      .max(30, "Name cannot be longer than 30 characters!")
      .required("Project Name is required!"),
    description: Yup.string().max(
      1000,
      "Description cannot be longer than 1000 characters!"
    ),
    projectUrl: Yup.string()
      .url("Project URL must be a valid URL!")
      .max(2048, "URL cannot be longer than 2048 characters!"),
    team: Yup.string().required(
      "Team is required! Choose a existing team or create a new one."
    ),
  });

  async function createNewProject(values) {
    // console.log(values);
    console.log(session.user.id);

    const { data, error } = await supabase.from("project").insert([
      {
        name: values.projectName,
        description: values.description,
        url: values.projectUrl,
        admin_id: session.user.id,
        team_id: values.team,
      },
    ]);

    if (error) {
      console.log(error);

      message.error({
        content: "Something went wrong! Please Try again later.",
        duration: "2.5",
      });
    } else {
      // ---------------------------
      add_task_projects(data[0].id);
      // ---------------------------

      console.log(data);
      // console.log(data[0].id);
      console.log("Project created succefully!");

      setNewPCreated(data);
      message.success({
        content: "Project created succefully!",
        duration: "3",
      });
    }
  }

  async function add_task_projects(project_id) {
    const list = await fecthAllTasks(project_id);

    // console.log("Here is the List Bro");
    // console.log(list);

    const { data, error } = await supabase.from("task_project").insert(list);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  }

  async function fecthAllTasks(id) {
    const { data, error } = await supabase.from("task").select("id");

    if (error) {
      console.log(error);
      // return [null];
    } else {
      console.log("All tasks: 👇");

      data.map((item) => {
        item["task_id"] = item.id;
        item["project_id"] = id;
        delete item.id;
      });

      console.log(data);
      return data;
    }
  }

  const handleArchiveProject = async (projectId, boolean) => {
    const { data, error } = await supabase
      .from("project")
      .update({ is_archived: boolean })
      .match({ id: projectId });

    if (error) {
      console.log(error);
      message.error("Something Went Wrong!");
    } else {
      console.log(data);
      setProjectAchieving(!projectAchieving);
      message.success(
        `Project ${boolean ? "Archived" : "unarchived"} successfully!`
      );
    }
  };

  const fetchHomeDataAgain = async () => {
    // Something might have changed refetch data again
    setRefetchHomeData(refetchHomeData + 1);
  };

  return (
    <div className="HomeScreen">
      {/* <Header /> */}

      <div className="hms-header">
        <div>
          <div className="hms-h-title">
            {showArchived ? "Archives" : "Projects"}
          </div>
          {/* <div className="hms-h-teamBtn">• SEO Team - Sri Lanka</div>
          <div className="hms-h-teamBtn">Clear team selection</div> */}
        </div>

        <div>
          {!showArchived && (
            <div
              className="hms-h-archive"
              onClick={() => setShowArchived(true)}
            >
              ARCHIVED PROJECTS
            </div>
          )}

          {showArchived && (
            <div
              className="hms-h-archive"
              onClick={() => setShowArchived(false)}
            >
              All PROJECTS
            </div>
          )}

          <div
            className="hms-h-newProject"
            onClick={() => setShowProjectModal(true)}
          >
            CREATE PROJECT
          </div>
        </div>
      </div>

      <div className="hms-allProjects">
        {loading && (
          <div className="HomeScreen-loading">
            <Spin size="default" />
          </div>
        )}

        {!loading && (
          <>
            {homeData.map((item) => (
              <ProjectCard
                key={item.team_id.id}
                teamId={item.team_id.id}
                teamName={item.team_id.name}
                projects={item.team_id.project}
                showArchived={showArchived}
                handleArchiveProject={handleArchiveProject}
                fetchHomeDataAgain={fetchHomeDataAgain}
              />
            ))}
          </>
        )}
      </div>

      <Formik
        initialValues={{
          projectName: "",
          projectUrl: "",
          description: "",
          team: "",
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values, { resetForm }) => {
          createNewProject(values).then(() => {
            resetForm();
          });

          setShowProjectModal(false);
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
            // title="Basic Modal"
            visible={showProjectModal}
            // onOk={() => null}
            onCancel={() => setShowProjectModal(false)}
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
                  <div className="hms-p-m-title">Create Project</div>

                  <div className="hms-p-m-inputContainer">
                    <label htmlFor="projectName">Project Name</label>
                    <input
                      type="text"
                      name="projectName"
                      id="projectName"
                      {...getFieldProps("projectName")}
                    />

                    {touched.projectName && errors.projectName && (
                      <div className="txt-input-error">
                        {errors.projectName}
                      </div>
                    )}
                  </div>

                  <div className="hms-p-m-inputContainer">
                    <label htmlFor="projectUrl">Project Url</label>
                    <input
                      type="text"
                      name="projectUrl"
                      id="projectUrl"
                      placeholder="https://..."
                      {...getFieldProps("projectUrl")}
                    />

                    {touched.projectUrl && errors.projectUrl && (
                      <div className="txt-input-error">{errors.projectUrl}</div>
                    )}
                  </div>

                  <div className="hms-p-m-inputContainer">
                    <label htmlFor="description">Description</label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      {...getFieldProps("description")}
                    />

                    {touched.description && errors.description && (
                      <div className="txt-input-error">
                        {errors.description}
                      </div>
                    )}
                  </div>

                  <div className="hms-p-m-inputContainer">
                    <label htmlFor="team">Team</label>
                    {/* <input
                      type="text"
                      name="team"
                      id="team"
                      {...getFieldProps("team")}
                    /> */}

                    {/* ------------------------------------------------- */}

                    <select
                      id="team"
                      name="team"
                      className="hms-p-m-select"
                      value={values.team}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: "100%",
                        background: "white",
                      }}
                    >
                      <option value={""} key={"noTeam"}>
                        Select a Team
                      </option>

                      {homeData.map((item) => (
                        <option value={item.team_id.id} key={item.team_id.id}>
                          {item.team_id.name}
                        </option>
                      ))}
                    </select>

                    {touched.team && errors.team && (
                      <div className="txt-input-error">{errors.team}</div>
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
                    setShowProjectModal(false);
                  }}
                >
                  CANCEL
                </div>
              </div>
            </>
          </Modal>
        )}
      </Formik>
    </div>
  );
}

//app.seochecklist.dev/login
// thilina.guruge232@gmail.com
// Asd12qw34zx56

export default HomeScreen;
