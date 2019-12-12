import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";

const AddUser = props => {
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: ""
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        props.addUser(values);
        resetForm();
        setSubmitting(false);
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required("Username is required"),
        email: Yup.string()
          .email("Enter a valid email")
          .required("Email is required"),
        password: Yup.string().required("Password is required")
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
                className="input"
                type="text"
                placeholder="Enter a username"
              />
              {errors.username && touched.username && (
                <div className="input-feedback">{errors.username}</div>
              )}
            </div>
            <div className="field">
              <label className="label is-large" htmlFor="input-email">
                Email
              </label>
              <input
                name="email"
                id="input-email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
                type="email"
                placeholder="Enter an email address"
              />
              {errors.email && touched.email && (
                <div className="input-feedback">{errors.email}</div>
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
                className="input"
                type="password"
                placeholder="Enter a password"
              />
              {errors.password && touched.password && (
                <div className="input-feedback">{errors.password}</div>
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

AddUser.propTypes = {
  addUser: PropTypes.func.isRequired
};

export default AddUser;
