import React, { useContext, useEffect, useState } from "react";
import "./createTeam.css";

import * as Yup from "yup";
import { Formik, Form } from "formik";

// import Header from "../../components/header/Header";
import { AuthContext } from "../../context/auth/AuthContext";
import { DataContext } from "../../context/data/DataContext";
import { Avatar, message, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Refetch_Teams_In_Header } from "../../context/data/DataActions";

function CreateTeam() {
  useEffect(() => {
    document.title = "Create Team - SEO Checklist";
  }, []);

  const { session } = useContext(AuthContext);
  const { dispatch } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const DisplayingErrorMessagesSchema = Yup.object().shape({
    teamname: Yup.string()
      .min(2, "Team Name must be at least 2 characters.")
      .max(20)
      .required("Required"),
  });

  async function createTeam(values) {
    // Creating a New Team in the database.
    const { data, error } = await supabase.from("team").insert([
      {
        name: values.teamname,
      },
    ]);

    if (error) {
      console.log(error);
      message.error("Something went wrong! Please try again later.");
    } else {
      console.log(data[0]);
      MakingMeAMember(data[0]);
    }
  }

  async function MakingMeAMember(values) {
    // Making the current user a Member of the team with the Role of Admin.

    const { data, error } = await supabase.from("team_users").insert([
      {
        // name: values.teamname,
        role: "admin",
        team_id: values.id,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      console.log(error);
      message.error(error.message);
      navigate("/");
    } else {
      console.log(data);
      console.log("Made me an admin");
      message.success("Team created succefully.");
      dispatch(Refetch_Teams_In_Header());
      navigate(`/teams/${values.id}`);
    }
  }

  return (
    <div className="CreateTeam">
      {/* <Header /> */}

      <div className="CreateTeam-header">Create Team</div>

      {/* --- --- Team Details (CSS from userProfile.css) --- --- */}
      <div className="UserP-box" style={{ border: "none" }}>
        <div className="UserP-box-l">
          <div>Team Details</div>
          <div>Create a new team to collaborate with others on projects.</div>
        </div>

        <Formik
          initialValues={{
            teamname: "",
          }}
          validationSchema={DisplayingErrorMessagesSchema}
          onSubmit={(values, { resetForm }) => {
            setLoading(true);
            console.log(values);

            createTeam(values).finally(() => {
              setLoading(false);
              resetForm();
            });
          }}
        >
          {({
            errors,
            touched,
            // validateField,
            // validateForm,
            getFieldProps,
            handleSubmit,
          }) => (
            <Form className="UserP-box-r">
              <div className="UserP-box-r-body">
                <div>Team Owner</div>
                <div className="CreateTeam-owner">
                  <div>
                    <Avatar icon={<UserOutlined />} />
                  </div>

                  <div>
                    <div className="CreateTeam-owner-name">
                      {session.user.user_metadata.name}
                    </div>
                    <div className="CreateTeam-owner-email">
                      {session.user.email}
                    </div>
                  </div>
                </div>

                <div className="UserP-input-container">
                  <label htmlFor="teamname">Team Name</label>
                  <input
                    type="text"
                    name="teamname"
                    id="teamname"
                    {...getFieldProps("teamname")}
                  />

                  {touched.teamname && errors.teamname && (
                    <div className="txt-input-error">{errors.teamname}</div>
                  )}
                </div>
              </div>

              <div className="UserP-box-footer">
                <button
                  type="submit"
                  className="UserP-box-submitBtn"
                  onClick={handleSubmit}
                >
                  <Spin
                    spinning={loading}
                    size="small"
                    className="CreateTeam-Loading"
                  />
                  CREATE
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateTeam;
