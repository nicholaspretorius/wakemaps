import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import "./forms.css";

const RegisterForm = props => {
  const { isAuthenticated } = props;

  if (isAuthenticated()) {
    return <Redirect to="/" />;
  }
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: ""
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        props.handleRegisterFormSubmit(values);
        resetForm();
        setSubmitting(false);
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required("Username is required")
          .min(6, "Username must be greater than 5 characters"),
        email: Yup.string()
          .email("Enter a valid email")
          .required("Email is required")
          .min(6, "Email must be greater than 5 characters"),
        password: Yup.string()
          .required("Password is required")
          .min(7, "Password must be at least 8 characters")
      })}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit
        } = props;

        return (
          <form onSubmit={handleSubmit}>
            <h2 className="title">Register</h2>
            <div className="field">
              <label className="label" htmlFor="input-username">
                Username
              </label>
              <input
                name="username"
                id="input-username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.username && touched.username ? "input errors" : "input"
                }
                type="text"
                placeholder="Enter a username"
              />
              {errors.username && touched.username && (
                <div className="input-feedback" data-testid="errors-username">
                  {errors.username}
                </div>
              )}
            </div>
            <div className="field">
              <label className="label" htmlFor="input-email">
                Email
              </label>
              <input
                name="email"
                id="input-email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.email && touched.email ? "input errors" : "input"
                }
                type="email"
                placeholder="Enter an email"
              />
              {errors.email && touched.email && (
                <div className="input-feedback" data-testid="errors-email">
                  {errors.email}
                </div>
              )}
            </div>
            <div className="field">
              <label className="label" htmlFor="input-password">
                Password
              </label>
              <input
                name="password"
                id="input-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.password && touched.password ? "input errors" : "input"
                }
                type="password"
                placeholder="Enter a password"
              />
              {errors.password && touched.password && (
                <div className="input-feedback" data-testid="errors-password">
                  {errors.password}
                </div>
              )}
            </div>

            <input
              type="submit"
              className="button is-primary"
              value="Submit"
              disabled={isSubmitting}
            />
          </form>
        );
      }}
    </Formik>
  );
};

RegisterForm.propTypes = {
  handleRegisterFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default RegisterForm;
