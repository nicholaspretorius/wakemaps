import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Users from "./../Users";

afterEach(cleanup);

const users = [
  {
    id: 1,
    username: "nicholas",
    email: "nicholaspretorius@gmail.com",
    active: true
  },
  {
    id: 2,
    username: "nic",
    email: "nic@fake.com",
    active: true
  }
];

it("renders", () => {
  const { asFragment } = render(<Users users={users} />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders a username", () => {
  const { getByText } = render(<Users users={users} />);
  expect(getByText("nicholas")).toHaveClass("username");
  expect(getByText("nic")).toHaveClass("username");
});
