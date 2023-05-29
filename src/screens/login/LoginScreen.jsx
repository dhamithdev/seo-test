import React, { useEffect, useState } from "react";
import "./loginScreen.css";
import LogoIcon from "../../assets/Logo.svg";

import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Formik, Form } from "formik";
import { Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import * as Yup from "yup";

function LoginScreen() {
  const [submiting, setSubmiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - SEO Checklist";
  }, []);

  async function signInWithEmail({ values, resetForm }) {
    setSubmiting(true);

    if (errorMessage) {
      setErrorMessage(null);
    }

    const { error } = await supabase.auth.signIn({
      email: values.email,
      password: values.password,
    });

    if (error) {
      // console.log(error);
      setErrorMessage(error.message);
      setSubmiting(false);
      resetForm();
    } else {
      // console.log(user);
      setSubmiting(false);

      resetForm();
      navigate("/", { replace: true });
    }
  }

  const DisplayingErrorMessagesSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().max(50, "Too Long!").required("Required"),
  });

  return (
    <div className="LoginScreen">
      <div className="ls-container">
        <img src={LogoIcon} alt="Logo" />

        <h2 className="ls-headline">Sign in to your account</h2>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={DisplayingErrorMessagesSchema}
          onSubmit={(values, { resetForm }) => {
            const a = { values, resetForm };
            signInWithEmail(a);

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
            <Form className="ls-box">
              {submiting && (
                <div className="ls-container-loading">
                  <Spin size="large" />
                </div>
              )}

              {errorMessage && (
                <div className="ls-container-error">
                  <ExclamationCircleOutlined /> {errorMessage}
                </div>
              )}

              {/* ------------------------------- */}
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

              <div className="ls-rememberMe">
                <div>
                  <input type="checkbox" name="save" id="save" />
                  <label htmlFor="save">Remember me</label>
                </div>

                <Link
                  to="/forgot-password"
                  className="NoLink"
                  style={{
                    color: "#4f46e5",
                  }}
                >
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                className="NoLink mybtn ls-login"
                onClick={handleSubmit}
              >
                Log in
              </button>

              <Link
                className="mybtn ls-register"
                to="/register"
                style={{
                  color: "#4f46e5",
                }}
              >
                Register
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginScreen;
