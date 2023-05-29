import React, { useEffect, useState } from "react";
import LogoIcon from "../../assets/Logo.svg";
import "./registerScreen.css";

import { Link, useNavigate } from "react-router-dom";
import { Checkbox, Spin, message } from "antd";
import { supabase } from "../../supabaseClient";
import { Formik, Form } from "formik";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import * as Yup from "yup";

function RegisterScreen() {
  const [agreed, setAgreed] = useState(true);
  const [submiting, setSubmiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register - SEO Checklist";
  }, []);

  function onCheckboxChange(e) {
    setAgreed(e.target.checked);
  }

  async function signUpWithEmail(values) {
    const { user, error } = await supabase.auth.signUp(
      {
        email: values.email,
        password: values.confirmPassword,
      },
      {
        data: {
          name: values.name,
          role: "Normal",
        },
      }
    );

    if (error) {
      setErrorMessage("Something went wrong!");
      setSubmiting(false);

      console.log(error);
      return;
    } else {
      console.log(user);
      // AddUsersName(user.id, values.name);
      message.success({
        content:
          "Account created successfuly. Please check you emails and verify your Email address to Login!",
        duration: 10,
      });
      navigate("/login");
    }
  }

  // async function AddUsersName(id, name) {
  //   const { data, error } = await supabase
  //     .from("user")
  //     .insert([{ id: parseInt(id), name: name, user_id: parseInt(id) }]);
  //   if (error) {
  //     console.log("creating User Profile Error:");
  //     console.log(error.message);
  //   } else {
  //     console.log(data);
  //   }
  // }

  function onSignUpClick(values) {
    errorMessage != null && setErrorMessage(null);
    setSubmiting(true);
    signUpWithEmail(values).then(() => {
      if (submiting) setSubmiting(false);
    });
  }

  const DisplayingErrorMessagesSchema = Yup.object().shape({
    name: Yup.string()
      .min(3)
      .max(50, "Name cannot be longer than 50 characters!")
      .required("Required"),

    email: Yup.string()
      .email("Please enter a valid email address!")
      .required("Required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password cannot be longer than 50 characters!")
      .required("Required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  return (
    <div className="RegisterScreen">
      <div className="rs-container">
        <img src={LogoIcon} alt="Logo" />

        <div className="rs-headline">Register</div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={DisplayingErrorMessagesSchema}
          onSubmit={(values, { resetForm }) => {
            onSignUpClick(values);

            // resetForm({
            //   values: {
            //     email: "",
            //     password: "",
            //   },
            // });
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
            <Form className="rs-box">
              {submiting && (
                <div className="ls-container-loading">
                  <Spin size="large" />
                </div>
              )}

              {errorMessage && (
                <div
                  className="ls-container-error"
                  style={{ paddingTop: "25px" }}
                >
                  <ExclamationCircleOutlined /> {errorMessage}
                </div>
              )}

              {/* ------------------------------------------------------ */}
              <div className="txt-input-container">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  // onChange={(e) => setName(e.target.value)}
                  {...getFieldProps("name")}
                />

                {touched.name && errors.name && (
                  <div className="txt-input-error">{errors.name}</div>
                )}
              </div>

              <div className="txt-input-container">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  // onChange={(e) => setEmail(e.target.value)}
                  {...getFieldProps("email")}
                />

                {touched.email && errors.email && (
                  <div className="txt-input-error">{errors.email}</div>
                )}
              </div>

              <div className="txt-input-container">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  // onChange={(e) => setPassword(e.target.value)}
                  {...getFieldProps("password")}
                />

                {touched.password && errors.password && (
                  <div className="txt-input-error">{errors.password}</div>
                )}
              </div>

              <div className="txt-input-container">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  // onChange={(e) => setConfirmPassword(e.target.value)}
                  {...getFieldProps("confirmPassword")}
                />

                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="txt-input-error">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="rs-agree">
                <Checkbox
                  onChange={onCheckboxChange}
                  name="agree"
                  id="agree"
                  defaultChecked={agreed}
                >
                  I agree to the <u>Terms of Service</u> and{" "}
                  <u>Privacy Policy</u>
                </Checkbox>
              </div>

              <div
                className="rs-login"
                style={{
                  color: "#4f46e5",
                }}
              >
                <Link to="/login" className="NoLink">
                  Already registered?
                </Link>
              </div>

              <div className="mybtn rs-register" onClick={handleSubmit}>
                Register
              </div>

              {/* ------------------------------------------------------ */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegisterScreen;
