import React, { useState, useContext, useEffect } from "react";
import "./teamScreen.css";

// import Header from "../../components/header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { AuthContext } from "../../context/auth/AuthContext";
import { message, Spin } from "antd";
import * as Yup from "yup";
import { Formik, Form } from "formik";

function TeamScreen() {
  const navigate = useNavigate();
  const { id: TEAM_ID } = useParams();
  const { session } = useContext(AuthContext); // session.user.id
  const [teamName, setTeamName] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Spinners in buttons
  const [teamNameSpin, setTeamNameSpin] = useState(false);
  const [deleteTeamSpin, setDeleteTeamSpin] = useState(false);
  const [addMemberSpin, setAddMemberSpin] = useState(false);

  useEffect(() => {
    document.title = "Teams - SEO Checklist";
  }, []);

  useEffect(() => {
    let isActive = true;
    setPageLoading(true);

    async function fetchTeamInfo() {
      const { data, error } = await supabase
        .from("team_users")
        .select(
          `
      team_id(
        name
      )
      `
        )
        .match({
          team_id: TEAM_ID,
          user_id: session.user.id,
        });

      if (error) {
        console.log(error);
        navigate("/");
      } else {
        console.log(data);

        if (data.length === 0) {
          // console.log(data);
          console.log("The team doesn't exist or You're not a part of that.");
          navigate("/");
          return;
        }

        if (isActive) {
          setTeamName(data[0].team_id.name);
        }
      }

      setPageLoading(false);
    }
    fetchTeamInfo().finally(() => {
      console.log("Team Fecthed");
    });

    return () => {
      isActive = false;
    };
  }, [TEAM_ID]);

  // Fetch Pending Team Members
  useEffect(() => {
    let active = true;

    // get pending team members
    async function getPendingMembers() {
      const { data, error } = await supabase
        .from("team_users_pending")
        .select()
        .match({ team_id: TEAM_ID });

      if (error) {
        console.log(error);
      } else {
        console.log("Pending Members Fetched.");
        console.log(data);
        if (active) {
          setPendingMembers(data);
        }
      }
    }

    getPendingMembers();

    return () => {
      active = false;
    };
  }, [TEAM_ID]);

  // Change Team Name
  async function changeTeamName(name) {
    setTeamNameSpin(true);

    const { data, error } = await supabase
      .from("team")
      .update({ name })
      .match({ id: TEAM_ID });

    if (error) {
      console.log(error);
      setTeamNameSpin(false);
      message.error("Something Went Wrong! Please Try again later.");
    } else {
      console.log(data);
      setTeamNameSpin(false);
      message.success("Team name changed succefully.");
    }
  }

  // Delete Team
  async function deleteTeam() {
    setDeleteTeamSpin(true);

    const { data, error } = await supabase
      .from("team")
      .delete()
      .match({ id: TEAM_ID });

    if (error) {
      console.log(error);
      setDeleteTeamSpin(false);
      message.error("Something Went Wrong! Please Try again later.");
    } else {
      console.log(data);
      setDeleteTeamSpin(false);
      message.info("Team deleted succefully.");
      navigate("/");
    }
  }

  // Add Team Member (Pending)
  async function handleAddTeamMember(email) {
    // const newMemeber = {
    //   id: pendingMembers.length + 1,
    //   email,
    // };

    // isAccountExist(email);
    // return;

    // Database
    const { data, error } = await supabase.from("team_users_pending").insert([
      {
        email,
        role: "editor",
        team_id: TEAM_ID,
        inviter_Id: session.user.id,
        inviter_email: session.user.email,
        team_name: teamName,
      },
    ]);

    if (error) {
      console.log(error);
      message.error("Something Went Wrong! Please try again later.");
    } else {
      let newMembersArray = pendingMembers;
      newMembersArray.push(data[0]);
      setPendingMembers([...newMembersArray]);

      console.log("Added successfully!");
      console.log(data);

      message.success("Invitation sent successfully.");
    }
  }

  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid Email Address.")
      .required("Required!"),
  });

  // Remove member from Pending List
  async function cancelInvitation(id) {
    const oldArray = pendingMembers;

    const newArray = pendingMembers.filter((member) => member.id !== id);
    setPendingMembers([...newArray]);
    //

    const { data, error } = await supabase
      .from("team_users_pending")
      .delete()
      .match({ id });

    if (error) {
      console.log(error);
      setPendingMembers([...oldArray]);
      message.error("Something Went Wrong! Please try again later.");
    } else {
      console.log(data);
      message.success("Canceled the invitatation, Successfully.");
    }
  }

  // Fetch All Team Memebers
  useEffect(() => {
    let active = true;

    async function getAllMembers() {
      const { data, error } = await supabase
        .from("team_users")
        .select(
          `
        id,
        role,
        team_id,
        user_id(
          name,
          user_id
        ),
        created_at
        `
        )
        .match({ team_id: TEAM_ID });

      if (error) {
        console.log(error);
      } else {
        console.log("Team Members Fetched.");
        console.log(data);
        if (active) {
          setTeamMembers(data);
        }
      }
    }

    getAllMembers();

    return () => {
      active = false;
    };
  }, [TEAM_ID]);

  // Remove a member from the Team
  async function removeMember(id) {
    const oldArray = teamMembers;

    const newArray = teamMembers.filter((member) => member.id !== id);
    setTeamMembers([...newArray]);
    //

    const { data, error } = await supabase
      .from("team_users")
      .delete()
      .match({ id });

    if (error) {
      console.log(error);
      setPendingMembers([...oldArray]);
      message.error("Something Went Wrong! Please try again later.");
    } else {
      console.log(data);
      message.success("Member removed, Successfully.");
    }
  }

  return (
    <div className="TeamScreen">
      {/* <Header /> */}
      <div className="TeamScreen-header">Team Settings</div>

      {/* --- Team Name --- */}
      {pageLoading ? (
        <div className="Spin-container">
          <Spin />
        </div>
      ) : (
        <>
          <div className="TeamScreen-box">
            <div className="TeamScreen-box-l">
              <div>Team Name</div>
              <div>The Team's name and owner information.</div>
            </div>

            <div className="TeamScreen-box-r">
              <div className="TeamScreen-box-r-body">
                <div className="TeamScreen-input-container">
                  <label htmlFor="teamname">Team Name</label>
                  <input
                    type="text"
                    name="teamname"
                    id="teamname"
                    defaultValue={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
              </div>

              <div className="TeamScreen-box-footer">
                <div
                  className="TeamScreen-box-submitBtn"
                  onClick={() => changeTeamName(teamName)}
                >
                  <Spin size="small" spinning={teamNameSpin} />
                  Save
                </div>
              </div>
            </div>
          </div>

          {/* --- Add Team Member --- */}
          <div className="TeamScreen-box">
            <div className="TeamScreen-box-l">
              <div>Add Team Member</div>
              <div>
                Add a new team member to your team, allowing them to collaborate
                with you.
              </div>
            </div>

            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={emailSchema}
              onSubmit={(values, { resetForm }) => {
                // Add user logic goes here
                // console.log(values);
                setAddMemberSpin(true);

                handleAddTeamMember(values.email).finally(() => {
                  setAddMemberSpin(false);
                  resetForm();
                });
              }}
            >
              {({ errors, touched, getFieldProps, handleSubmit }) => (
                <Form className="TeamScreen-box-r">
                  <div className="TeamScreen-box-r-body">
                    <p>
                      Please provide the email address of the person you would
                      like to add to this team.
                    </p>

                    <div className="TeamScreen-input-container">
                      <label htmlFor="email">Email</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        {...getFieldProps("email")}
                      />

                      {touched.email && errors.email && (
                        <div className="teamScreen-txt-input-error">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="TeamScreen-box-footer">
                    <div
                      className="TeamScreen-box-submitBtn"
                      onClick={handleSubmit}
                    >
                      <Spin size="small" spinning={addMemberSpin} />
                      Add
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* --- Pending Team Invitations --- */}
          {pendingMembers.length !== 0 && (
            <div className="TeamScreen-box">
              <div className="TeamScreen-box-l">
                <div>Pending Team Invitations</div>
                <div>
                  These people have been invited to your team and have been sent
                  an invitation email. They may join the team by accepting the
                  email invitation.
                </div>
              </div>

              <div className="TeamScreen-box-r">
                <div className="TeamScreen-box-r-body">
                  {pendingMembers.map((member) => {
                    return (
                      <div
                        className="TeamScreen-box-pendingTeam"
                        key={member.id}
                      >
                        <div>{member.email}</div>
                        <div onClick={() => cancelInvitation(member.id)}>
                          Cancel
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* --- All Team Member --- */}
          {teamMembers.length !== 0 && (
            <div className="TeamScreen-box">
              <div className="TeamScreen-box-l">
                <div>Team Members</div>
                <div>All of the people that are part of this team.</div>
              </div>
              <div className="TeamScreen-box-r">
                <div className="TeamScreen-box-r-body">
                  {/*  */}
                  {teamMembers.map((member) => {
                    const amIAnAdmin = member.role === "admin";
                    // const thisIsMe = session.user.id == member.user_id.user_id;
                    // const amIAnEditor = member.role == "editor";

                    // console.log({
                    //   name: member.user_id.name,
                    //   amIAnEditor,
                    //   amIAnAdmin,
                    //   thisIsMe,
                    // });

                    return (
                      <div
                        className="TeamScreen-box-pendingTeam"
                        key={member.id}
                      >
                        <div className="TeamScreen-pendingTeam-name">
                          {member.user_id.name}
                        </div>

                        {/* {((thisIsMe && amIAnEditor) || amIAnAdmin) && ( */}
                        {amIAnAdmin && (
                          <div
                            onClick={() => removeMember(member.id)}
                            className="TeamScreen-pendingTeam-button"
                          >
                            Remove
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/*  */}
                </div>
              </div>
            </div>
          )}

          {/* --- Delete Team --- */}
          <div className="TeamScreen-box">
            <div className="TeamScreen-box-l">
              <div>Delete Team</div>
              <div>Permanently delete this team.</div>
            </div>

            <div className="TeamScreen-box-r">
              <div className="TeamScreen-box-r-body">
                <p>
                  Once a team is deleted, all of its resources and data will be
                  permanently deleted. Before deleting this team, please
                  download any data or information regarding this team that you
                  wish to retain.
                </p>

                <div
                  className="TeamScreen-box-submitBtn TeamScreen-delete-btn"
                  style={{ background: "#DC2626" }}
                  onClick={() => deleteTeam()}
                >
                  <Spin size="small" spinning={deleteTeamSpin} />
                  DELETE TEAM
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TeamScreen;
