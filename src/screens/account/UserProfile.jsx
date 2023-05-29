import React, { useContext, useEffect } from "react";
import "./userProfile.css";

// import Header from "../../components/header/Header";
import { AuthContext } from "../../context/auth/AuthContext";
import { supabase } from "../../supabaseClient";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Spin, message } from "antd";

function UserProfile() {
  const { session } = useContext(AuthContext);
  const USER_ID = session.user.id;

  // Spinners in buttons
  const [emailSpin, setEmailSpin] = useState(false);
  const [passwordSpin, setPasswordSpin] = useState(false);
  const [deleteSpin, setDeleteSpin] = useState(false);

  useEffect(() => {
    document.title = "User Profile - SEO Checklist";
  }, []);

  // console.log(session.user.id);
  // console.log(session);

  // async function fetchUsername(id) {
  //   const { data, error } = await supabase
  //     .from("profile")
  //     .select()
  //     .match({ user_id: id });
  //   // .eq("user_id", `${id}`);

  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log(data);
  //   }
  // }

  // useEffect(() => {
  //   fetchUsername(session.user.id);
  // }, []);

  // Change Password
  const handleChangePassword = async (password) => {
    setPasswordSpin(true);

    const { user, error } = await supabase.auth.update({ password });
    if (error) {
      console.log(error);
      message.error("Something Went Wrong! Please try again later.");
    } else {
      console.log(user);
      message.success("Password Changed Succefully.");
    }
  };
  const passwordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters!")
      .max(50, "Password cannot be longer than 50 characters!")
      .required("Required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match!")
      .required("Required!"),
  });

  // Profile Info (Email) - Update
  const handleChangeEmail = async (email) => {
    setEmailSpin(true);

    const { user, error } = await supabase.auth.update({ email });

    if (error) {
      console.log(error);
      message.error("Something went wrong! Please try again later.");
    } else {
      message.success(
        "Email Changed successfully! Check you inbox to confirm your new Email."
      );
      console.log(user);
    }
  };
  const emailSchema = Yup.object().shape({
    newEmail: Yup.string()
      .email()
      .required("Required"),
  });

  // Delete Account
  const handleDeleteAccount = async () => {
    setDeleteSpin(true);
    console.log("Delete: " + USER_ID);

    const { data: user, error } = await supabase.auth.api
      .deleteUser(USER_ID)
      .finally(() => setDeleteSpin(false));

    if (error) {
      console.log(error);
    } else {
      console.log(user);
    }
  };

  return (
    <div className="UserProfile">
      {/* <Header /> */}
      <div className="UserP-header">Profile</div>

      <>
        {/* --- --- Update Profile Information --- --- */}
        <div className="UserP-box">
          <div className="UserP-box-l">
            <div>Profile Information</div>
            <div>
              Update your account's profile information and email address.
            </div>
          </div>

          <Formik
            initialValues={{
              newEmail: session.user.email,
            }}
            validationSchema={emailSchema}
            onSubmit={(values, { resetForm }) => {
              handleChangeEmail(values.newEmail).finally(() => {
                resetForm();
                setEmailSpin(false);
              });
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit, values }) => (
              <Form className="UserP-box-r">
                <div className="UserP-box-r-body">
                  {/* <div className="UserP-input-container">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={session.user.user_metadata.name}
                    />
                  </div> */}

                  <div className="UserP-input-container">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="newEmail"
                      id="newEmail"
                      {...getFieldProps("newEmail")}
                    />

                    {touched.newEmail && errors.newEmail && (
                      <div className="profile-txt-input-error">
                        {errors.newEmail}
                      </div>
                    )}
                  </div>
                </div>

                <div className="UserP-box-footer">
                  <div className="UserP-box-submitBtn" onClick={handleSubmit}>
                    <Spin size="small" spinning={emailSpin} />
                    Save
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* --- --- Update Password --- --- */}
        <div className="UserP-box">
          <div className="UserP-box-l">
            <div>Update Password</div>
            <div>
              Ensure your account is using a long, random password to stay
              secure.
            </div>
          </div>

          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={passwordSchema}
            onSubmit={(values, { resetForm }) => {
              handleChangePassword(values.newPassword).finally(() => {
                resetForm();
                setPasswordSpin(false);
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
                  <div className="UserP-input-container">
                    <label htmlFor="newpassword">New Password</label>
                    <input
                      type="password"
                      name="newpassword"
                      id="newpassword"
                      {...getFieldProps("newPassword")}
                    />

                    {touched.newPassword && errors.newPassword && (
                      <div className="profile-txt-input-error">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>

                  <div className="UserP-input-container">
                    <label htmlFor="confirmpassword">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmpassword"
                      id="confirmpassword"
                      {...getFieldProps("confirmPassword")}
                    />

                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="profile-txt-input-error">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                <div className="UserP-box-footer">
                  <div className="UserP-box-submitBtn" onClick={handleSubmit}>
                    <Spin size="small" spinning={passwordSpin} />
                    Save
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* --- --- Delete Account --- --- */}
        <div className="UserP-box">
          <div className="UserP-box-l">
            <div>Delete Account</div>
            <div>Permanently delete your account.</div>
          </div>

          <div className="UserP-box-r">
            <div className="UserP-box-r-body">
              <p>
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Before deleting your account, please
                download any data or information that you wish to retain.
              </p>

              <div
                className="UserP-box-submitBtn UserP-box-submitBtn-delete"
                style={{ background: "#DC2626" }}
                onClick={handleDeleteAccount}
              >
                <Spin size="small" spinning={deleteSpin} />
                DELETE ACCOUNT
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default UserProfile;
