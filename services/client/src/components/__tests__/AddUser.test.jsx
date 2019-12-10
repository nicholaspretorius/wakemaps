import React from "react";
import { render, cleanup, getByLabelText, getByText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AddUser from "./../AddUser";

afterEach(cleanup);

it("renders", () => {
  const { asFragment } = render(<AddUser username="" email="" handleChange={() => true} />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders with default props", () => {
  const { getByLabelText, getByText } = render(
    <AddUser usrname="" email="" handleChange={() => true} />
  );

  const usernameInput = getByLabelText("Username");
  expect(usernameInput).toHaveAttribute("type", "text");
  expect(usernameInput).toHaveAttribute("required");
  expect(usernameInput).not.toHaveValue();

  const emailInput = getByLabelText("Email");
  expect(emailInput).toHaveAttribute("type", "email");
  expect(emailInput).toHaveAttribute("required");
  expect(emailInput).not.toHaveValue();

  const buttonInput = getByText("Submit");
  expect(buttonInput).toHaveValue("Submit");
});
