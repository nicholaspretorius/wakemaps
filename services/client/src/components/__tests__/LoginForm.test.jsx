import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import LoginForm from "./../LoginForm";

afterEach(cleanup);

const props = {
  handleLoginFormSubmit: () => {
    return true;
  },
  isAuthenticated: () => {
    return false;
  }
};

it("renders properly", () => {
  const { getByText } = renderWithRouter(<LoginForm {...props} />);
  expect(getByText("Login")).toHaveClass("title");
});

it("renders with the default props", () => {
  const { getByLabelText, getByText } = renderWithRouter(
    <LoginForm {...props} />
  );

  const emailInput = getByLabelText("Email");
  expect(emailInput).toHaveAttribute("type", "email");
  expect(emailInput).not.toHaveValue();

  const passwordInput = getByLabelText("Password");
  expect(passwordInput).toHaveAttribute("type", "password");
  expect(passwordInput).not.toHaveValue();

  const buttonInput = getByText("Submit");
  expect(buttonInput).toHaveValue("Submit");
});

it("renders", () => {
  const { asFragment } = renderWithRouter(<LoginForm {...props} />);
  expect(asFragment()).toMatchSnapshot();
});
