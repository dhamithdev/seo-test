import React, { useState } from "react";
import "./projectCard.css";

import { Menu, Dropdown, Modal, message } from "antd";
import {
  FolderOutlined,
  FolderFilled,
  // UpOutlined,
  DownOutlined,
  GlobalOutlined,
  EllipsisOutlined,
  DeleteFilled,
  EditFilled,
  EyeFilled,
  DeleteOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Form, Formik } from "formik";
import * as Yup from "yup";

function ProjectCard({
  teamId,
  teamName,
  projects,
  showArchived,
  handleArchiveProject,
  fetchHomeDataAgain,
}) {
  const [show, setShow] = useState(true);

  if (
    projects.filter((item) => item.is_archived === showArchived).length === 0
  ) {
    return null;
  }

  return (
    <div className="ProjectCard">
      <div className="hms-project">
        <div className="hms-project-top">
          <div className="hms-p-name" onClick={() => setShow(!show)}>
            {show ? <FolderOutlined /> : <FolderFilled />}
            {teamName}
          </div>

          <div className="hms-p-arrow" onClick={() => setShow(!show)}>
            {/* {show ? <DownOutlined /> : <UpOutlined />} */}
            <DownOutlined
              className={show ? "hms-p-arrow-icon-down" : "hms-p-arrow-icon-up"}
            />
          </div>
        </div>
        {show && (
          <div className="project-card-boxes">
            {projects
              .filter((item) => item.is_archived === showArchived)
              .map((item) => {
                return (
                  <ProjectCardBox
                    key={item.id}
                    projectId={item.id}
                    name={item.name}
                    projectUrl={item.url}
                    description={item.description}
                    is_archived={item.is_archived}
                    handleArchiveProject={handleArchiveProject}
                    fetchHomeDataAgain={fetchHomeDataAgain}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;

// -----------------------------------------------------------------------------------------------------------

function ProjectCardBox({
  projectId,
  name,
  is_archived,
  projectUrl,
  description,
  handleArchiveProject,
  fetchHomeDataAgain,
}) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isProjectDeleted, setIsProjectDeleted] = useState(false);

  const handleOptionClick = (number) => {
    if (number === "1") {
      setEditModalVisible(true);
      return;
    }
    if (number === "2") {
      const shouldArchive = is_archived ? false : true;
      handleArchiveProject(projectId, shouldArchive);
    }
    if (number === "3") {
      setDeleteModalVisible(true);
      return;
    }
  };

  const Options = (
    <Menu
      className="overlay options-overlay"
      // itemIcon={<FolderOutlined />}
      onClick={({ key }) => handleOptionClick(key)}
      items={[
        {
          label: "Edit",
          key: "1",
          icon: <EditFilled />,
        },
        {
          type: "divider",
        },
        {
          label: is_archived ? "Unarchive" : "Archive",
          key: "2",
          icon: <EyeFilled />,
        },
        {
          label: "Delete",
          key: "3",
          icon: <DeleteFilled />,
        },
      ]}
    />
  );

  const DisplayingErrorMessagesSchema = Yup.object().shape({
    projectName: Yup.string()
      .max(30, "Name cannot be longer than 30 characters!")
      .required("The Project Name field is required."),
    description: Yup.string().max(
      1000,
      "Description cannot be longer than 1000 characters!"
    ),
    projectUrl: Yup.string()
      .url("Project URL must be a valid URL!")
      .max(2048, "URL cannot be longer than 2048 characters!"),
  });

  const handleDeleteProject = async () => {
    setIsProjectDeleted(true);

    const { data, error } = await supabase
      .from("project")
      .delete()
      .match({ id: projectId });

    if (error) {
      console.log(error);
      setIsProjectDeleted(false);
    } else {
      console.log(data);
      message.success("Project Deleted Successfully!");
    }
  };

  const handleEditProject = async ({ name, url, description }) => {
    setEditModalVisible(false);

    const { data, error } = await supabase
      .from("project")
      .update({
        name,
        url,
        description,
      })
      .match({ id: projectId });

    if (error) {
      console.log(error);
      message.error("Something Went Wrong!");
    } else {
      console.log(data);
      fetchHomeDataAgain();
      message.success("Project information edited successfully!");
    }
  };

  if (isProjectDeleted) return null;
  return (
    <>
      <div className="Project-card-box">
        <Link to={`/project/${projectId}/tasks`} style={{ cursor: "pointer" }}>
          <div>
            <div className="project-c-img">
              <GlobalOutlined />
            </div>

            <div className="project-c-name">{name}</div>
          </div>
        </Link>

        <div>
          {is_archived && <div className="project-c-archived">Archived</div>}
          <Dropdown overlay={Options} trigger={"click"}>
            <div className="project-c-menuIcon" style={{ cursor: "pointer" }}>
              <EllipsisOutlined />
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Edit Project Details Modal */}
      <Formik
        initialValues={{
          projectName: name,
          projectUrl,
          description,
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values, { resetForm }) => {
          const data = {
            name: values.projectName,
            url: values.projectUrl,
            description: values.description,
          };
          handleEditProject(data).then(() => {
            resetForm();
          });
        }}
      >
        {({
          errors,
          touched,
          // validateField,
          // validateForm,
          // resetForm,
          getFieldProps,
          handleSubmit,
        }) => (
          <Modal
            visible={editModalVisible}
            footer={null}
            // onOk={() => setEditModalVisible(false)}
            onCancel={() => setEditModalVisible(false)}
          >
            <Form>
              <div className="ProjectCardBox-delete">
                {/* Header */}
                <h3>Update Project</h3>

                {/* Body */}
                <div className="hms-p-m-inputContainer">
                  <label htmlFor="projectName">Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    id="projectName"
                    {...getFieldProps("projectName")}
                  />

                  {touched.projectName && errors.projectName && (
                    <div className="txt-input-error">{errors.projectName}</div>
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
                    <div className="txt-input-error">{errors.description}</div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="hms-p-m-footer"
                  style={{
                    background: "white",
                    padding: "10px 0px 0px 24px",
                  }}
                >
                  <div className="hms-p-m-create" onClick={handleSubmit}>
                    Save
                  </div>

                  <div
                    className="hms-p-m-cancel"
                    onClick={() => {
                      setEditModalVisible(false);
                    }}
                  >
                    CANCEL
                  </div>
                </div>
              </div>
            </Form>
          </Modal>
        )}
      </Formik>

      {/* Delete Project Modal */}
      <Modal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
      >
        <div className="Project-c-deleteModal">
          {/* Header */}
          <h2>Delete Project</h2>

          <div style={{ textAlign: "center" }}>
            Are you sure you want to delete your project?
          </div>

          <div className="Project-c-modal-deleteIcon">
            <DeleteOutlined />
          </div>

          {/* Footer */}
          <div
            className="hms-p-m-footer"
            style={{
              background: "white",
              // padding: "10px 0px 0px 24px",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <div
              className="hms-p-m-create"
              onClick={handleDeleteProject}
              style={{
                backgroundColor: "crimson",
                paddingRight: "25px",
                paddingLeft: "25px",
              }}
            >
              DELETE
            </div>

            <div
              className="hms-p-m-cancel"
              onClick={() => {
                setDeleteModalVisible(false);
              }}
              style={{
                background: "white",
                color: "black",
                border: "1px solid darkgray",
              }}
            >
              CANCEL
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
