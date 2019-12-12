import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Nav from "./../Nav";

afterEach(cleanup);

const props = {
  title: "Hello world!",
  logout: () => {
    return true;
  }
};

it("renders a title", () => {
  const { getByText } = renderWithRouter(<Nav {...props} />);
  expect(getByText(props.title)).toHaveClass("nav-title");
});

it("renders", () => {
  const { asFragment } = renderWithRouter(<Nav {...props} />);
  expect(asFragment()).toMatchSnapshot();
});
